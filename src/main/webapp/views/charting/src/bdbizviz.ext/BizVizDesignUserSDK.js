/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: BizVizDesignerSDK.js
 * @description Scripting SDK methods
 **/
function BizvizSDK(db) {
	var dashboard = "",
		lastChangedItem = "",
		enableLog = true,
		logItems = [],
		exceptionKeys = [];
	/** @description Object available for user can be used for saving previous script execution results **/
	var context = [];
	context["localtime"] = "";
	context["dashboard_user"] = {};
	context["dashboard_isopendoc"] = false;
	context["dashboard_dashboardparameters"] = {};

	/** BDD-860 Calculation object for standard MATH operations **/
	this.calculation = {
		NUMBER: {
			add : function(a, b){
				return a*1 + b*1;
			},
			substract : function(a, b){
				return a*1 - b*1;
			},
			multiply : function(a, b){
				return a*b;
			},
			division : function(a, b){
				return a*1 / b*1;
			}
		},
		STRING: {
			concat : function(a, b){
				return a +""+ b;
			}
		},
		DATE: {
			getLocalDate : function(d){
				var date = new Date(d);
				var yr = date.getFullYear();
				var mnl = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				var mns = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
				var month = mns[date.getMonth()];
				var day = date.getDate();
				var hr = date.getHours();
				var min = date.getMinutes();
				return month +" "+ day +", "+ yr +" "+ hr +":"+ min;
			}
		}
	};
	
	this.lastChangedItemMap = {};
	/** @description Initialized from inside charting, Not supposed to use by dashboard design user **/
	this.init = function(dashboard) {
	  //setTimeout(function(){
		sdk.dashboard = dashboard;
		sdk.updateGlobalVariable("context", context, false);
		sdk.updateGlobalVariable("dashboard", {}, true);//DAS-708 alert script executing twice
	  //}, 10);
	};
	/** @description Setter method to set lastChangedItem **/
	this.setLastChangedItem = function(lastChangedItem) {
		this.lastChangedItemMap[lastChangedItem.key] = lastChangedItem;
		this.lastChangedItem = lastChangedItem;
	};
	/** @description Same as addContext method, ADD renamed to SET for easy understanding **/
	this.setContext = function(key, value, noUpdate) {
		this.addContext(key, value, noUpdate);
	};
	/** @description Adds a key-value pair in context map **/
	this.addContext = function(key, value, noUpdate) {
		context[key] = value;
		if (!noUpdate) {
			this.updateGlobalVariable("context", context, false);
		}
	};
	/*this.excelExport = function(componentsIdArray){
		var temp = new ExportToPPTButton();//this.getWidget(componentsIdArray[0]);
		temp.m_dashboard = this.getWidget(componentsIdArray[0]).m_dashboard;
		var wb = new Workbook();
		*//** Boolean changed to int as if last component is having no data, download will not happen **//*
		var isDownloadable = 0;
		var file_name = (temp.m_pptheading) ? temp.m_pptheading : "Dashboard";
		showBlockUILoader(30000);
		temp.m_titleArray = [];
		var count = 1;
		*//**added m_excelsheet variable for downloading all components data in one sheet BDD-883**//*
		if (temp.m_excelsheet != "single") {
		    for (var comp = 0; comp < temp.m_dashboard.m_widgetsArray.length; comp++) {
		    	if(temp.m_dashboard.m_widgetsArray[comp].m_objecttype == "datagrid" || temp.m_dashboard.m_widgetsArray[comp].m_objecttype == "scorecard" || temp.m_dashboard.m_widgetsArray[comp].m_objecttype == "chart" || temp.m_dashboard.m_widgetsArray[comp].m_objecttype == "funnel"){
		    		var Cdetail = temp.m_dashboard.m_widgetsArray[comp].plugin.getDetailData();
		    	}
		    	if(Cdetail !== undefined && Cdetail.sheetDetail !== undefined && Cdetail.sheetDetail.length > 0 && Cdetail.sheetDetail[0].length > 0){
					var con_data = Cdetail.sheetDetail;//exportToExcelXLSX(Cdetail.sheetDetail, Cdetail.sheetName, file_name, wb);
				} else {
					var con_data = [];
				}
		        if (temp.m_dashboard.m_widgetsArray[comp].m_repeaterCharts !== undefined && temp.m_dashboard.m_widgetsArray[comp].m_repeaterCharts.length > 0) {
		            for (var rcomp = 0; rcomp < temp.m_dashboard.m_widgetsArray[comp].m_repeaterCharts.length; rcomp++) {
		                var component = temp.m_dashboard.m_widgetsArray[comp].m_repeaterCharts[rcomp];
		                temp.showChartData = new ShowChartData(component);
		                // added if/else conditions for exporting repeater charts from export window for the token BDD-725
		                if (IsBoolean(component.m_isDataSetavailable) && !IsBoolean(component.m_isEmptySeries) && (componentsIdArray === undefined || componentsIdArray.indexOf(temp.m_dashboard.m_widgetsArray[comp].m_repeaterCharts[rcomp].m_referenceid) > -1)) {
		                    try {
		                        isDownloadable++;
		                        var data = temp.getExcelData(component);
		                        var sheetName = component.m_referenceid;
		                        try {
		                            sheetName = temp.getSheetNameForComponent(component, wb.Sheets, false);
		                            if (temp.m_titleArray.indexOf(sheetName) > -1) {
		                                sheetName = sheetName + count;
		                                count++;
		                            }
		                            temp.m_titleArray.push(sheetName);
		                        } catch (e) {
		                            sheetName = component.m_referenceid;
		                        }
		                        sheetName = temp.getStringARSC(sheetName);
		                        wb.SheetNames.push(sheetName);
		                        wb.Sheets[sheetName] = sheet_from_array_of_arrays(data);
		                    } catch (e) {
		                        console.log(e);
		                    }
		                }
		            }
		        } else if(temp.m_dashboard.m_widgetsArray[comp].m_objecttype == "datagrid" || temp.m_dashboard.m_widgetsArray[comp].m_objecttype == "scorecard" || temp.m_dashboard.m_widgetsArray[comp].m_objecttype == "chart" || temp.m_dashboard.m_widgetsArray[comp].m_objecttype == "funnel") {
		            var component = temp.m_dashboard.m_widgetsArray[comp];
		            temp.showChartData = new ShowChartData(component);
		            if (IsBoolean(component.m_isDataSetavailable) && !IsBoolean(component.m_isEmptySeries) && (componentsIdArray === undefined || componentsIdArray.indexOf(temp.m_dashboard.m_widgetsArray[comp].m_referenceid) > -1)) {
		                try {
		                    isDownloadable++;
		                    var data = temp.getExcelData(component);
		                    var abc = [""];
		                    var total_data =  con_data.concat(abc,data);
		                    var sheetName = component.m_referenceid;
		                    try {
		                        sheetName = temp.getSheetNameForComponent(component, wb.Sheets, false);
		                        if (temp.m_titleArray.indexOf(sheetName) > -1) {
		                            sheetName = sheetName + count;
		                            count++;
		                        }
		                        temp.m_titleArray.push(sheetName);
		                    } catch (e) {
		                        sheetName = component.m_referenceid;
		                    }
		                    sheetName = temp.getStringARSC(sheetName);
		                    wb.SheetNames.push(sheetName);
		                    wb.Sheets[sheetName] = sheet_from_array_of_arrays(total_data);
		                } catch (e) {
		                    console.log(e);
		                }
		            }
		        }
		    }
		} else {
		    sheetName = temp.m_excelsheetname;
		    var arr = [];
		    //arr[0] = [];
		    for (var comp = 0; comp < temp.m_dashboard.m_widgetsArray.length; comp++) {
		        var component = temp.m_dashboard.m_widgetsArray[comp];
		        temp.showChartData = new ShowChartData(component);
		        if (temp.m_dashboard.m_widgetsArray[comp].m_repeaterCharts !== undefined && temp.m_dashboard.m_widgetsArray[comp].m_repeaterCharts.length > 0) {
		            for (var rcomp = 0; rcomp < temp.m_dashboard.m_widgetsArray[comp].m_repeaterCharts.length; rcomp++) {
		                var component = temp.m_dashboard.m_widgetsArray[comp].m_repeaterCharts[rcomp];
		                temp.showChartData = new ShowChartData(component);
		                // added if/else conditions for exporting repeater charts from export window for the token BDD-725
		                if (IsBoolean(component.m_isDataSetavailable) && !IsBoolean(component.m_isEmptySeries) && (componentsIdArray === undefined || componentsIdArray.indexOf(temp.m_dashboard.m_widgetsArray[comp].m_repeaterCharts[rcomp].m_objectid) > -1)) {
		                    var l = arr.length;
		                    arr[l] = [];
		                    arr[l]["0"] = [];
		                    arr[l]["0"] = component.m_referenceid; //+ "" + (rcomp + 1)
		                    isDownloadable++;
		                    var data = temp.getExcelData(component);
		                    arr = arr.concat(data);
		                    arr[arr.length] = [];
		                }
		            }
		        } else if (IsBoolean(component.m_isDataSetavailable) && !IsBoolean(component.m_isEmptySeries) && (componentsIdArray === undefined || componentsIdArray.indexOf(temp.m_dashboard.m_widgetsArray[comp].m_objectid) > -1)) {
		            var l = arr.length;
		            arr[l] = [];
		            arr[l]["0"] = [];
		            arr[l]["0"] = component.m_referenceid;
		            isDownloadable++;
		            var data = temp.getExcelData(component);
		            arr = arr.concat(data);
		            arr[arr.length] = [];
		        }
		    }
		    wb.SheetNames.push(sheetName);
		    wb.Sheets[sheetName] = sheet_from_array_of_arrays(arr);
		}
		if (isDownloadable > 0) {
		    downloadXLSX(wb, file_name);
		} else {
		    alertPopUpModal({
		        type: 'error',
		        message: "Error occurred. No data available to download",
		        timeout: '3000'
		    });
		}
		hideBlockUILoader();
	};*/
	
	this.excelExport = function(componentsIdArray, sheetarr, filterarr, filename, loadermessage){
		var temp = new ExportToPPTButton(); //this.getWidget(componentsIdArray[0]);
		temp.m_dashboard = this.getWidget(componentsIdArray[0]).m_dashboard;
		var wb = new Workbook();
		/** Boolean changed to int as if last component is having no data, download will not happen **/
		var isDownloadable = 0;
	    var filter_array = (Array.isArray(filterarr)) ? filterarr : " " ;
		var file_name = (filename) ? filename : ((filterarr) ? filterarr : "Dashboard"); //(temp.m_pptheading) ? temp.m_pptheading : "Dashboard";
		showBlockUILoaderExcel(30000,loadermessage);
		temp.m_titleArray = [];
		var count = 1;
		/**added m_excelsheet variable for downloading all components data in one sheet BDD-883**/
		if (temp.m_excelsheet != "single") {
		    for (var comp = 0; comp < componentsIdArray.length; comp++) {
		        var chart = this.getWidget(componentsIdArray[comp]);
		        var data, filter, abc, total_data, sheetName;
		        if (chart.m_objecttype == "datagrid" || chart.m_objecttype == "scorecard" || chart.m_objecttype == "chart" || chart.m_objecttype == "funnel") {
		            var Cdetail = chart.plugin.getDetailData();
		        }
		        if (Cdetail !== undefined && Cdetail.sheetDetail !== undefined && Cdetail.sheetDetail.length > 0 && Cdetail.sheetDetail[0].length > 0) {
		            var con_data = Cdetail.sheetDetail; //exportToExcelXLSX(Cdetail.sheetDetail, Cdetail.sheetName, file_name, wb);
		         /** CP-930: added filterarr array for excluding filter value in excel sheeets **/
				   if (filter_array.length == 0 || filter_array == undefined ||  filter_array[comp] == undefined) {
						con_data = Cdetail.sheetDetail;
					} else {
						for (var i = 0; i < filter_array[comp].length; i++) {
							for (var j = 0; j < con_data.length; j++) {
								if (filter_array[comp][i] == con_data[j][0]) {
									con_data.splice(j, 1)
								}
							}
						}
					}
		        } else {
		            var con_data = [];
		        }
			    for (var j = 0; j < con_data.length; j++) {
					try {
						var a = con_data[j][0].replace(/_/g, " ");
						var filtered_data = a.charAt(0).toUpperCase()+ a.slice(1);
						con_data[j][0] = filtered_data;
					} catch (e) {
						console.log(e);
					}
				}
		        if (chart.m_repeaterCharts !== undefined && chart.m_repeaterCharts.length > 0) {
		            for (var rcomp = 0; rcomp < chart.m_repeaterCharts.length; rcomp++) {
		                var component = chart.m_repeaterCharts[rcomp];
		                temp.showChartData = new ShowChartData(component);
		                // added if/else conditions for exporting repeater charts from export window for the token BDD-725
		                if (IsBoolean(component.m_isDataSetavailable) && !IsBoolean(component.m_isEmptySeries) && (componentsIdArray === undefined || componentsIdArray.indexOf(chart.m_repeaterCharts[rcomp].m_referenceid) > -1)) {
		                    try {
		                        isDownloadable++;
		                        var data = temp.getExcelData(component);
		                        for (var j = 0; j < data[0].length; j++) {
		                            try {
		                                var b = data[0][j].replace(/_/g, " ");
		                                var data1 = b.charAt(0).toUpperCase() + b.slice(1);
		                                data[0][j] = data1;
		                            } catch (e) {
		                                console.log(e);
		                            }
		                        }
		                        if (con_data.length > 0) {
		                            filter = [
		                                ["Filters"]
		                            ];
		                            abc = [
		                                [""],
		                                ["Data"]
		                            ];
		                        } else {
		                            filter = [
		                                ["Data"]
		                            ];
		                            abc = [];
		                        }
		                        total_data = filter.concat(con_data, abc, data);
		                        sheetName = (sheetarr !== undefined && sheetarr[comp]) ? sheetarr[comp] + '_' + component.m_repeaterfieldvalue : chart.m_referenceid + '_' + component.m_repeaterfieldvalue; //component.m_referenceid;
		                        try {
		                            //sheetName = temp.getSheetNameForComponent(component, wb.Sheets, false);
		                            if (temp.m_titleArray.indexOf(sheetName) > -1) {
		                                sheetName = sheetName + count;
		                                count++;
		                            }
		                            temp.m_titleArray.push(sheetName);
		                        } catch (e) {
		                            sheetName = component.m_referenceid + '_' + component.m_repeaterfieldvalue;
		                        }
		                        //sheetName = temp.getStringARSC(sheetName);
		                        wb.SheetNames.push(sheetName);
		                        wb.Sheets[sheetName] = sheet_from_array_of_arrays(total_data);
		                    } catch (e) {
		                        console.log(e);
		                    }
		                }
		            }
		        } else if (chart.m_objecttype == "datagrid" || chart.m_objecttype == "scorecard" || chart.m_objecttype == "chart" || chart.m_objecttype == "funnel") {
		            //var component = temp.m_dashboard.m_widgetsArray[comp];
		            temp.showChartData = new ShowChartData(chart);
		            if (IsBoolean(chart.m_isDataSetavailable) && !IsBoolean(chart.m_isEmptySeries) && (componentsIdArray === undefined || componentsIdArray.indexOf(chart.m_referenceid) > -1)) {
		                try {
		                    isDownloadable++;
		                    var data = temp.getExcelData(chart);
		                    for (var j = 0; j < data[0].length; j++) {
		                        try {
		                            var b = data[0][j].replace(/_/g, " ");
		                            var data1 = b.charAt(0).toUpperCase() + b.slice(1);
		                            data[0][j] = data1;
		                        } catch (e) {
		                            console.log(e);
		                        }
		                    }
		                    if (con_data.length > 0) {
	                            filter = [
	                                ["Filters"]
	                            ];
	                            abc = [
	                                [""],
	                                ["Data"]
	                            ];
	                        } else {
	                            filter = [
	                                ["Data"]
	                            ];
	                            abc = [];
	                        }
		                    total_data = filter.concat(con_data, abc, data);
		                    sheetName = (sheetarr !== undefined && sheetarr[comp]) ? sheetarr[comp] : chart.m_referenceid; //chart.m_referenceid;
		                    try {
		                        // sheetName = sheetarr[comp];//temp.getSheetNameForComponent(chart, wb.Sheets, false);
		                        if (temp.m_titleArray.indexOf(sheetName) > -1) {
		                            sheetName = sheetName + count;
		                            count++;
		                        }
		                        temp.m_titleArray.push(sheetName);
		                    } catch (e) {
		                        sheetName = chart.m_referenceid;
		                    }
		                    //sheetName = temp.getStringARSC(sheetName);
		                    wb.SheetNames.push(sheetName);
		                    wb.Sheets[sheetName] = sheet_from_array_of_arrays(total_data);
		                } catch (e) {
		                    console.log(e);
		                }
		            }
		        }
		    }
		} else {
		    sheetName = temp.m_excelsheetname;
		    var arr = [];
		    //arr[0] = [];
		    for (var comp = 0; comp < temp.m_dashboard.m_widgetsArray.length; comp++) {
		        var component = temp.m_dashboard.m_widgetsArray[comp];
		        temp.showChartData = new ShowChartData(component);
		        if (temp.m_dashboard.m_widgetsArray[comp].m_repeaterCharts !== undefined && temp.m_dashboard.m_widgetsArray[comp].m_repeaterCharts.length > 0) {
		            for (var rcomp = 0; rcomp < temp.m_dashboard.m_widgetsArray[comp].m_repeaterCharts.length; rcomp++) {
		                var component = temp.m_dashboard.m_widgetsArray[comp].m_repeaterCharts[rcomp];
		                temp.showChartData = new ShowChartData(component);
		                // added if/else conditions for exporting repeater charts from export window for the token BDD-725
		                if (IsBoolean(component.m_isDataSetavailable) && !IsBoolean(component.m_isEmptySeries) && (componentsIdArray === undefined || componentsIdArray.indexOf(temp.m_dashboard.m_widgetsArray[comp].m_repeaterCharts[rcomp].m_objectid) > -1)) {
		                    var l = arr.length;
		                    arr[l] = [];
		                    arr[l]["0"] = [];
		                    arr[l]["0"] = component.m_referenceid; //+ "" + (rcomp + 1)
		                    isDownloadable++;
		                    var data = temp.getExcelData(component);
		                    arr = arr.concat(data);
		                    arr[arr.length] = [];
		                }
		            }
		        } else if (IsBoolean(component.m_isDataSetavailable) && !IsBoolean(component.m_isEmptySeries) && (componentsIdArray === undefined || componentsIdArray.indexOf(temp.m_dashboard.m_widgetsArray[comp].m_objectid) > -1)) {
		            var l = arr.length;
		            arr[l] = [];
		            arr[l]["0"] = [];
		            arr[l]["0"] = component.m_referenceid;
		            isDownloadable++;
		            var data = temp.getExcelData(component);
		            arr = arr.concat(data);
		            arr[arr.length] = [];
		        }
		    }
		    wb.SheetNames.push(sheetName);
		    wb.Sheets[sheetName] = sheet_from_array_of_arrays(arr);
		}
		if (isDownloadable > 0) {
		    downloadXLSX(wb, file_name);
		} else {
		    alertPopUpModal({
		        type: 'error',
		        message: "Error occurred. No data available to download",
		        timeout: '3000'
		    });
		}
		hideBlockUILoader();
	};
	/** @description Make the context map empty **/
	this.resetContext = function() {
		context = [];
	};
	/** @description Removes the key-value from the context map **/
	this.removeContext = function(key) {
		var exceptionalKey = $.inArray(key, exceptionKeys) > -1;
		if (!exceptionalKey) {
			delete context[key];
		} else {
			throw messages.errors.cannot_delete + " (" + key + ")";
		}
	};
	/** @description Returns the value for the key **/
	this.getContext = function(key) {
		return context[key];
	};
	/** @description For getting the complete context map in scripting scope **/
	this.getContextMap = function() {
		return context;
	};
	/** @description For avoiding deleting some reserved (exceptional keys inside framework) **/
	this.addContextExceptionKey = function(key) {
		exceptionKeys.push(key);
	};
	/** @description Returns the value for the custom key **/
	this.getUserCustomProperty = function(key) {
		var match;
		if (context.dashboard_customproperties) {
			var matches = context.dashboard_customproperties.filter(function(cp) {
				return (cp.key == key) ? cp.value : "";
			});
			if (matches.length > 0) {
				match = matches[matches.length - 1].value;
			}
		}
		return match;
	};
	/** @description Show a component **/
	this.showComponent = function(ids) {
		this.changeVisibility(ids, true);
	};
	/** @description Hide a component **/
	this.hideComponent = function(ids) {
		this.changeVisibility(ids, false);
	};
	/** @description Hide all component except supplied **/
	this.hideAllComponentExcept = function(ids) {
		this.changeVisibilityExcept(this.dashboard, ids, false);
	};
	/** @description show all component except supplied **/
	this.showAllComponentExcept = function(ids) {
		this.changeVisibilityExcept(this.dashboard, ids, true);
	};
	/** @description toggles all the component
	 * @function
	 * @param {array} arr1 fist array which is visible first time
	 * @param {array} arr2 second array which is hidden first time
	 * @param {string} key on which this group of component toggles, to support multiple groups for toggleing 
	 */
	this.toggleComponents = function(arr1, arr2, toggleCompsKey) {
		if (toggleCompsKey == undefined) {
			toggleCompsKey = "toggleComps";
		}
		if (this.getContext(toggleCompsKey) == undefined) {
			this.addContext(toggleCompsKey, "arr1");
		}
		if (this.getContext(toggleCompsKey) == "arr1") {
			this.changeVisibility(arr1, true);
			this.changeVisibility(arr2, false);
			this.addContext(toggleCompsKey, "arr2");
		} else {
			this.changeVisibility(arr1, false);
			this.changeVisibility(arr2, true);
			this.addContext(toggleCompsKey, "arr1");
		}
	};
	/** @description toggles all the component
	 * @param {array} arr1 fist array which is visible first time
	 * @param {array} arr2 second array which is hidden first time
	 * @param {string} key on which this group of component toggles, to support multiple groups for toggleing 
	 */
	this.toggleGroups = function(arr1, arr2, toggleCompsKey) {
		if (toggleCompsKey == undefined) {
			toggleCompsKey = "toggleComps";
		}
		if (this.getContext(toggleCompsKey) == undefined) {
			this.addContext(toggleCompsKey, "arr1");
		}
		var temp = this;
		if (this.getContext(toggleCompsKey) == "arr1") {
			arr1.map(function(grp) {
				temp.showGroup(grp);
			});
			arr2.map(function(grp) {
				temp.hideGroup(grp);
			});
			this.addContext(toggleCompsKey, "arr2");
		} else {
			arr1.map(function(grp) {
				temp.hideGroup(grp);
			});
			arr2.map(function(grp) {
				temp.showGroup(grp);
			});
			this.addContext(toggleCompsKey, "arr1");
		}
	};
	/** @description Updates global variable for the component with the Object received in map parameter
	 * If notifyChange is true: will trigger script written on this component **/
	this.updateGlobalVariable = function(key, map, notifyChange) {
		if (checkReinitialisation() && this.dashboard != "") {
			try {
				var changGV = findInArray(this.dashboard.m_GlobalVariable.m_Variable, "m_key", key);
				if (changGV != undefined) {
					//this will replace the existing map
					//changGV.map=map;
					//to update the map we have to update it key wise
					for (var key1 in map) {
						if (map.hasOwnProperty(key1)) {
							try {
								changGV.map[key1] = map[key1];
							} catch (e) {
								console.log(e);
							}
						}
					}
					if (notifyChange != undefined && IsBoolean(notifyChange)) {
						changGV.notify();
					}
					return changGV.toSimplifiedObject();
				}
			} catch (e) {
				console.log(e);
			}
		}
	};
	/** @description Returns the global variables map object for the component **/
	this.getGlobalVariable = function(key) {
		if (checkReinitialisation()) {
			var changGV = findInArray(this.dashboard.m_GlobalVariable.m_Variable, "m_key", key);
			if (changGV != undefined) {
				return changGV.toSimplifiedObject();
			}
		}
	};
	/** @description Updates the global variable and triggers the script for the component **/
	this.executeScript = function(key, changedItemAttribute) {
		this.updateGlobalVariable(key, changedItemAttribute, true)
	};
	/** @description reSets the global variable and triggers the script for the component **/
	this.resetGlobalVariable = function(key, map, notifyChange) {
		if (checkReinitialisation() && this.dashboard != "") {
			var changGV = findInArray(this.dashboard.m_GlobalVariable.m_Variable, "m_key", key);
			if (changGV != undefined) {
				changGV.map = {};
				if (notifyChange != undefined && notifyChange) {
					changGV.notify();
				}
				return changGV.toSimplifiedObject();
			}
		}
	};
	/** @description Change dashboard background color **/
	this.changeDashboardBGColor = function(colors) {
		if (checkReinitialisation()) {
			this.dashboard.m_AbsoluteLayout.m_gradients = colors;
			this.dashboard.m_AbsoluteLayout.drawAbsoluteCanvas();
		}
	};
	/** @description Change component's background color **/
	this.changeBGColor = function(id, colors) {
		if (checkReinitialisation()) {
			var wid = this.getWidget(id);
			if (wid != undefined) {
				colors = createArray(colors);
				if (wid.m_gradients) {
					wid.m_gradients = colors.join(",");
				} else if (wid.m_bggradients) {
					wid.m_bggradients = colors.join(",");
				} else {
					// Do nothing
				}
				wid.draw();
			}
		}
	};
	/** @description reload array of connections **/
	this.reload = function(ids) {
		if (checkReinitialisation()) {
			try {
				ids = createArray(ids);
				var dps = getArrayFromIDArray(this.dashboard.m_DataProviders.m_dataurl, "m_id", ids);
				refreshConnections(dps);
			} catch (error) {
				throw messages.errors.generic;
			}
		}
	};
	/** @description Reload all connections **/
	this.reloadAll = function() {
		if (checkReinitialisation()) {
			try {
				refreshConnections(this.dashboard.m_DataProviders.m_dataurl);
			} catch (error) {
				throw messages.errors.generic;
			}
		}
	};
	/** @description Reload connections automatically, by considering given conditions **/
	this.autoReload = function() {
		if (checkReinitialisation()) {
			try {
				var changeItem = this.lastChangedItem;
				var dps = this.dashboard.m_DataProviders.m_dataurl;
				if (dps) {
					$.each(dps, function (index, dataURL) {
						if (conditionExistInDataProvider(dataURL, changeItem)) {
							if(dataURL.m_type === "ds"){
								if (dataManager != undefined) {
									dataManager.handleTimelyRefresh(dataURL, frameworkController.setXMLResponseForDs.bind(frameworkController));
								}
								dataURL.getDataFromConnection(dataURL.getDataSetValues(), frameworkController.setXMLResponseForDs.bind(frameworkController));
							}else{
								if (dataManager != undefined) {
									dataManager.handleTimelyRefresh(dataURL, frameworkController.setXMLResponse.bind(frameworkController));
								}
								dataURL.getDataFromConnection(dataURL.getDataSetValues(), frameworkController.setXMLResponse.bind(frameworkController));
							}
						}
					});
				}
			} catch (error) {
				throw messages.errors.generic;
			}
		}
	};
	/** @description Reload component data in client. Method will not fetch data from server **/
	this.reloadDataset = function(ids) {
		if (checkReinitialisation()) {
			try {
				ids = createArray(ids);
				var dsets = [];
				/** To avoid same className and groupName problem, add prefix g_ in className.*/
				if (typeof ids == "string") {
					dsets = getArrayFromIDArray(this.dashboard.m_dataSetsArray, "m_id", ids);
					if (dsets) {
						$.each(dsets, function(index, dataSet) {
							if (dataSet.getDataStore()) {
								dataSet.refreshDataFromConnection(frameworkController.renderComponentsWithDataSet);
							}
						});
					}
				} else if (typeof ids == "object") {
					for (var i = 0; i < ids.length; i++) {
						dsets = getArrayFromIDArray(this.dashboard.m_dataSetsArray, "m_id", [ids[i]]);
						if (dsets) {
							$.each(dsets, function(index, dataSet) {
								if (dataSet.getDataStore()) {
									dataSet.refreshDataFromConnection(frameworkController.renderComponentsWithDataSet);
								}
							});
						}
					}
				} else {
					// Do nothing
				}
			} catch (error) {
				throw messages.errors.generic;
			}
		}
	};
	/** @description Clears all the timely refresh of connections **/
	this.clearTimelyRefresh = function(connectionIds) {
		if (dataManager != undefined) {
			if (connectionIds === "") {
				dataManager.clearAllTimelyRefresh();
			} else {
				for (var i = 0; i < connectionIds.length; i++) {
					dataManager.clearTimelyRefresh(connectionIds[i]);
				}
			}
		}
	};

	/** @description returns widget object from ID, when the referenceId matches **/
	this.getWidget = function(id) {
		return findInArray(this.dashboard.m_widgetsArray, "m_referenceid", id);
	};
	/** @description returns array of widget objects, when the objectName matches **/
	this.getWidgetByName = function(value) {
		var result = $.grep(this.dashboard.m_widgetsArray, function(n) {
			return (n["m_objectname"] == value);
		});
		/** result will be an array with all the matches OR empty array if nothing matches **/
		return ((result.length > 0) ? result : undefined);
	};
	/** @description returns array of widget objects, when the objectType matches **/
	this.getWidgetByType = function(value) {
		var result = $.grep(this.dashboard.m_widgetsArray, function(n) {
			return (n["m_objecttype"] == value);
		});
		/** result will be an array with all the matches OR empty array if nothing matches **/
		return ((result.length > 0) ? result : undefined);
	};
	/** @description returns array of widget objects, when the objectID matches **/
	this.getWidgetById = function(value) {
		var result = $.grep(this.dashboard.m_widgetsArray, function(n) {
			return (("draggableDiv" + n["m_objectid"]) == value);
		});
		/** result will be an array with all the matches OR empty array if nothing matches **/
		return ((result.length > 0) ? result : undefined);
	};
	/** @description returns array of widget objects, when the objectClass matches **/
	this.getWidgetByClass = function(value) {
		var result = $.grep(this.dashboard.m_widgetsArray, function(n) {
			return (n["m_objectclass"].split(" ").indexOf(value) > -1);
		});
		/** result will be an array with all the matches OR empty array if nothing matches **/
		return ((result.length > 0) ? result : undefined);
	};
	/** @description returns array of widget objects, when the data-key/value matches **/
	this.getWidgetByAttribute = function(key, value) {
		/** get the mapping variable for the key, and find the matching components  **/
		var map = {
			"data-id": "m_referenceid",
			"data-name": "m_objectname",
			"data-type": "m_objecttype"
		};
		var result = $.grep(this.dashboard.m_widgetsArray, function(n) {
			return (n[map[key]] == value);
		});
		/** result will be an array with all the matches OR empty array if nothing matches **/
		return ((result.length > 0) ? result : undefined);
	};
	/** @description get the hash code of chart's context
	 * @return Object which has message and code **/
	this.getChartContextHash = function(component) {
		var comp = this.getWidget(component);
		if (comp && comp.ctx) {
			return {
				"message": "success",
				"data": comp.ctx.hash({
					loose: true
				})
			};
		} else {
			return {
				"message": "failure",
				"data": ""
			};
		}
	};
	/** @description get the dataURL code for canvas
	 * @return Object which has message and URL code **/
	this.getChartCanvasDataUrl = function(component) {
		var comp = this.getWidget(component);
		if (comp && comp.draggableCanvas && comp.draggableCanvas[0]) {
			return {
				"message": "success",
				"data": comp.draggableCanvas[0].toDataURL()
			};
		} else {
			return {
				"message": "failure",
				"data": ""
			};
		}
	};

	/** @description Returns the clickValue of the single-valued-component  **/
	this.getValue = function(id) {
		if (checkReinitialisation()) {
			var wid = this.getWidget(id);
			if (wid != undefined) {
				if (typeof wid.getDataProvider === "function") {
					return wid.getDataProvider();
				}
			}
		}
	};
	/** @description Sets the value for the single-valued-component.
	 * @param value1 is value which has to be updated to the component 
	 * @param Value2 {optional}, considered as target value for gauge/semiGauge/Bullet **/
	this.setValue = function(id, value1, value2) {
		if (checkReinitialisation()) {
			var wid = this.getWidget(id);
			if (wid != undefined) {
				try {
					wid.setDataProvider(value1);
					if( wid.m_objecttype == "hslider" || wid.m_objecttype == "vslider"){
						/** BDD-624 slider value update when min range value is not zero **/
						wid.setDataProvider(value1*1 - wid.m_minimum*1);
					}else {
						wid.setDataProvider(value1);
					}
					if (value2 && (wid.m_objecttype == "bullet" || wid.m_objecttype == "gauge" || wid.m_objecttype == "semigauge" || wid.m_objecttype == "date" || wid.m_objecttype == "URLButton")) {
						//date type : for setting formate date according to the user script or it is optional
						wid.setTargetValue(value2);
					}
					wid.drawObject();
				} catch (e) {
					console.log(e);
				}
			}
		}
	};
	/** @description fill box component with multi-colors **/
	this.createHorizontalSlices = function(id, values, colors) {
		if (checkReinitialisation()) {
			var wid = this.getWidget(id);
			if (wid != undefined) {
				if (wid.m_componenttype == "rectangle") {
					wid.fillHorizontalStack(values, colors);
				}
			}
		}
	};
	/** @description fill box component with multi-colors **/
	this.createVerticalSlices = function(id, values, colors) {
		if (checkReinitialisation()) {
			var wid = this.getWidget(id);
			if (wid != undefined) {
				if (wid.m_componenttype == "rectangle") {
					wid.fillVerticalStack(values, colors);
				}
			}
		}
	};
	/** @description Percent fill options for box component **/
	this.fillHorizontalByPercentage = function(id, percentage) {
		if (checkReinitialisation()) {
			var wid = this.getWidget(id);
			if (wid != undefined) {
				if (wid.m_componenttype == "rectangle") {
					wid.fillHorizontalByPercentage(percentage);
				}
			}
		}
	};
	/** @description Percent fill options for box component **/
	this.fillVerticalByPercentage = function(id, percentage) {
		if (checkReinitialisation()) {
			var wid = this.getWidget(id);
			if (wid != undefined) {
				if (wid.m_componenttype == "rectangle") wid.fillVerticalByPercentage(percentage);
			}
		}
	};
	/** @description getting div element for component **/
	this.getDivElementFromComponetId = function(id) {
		var wid = this.getWidget(id);
		if (wid != undefined) {
			return $("#draggableDiv" + wid.m_objectId)[0];
		}
	};
	/** @description getting div id for component **/
	this.getDivIdFromComponetId = function(id) {
		var wid = this.getWidget(id);
		if (wid != undefined) {
			return "draggableDiv" + wid.m_objectId;
		}
	};
	/** @description apply one style for given selector **/
	this.applyStyle = function(selector, propertyName, value) {
		$(selector).css(propertyName, value);
	};
	/** @description apply css styles for given group selector **/
	this.applyGroupStyles = function(selectorArr, cssObj) {
		for (var i = 0; i < selectorArr.length; i++) {
			var selector = ".g_" + selectorArr[i];
			$(selector).css(cssObj);
		}
	};
	/** @description apply object of css to the selector 
	 * @param {selector} DOM selector 
	 * @param {cssObj} object of css which has to be applied **/
	this.applyStyles = function(selector, cssObj) {
		$(selector).css(cssObj);
	};
	/** @description apply operation on label after rendering **/
	this.setAfterRenderCallBack = function(id, getFunction) {
		this.getWidget(id).m_onafterrendercallback = getFunction;
	};
	/** @description operation for best fit line in scatter plot **/
	this.setBestFitLine = function(id, propObj) {
		var info = sdk.getWidget(id);
		if (info !== undefined) {
			try {
				for (var i = 0; i < info.m_dataset.Fields.length; i++) {
					for (var j = 0; j < propObj.length; j++) {
						if (info.m_dataset.Fields[i].Name === propObj[j].FieldName) {
							info.m_dataset.Fields[i]['BestFitLine'] = propObj[j].EnableLine;
							info.m_dataset.Fields[i]['BestFitLineWidth'] = propObj[j].LineWidth;
							info.m_dataset.Fields[i]['BestFitLineColor'] = propObj[j].LineColor;
							//info.m_dataset.Fields[i]['BestFitAnimation'] = propObj[j].Animation;
							info.m_dataset.Fields[i]['BestFitLineType'] = propObj[j].LineType;
							//info.m_dataset.Fields[i]['BestFitDuration'] = propObj[j].AnimationDuration;
						}
					}
				}
			} catch (e) {
				console.log(e);
			}
		}
		//this.getWidget(id).m_onafterrendercallback = getFunction;
	};
	/** @description checks for array or not **/
	this.isArray = function(arr) {
		return (Object.prototype.toString.call(arr) === "[object Array]");
	};
	/** @description sets the component position to given pixel **/
	this.setTop = function(id, top) {
		var wid = this.getWidget(id);
		if (wid != undefined) {
			$("#draggableDiv" + wid.m_objectId).css({
				"top": top + "px"
			});
		}
	};
	/** @description sets the component position to given pixel **/
	this.setLeft = function(id, left) {
		var wid = this.getWidget(id);
		if (wid != undefined) {
			$("#draggableDiv" + wid.m_objectId).css({
				"left": left + "px"
			});
		}
	};
	/** @description sets the component position to given pixel **/
	this.getTop = function(id) {
		var wid = this.getWidget(id);
		if (wid != undefined) {
			return $("#draggableDiv" + wid.m_objectId).css("top");
		}
	};
	/** @description sets the component position to given pixel **/
	this.getLeft = function(id) {
		var wid = this.getWidget(id);
		if (wid != undefined) {
			return $("#draggableDiv" + wid.m_objectId).css("left");
		}
	};
	/** @description Apply group to component **/
	this.applyGroupToComponent = function(groupName, components) {
		var temp = this;
		components = createArray(components);
		var pushFlag = 0;
		/** To avoid same className and groupName problem, add prefix g_ in className.*/
		var gName = "g_" + groupName;
		$.each(components, function(index, val) {
			var divid = temp.getDivIdFromComponetId(val);
			$("#" + divid).addClass(gName);
			pushFlag++;
		});
		if (pushFlag > 0) {
			this.dashboard.pushUniqueToAvailableGroups(gName);
		}
		return pushFlag > 0;
	};
	/** @description Remove group from component **/
	this.removeGroupFromComponent = function(groupName, components) {
		var temp = this;
		components = createArray(components);
		var pushFlag = 0;
		/** To avoid same className and groupName problem, add prefix g_ in className.*/
		var gName = "g_" + groupName;
		$.each(components, function(index, val) {
			var divid = temp.getDivIdFromComponetId(val);
			$("#" + divid).removeClass(gName);
			pushFlag++;
		});
		return pushFlag > 0;
	};
	/** @description hides entire group of components **/
	this.hideGroup = function(groupNames) {
		var temp = this;
		/** To avoid same className and groupName problem, add prefix g_ in className.*/
		if (typeof groupNames == "string") {
			$(".g_" + groupNames).each(function(index) {
				var id = $.data(this, "referenceID");
				temp.hideComponent(id);
			});
		} else if (typeof groupNames == "object") {
			for (var i = 0; i < groupNames.length; i++) {
				$(".g_" + groupNames[i]).each(function(index) {
					var id = $.data(this, "referenceID");
					temp.hideComponent(id);
				});
			}
		} else {
			// Do nothing
		}
	};
	/** @description shows entire group of components **/
	this.showGroup = function(groupNames) {
		var temp = this;
		/** To avoid same className and groupName problem, add prefix g_ in className.*/
		if (typeof groupNames == "string") {
			$(".g_" + groupNames).each(function(index) {
				var id = $.data(this, "referenceID");
				temp.showComponent(id);
			});
		} else if (typeof groupNames == "object") {
			for (var i = 0; i < groupNames.length; i++) {
				$(".g_" + groupNames[i]).each(function(index) {
					var id = $.data(this, "referenceID");
					temp.showComponent(id);
				});
			}
		} else {
			// Do nothing
		}
	};
	/** @description returns all the groups **/
	this.getAllGroups = function() {
		if (checkReinitialisation()) {
			return this.dashboard.getAllGroups();
		}
	};
	/** @description Change visibility of all component except supplied **/
	this.changeVisibilityExcept = function(dashboard, ids, visible) {
		if (checkReinitialisation()) {
			var applyToAll = (ids == "" || ids == undefined);
			ids = createArray(ids);
			$.each(this.dashboard.m_widgetsArray, function(index, wid) {
				if (applyToAll) {
					visible ? wid.showWidget() : wid.hideWidget();
				} else {
					/** else block is required to prevent double operation when applyToAll is true **/
					inArray(wid["m_referenceid"], ids) ? (visible ? wid.hideWidget() : wid.showWidget()) : (visible ? wid.showWidget() : wid.hideWidget());
				}
			});
		}
	};
	/** @description change visibility of one component **/
	this.changeVisibility = function(ids, visible) {
		if (checkReinitialisation()) {
			ids = createArray(ids);
			for (var i = 0; i < ids.length; i++) {
				try {
					var wid = this.getWidget(ids[i]);
					if (wid != undefined) {
						visible ? wid.showWidget() : wid.hideWidget();
					}
				} catch (e) {
					console.log(e);
				}
			}
		}
	};
	/** @description updates svg shape component prop **/
	this.setGraphicsProperty = function(id, property, value) {
		if (checkReinitialisation()) {
			var wid = this.getWidget(id);
			if (wid != undefined) {
				if (wid.m_componenttype == "svg_shape") {
					wid["m_" + property] = value;
					wid.draw();
				}
			}
		}
	};
	/** @description returns svg shape component prop **/
	this.getGraphicsProperty = function(id, property) {
		if (checkReinitialisation()) {
			var wid = this.getWidget(id);
			if (wid != undefined) {
				if (wid.m_componenttype == "svg_shape") {
					return wid["m_" + property];
				}
			}
		}
	};
	
	/** @description Apply freeze header for the component **/
	 this.freezeHeader = function(arr) {
	    for (i = 0; i < arr.length; i++) {
	        var temp = this;
	        var grpName = arr[i];
	        var headerArr = $(".g_" + grpName); //  group-name which needs to be fixed 
	        var headerArrCompOffset = {};
	        var dashOffset = $(".draggablesParentDiv").offset();
	        var maxZIndex = temp.dashboard.m_widgetsArray.length;
	        var index = maxZIndex - i;
	
	        for (var j = 0; j < headerArr.length; j++) {
	            var compOffset = $(headerArr[j]).position();
	            /** make the hidden elements visible, get the position and hide again **/
	            if ($(headerArr[j])[0] && $(headerArr[j])[0].style.display == "none") {
	                $(headerArr[j])[0].style.display = "block";
	                compOffset = $(headerArr[j]).position();
	                $(headerArr[j])[0].style.display = "none";
	            }
	            var leftPos = compOffset.left * 1 + dashOffset.left * 1;
	            headerArrCompOffset[headerArr[j].id] = compOffset.left * 1;
	            sdk.applyStyles(headerArr[j], {
	                "position": "fixed",
	                "left": leftPos + "px",
	                "z-index": index
	            });
	        }
	
	        $(document).scroll(function(scroll) {
	            var dashOffset = $(".draggablesParentDiv").offset();
	            for (var i = 0; i < headerArr.length; i++) {
	                var leftPos = headerArrCompOffset[headerArr[i].id] + dashOffset.left * 1 - $(window).scrollLeft();
	                $(headerArr[i]).css('left', leftPos);
	            };
	        });
	
	        $(window).resize(function() {
	            var dashOffset = $(".draggablesParentDiv").offset();
	            for (var j = 0; j < headerArr.length; j++) {
	                var leftPos = headerArrCompOffset[headerArr[j].id] + dashOffset.left * 1 - $(window).scrollLeft();
	                $(headerArr[j]).css('left', leftPos);
	            };
	        });
	    }
	};

	/** Create radio button from the connection **/
	this.applyDatasetToRadioButton = function(id, data, fieldMap) {
		var wid = this.getWidget(id);
		if (wid != undefined && data != undefined && fieldMap != undefined) {
			wid.m_values = [];
			if (this.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					var values = new Values();
					values.setLabel(data[i][fieldMap.labelField]);
					values.setValue(data[i][fieldMap.valueField]);
					values.setUncheckedValue(undefined);
					wid.m_values.push(values);
				}
				wid.draw();
			}
		}
	};
	/** returns the dataset object for given component id **/
	this.getComponentDataset = function(component) {
		var chart = this.getWidget(component);
		if (chart) {
			if (chart.m_datasetid != "") {
				for (var i = 0; i < this.dashboard.m_dataSetsArray.length; i++) {
					if (this.dashboard.m_dataSetsArray[i].m_id == chart.m_datasetid) {
						return this.dashboard.m_dataSetsArray[i];
					}
				}
			} else {
				console.log(component + " does not have Dataset");
			}
		} else {
			console.log(component + " is Not Available in Dashboard");
		}
	};
	/** reset the field property for given component id **/
	this.applyFieldUpdates = function(component, fieldPropArray) {
		var ds = this.getComponentDataset(component);
		if (ds) {
			for (var j = 0; j < ds.m_fieldsJson.length; j++) {
				for (var k = 0; k < fieldPropArray.length; k++) {
					if (ds.m_fieldsJson[j].Name == fieldPropArray[k].name) {
						for (var key in fieldPropArray[k].properties) {
							if (fieldPropArray[k].properties.hasOwnProperty(key)) {
								if (typeof fieldPropArray[k].properties[key] === "object") {
									for (var key1 in fieldPropArray[k].properties[key]) {
										if (fieldPropArray[k].properties[key].hasOwnProperty(key1)) {
											ds.m_fieldsJson[j][key][key1] = fieldPropArray[k].properties[key][key1];
										}
									}
								} else {
									ds.m_fieldsJson[j][key] = fieldPropArray[k].properties[key];
								}
							}
						}
					}
				}
			}
		}
	};
	/** reset the chart properties for the components **/
	this.applyChartUpdates = function(ids, properties) {
		try {
			$.each(this.dashboard.m_widgetsArray, function(index, wid) {
				if (inArray(wid["m_referenceid"], ids)) {
					for (var key in properties) {
						if (properties.hasOwnProperty(key)) {
							wid[key] = properties[key];
						}
					}
				}
			});
		} catch (e) {
			console.log(e);
		}
	};
	/** Apply automanipulator script to component **/
	this.applyAutoManipulator = function(component, categoryGroup, seriesGroup, valueField, seriesColors) {
		var ds = this.getComponentDataset(component);
		if (ds) {
			if (categoryGroup != undefined && seriesGroup != undefined && valueField != undefined && seriesColors != undefined) {
				var categorySubcategoryGroup = (""+categoryGroup).split(",");
				ds.m_AutoManipulator.m_enable = true;
				ds.m_AutoManipulator.m_categorygroup = categorySubcategoryGroup[0];
				ds.m_AutoManipulator.m_subcategorygroup = categorySubcategoryGroup[1];
				ds.m_AutoManipulator.m_seriesgroup = seriesGroup;
				ds.m_AutoManipulator.m_valuefield = valueField;
				var chart = this.getWidget(component);
				if (!chart.m_categoryColors) {
					chart.m_categoryColors = new CategoryColors();
				}
				chart.m_categoryColors.m_categorydefaultcolorset = seriesColors;
				chart.m_categoryColors.m_categorydefaultcolor = "#F89406";
				chart.m_categoryColors.m_showcolorsfromcategoryname = false;
			}else{
				console.log(component + " automanipulator configuration is invalid !");
			}
		}
	};
	/** Removes automanipulator script from component **/
	this.removeAutoManipulator = function(component) {
		var ds = this.getComponentDataset(component);
		if (ds) {
			ds.m_AutoManipulator.m_enable = false;
			ds.m_AutoManipulator.m_categorygroup = "";
			ds.m_AutoManipulator.m_subcategorygroup = "";
			ds.m_AutoManipulator.m_seriesgroup = "";
			ds.m_AutoManipulator.m_valuefield = "";
		}
	};
	/** Apply aggregation script to component **/
	this.applyAggregation = function(component, groupByField, fields, operations) {
		var ds = this.getComponentDataset(component);
		if (ds) {
			if (groupByField != undefined && fields != undefined && operations != undefined) {
				ds.m_Aggregation.m_enable = true;
				ds.m_Aggregation.m_groupbynode = groupByField;
				ds.m_Aggregation.m_summaryfields = fields;
				ds.m_Aggregation.m_summaryoperations = operations;
			}else{
				console.log(component + " aggregation configuration is invalid !");
			}
		}
	};
	/** Removes aggregation script from component **/
	this.removeAggregation = function(component) {
		var ds = this.getComponentDataset(component);
		if (ds) {
			ds.m_Aggregation.m_enable = false;
			ds.m_Aggregation.m_groupbynode = "";
			ds.m_Aggregation.m_summaryfields = "";
			ds.m_Aggregation.m_summaryoperations = "";
		}
	};
	/** Apply Dataset Filter script to component **/
	this.applyDataSetFilter = function(component, condition) {
		var ds = this.getComponentDataset(component);
		if (ds) {
			if (condition != undefined && condition != "") {
				if (typeof condition == "string") {
					ds.m_DataSetFilter.m_conditionsArr = condition.split(",");
				} else if (typeof condition == "object") {
					ds.m_DataSetFilter.m_conditionsArr = condition;
				} else {
					// Do nothing
				}
			} else {
				if (typeof condition == "string") {
					ds.m_DataSetFilter.m_conditionsArr = condition;
				}
			}
		}
	};
	
	/*DAS-4 filterchips redraw based on assigned filters selected values*/
	this.updateFilterChips = function(component) {
		var filterchips = this.getWidget(component);
		filterchips.m_removedChipParentValues = [];
		filterchips.m_savedfilterschips = [];
		var newArr = [];
		for (var i = 0; i < filterchips.m_assignedfilters.length; i++) {
		  var comp = filterchips.getChartObjectById(filterchips.m_assignedfilters[i]);
		  var filterArr = [];
		  /*DAS-387*/
		  if (comp != undefined) {
		    switch (comp.m_componenttype) {
		      case "combo_filter":
		        for (var j = 0; j < comp.staticOptsValue.length; j++) {
		          var idValue = getStringARSC(comp.staticOptsValue[j]) + "-" + j;
		          var value = comp.staticOptsValue[j];
		          var text = comp.displayField[j];
		          if ((comp.m_checkboxstatus[idValue] || filterchips.m_savedtext.includes(text)) && comp.m_selectiontype == 'multiselect') {
		            /* push the selected values inside filter chips array */
		            filterchips.m_savedfilterschips.push({
		              "key": text,
		              "value": value,
		              "objectid": filterchips.m_assignedfilters[i],
		              "objecttype": "combo_filter"
		            });
		            //filterchips.m_savedtext.push(text);
		            newArr.push(text);
		            filterArr.push(text);
		          } else if (comp.m_checkboxstatus[idValue]) {
		            /* push the selected values inside filter chips array */
		            filterchips.m_savedfilterschips.push({
		              "key": text,
		              "value": value,
		              "objectid": filterchips.m_assignedfilters[i],
		              "objecttype": "combo_filter"
		            });
		            //filterchips.m_savedtext.push(text);
		            newArr.push(text);
		            filterArr.push(text);
		          }
		          /*else if(!comp.m_checkboxstatus[idValue] && filterchips.m_savedtext.includes(text)){
		          	                    	var ind = filterchips.m_savedtext.indexOf(value);
		          	                    	if (ind > -1) {
		          	                    		filterchips.m_savedtext.splice(ind, 1);
		          	                    	}
		          	                    	var ind1 = filterchips.m_savedfilterschips.filter(function(obj){
		          	                    		return text != obj.key;
		          	                    	})
		          	                    	filterchips.m_savedfilterschips = ind1;
		          	                    }*/
		        }
		        //filterchips.m_savedfilterschips.sort(fun);
		        filterchips.m_filterDisplayValues[filterchips.m_assignedfilters[i]] = filterArr
		        break;
		      case "list_filter":
		        for (var j = 0; j < comp.value.length; j++) {
		          var idValue = getStringARSC(comp.value[j]) + "-" + j;
		          var value = comp.value[j];
		          var text = comp.displayField[j];
		          if ((comp.m_checkboxstatus[idValue] || filterchips.m_savedtext.includes(text)) && comp.m_selectiontype == 'multiselect') {
		            /* push the selected values inside filter chips array */
		            filterchips.m_savedfilterschips.push({
		              "key": text,
		              "value": value,
		              "objectid": filterchips.m_assignedfilters[i],
		              "objecttype": "list_filter"
		            });
		            //filterchips.m_savedtext.push(text);
		            newArr.push(text);
		            filterArr.push(text);
		          } else if (comp.m_checkboxstatus[idValue] || comp.m_checkboxstatus[value] || comp.m_updateFilterList.includes(value)) {
		            /* push the selected values inside filter chips array */
		            filterchips.m_savedfilterschips.push({
		              "key": text,
		              "value": value,
		              "objectid": filterchips.m_assignedfilters[i],
		              "objecttype": "list_filter"
		            });
		            //filterchips.m_savedtext.push(text);
		            newArr.push(text);
		            filterArr.push(text);
		          }
		        }
		        filterchips.m_filterDisplayValues[filterchips.m_assignedfilters[i]] = filterArr
		        break;
		        /*DAS-251*/
		      case "radio_filter":
		        var j = comp.m_selectedindex;
		        var idValue = getStringARSC(comp.m_referenceid) + "-" + j;
		        var value = comp.fieldNameValueMap.Value;
		        var text = comp.fieldNameValueMap.Label;
		        filterchips.m_savedfilterschips.push({
		          "key": text,
		          "value": value,
		          "objectid": filterchips.m_assignedfilters[i],
		          "objecttype": "radio_filter"
		        });
		        filterchips.m_filterDisplayValues[filterchips.m_assignedfilters[i]] = filterArr
		        break;
		      case "hierarchical_combo":
		        /*DAS-252*/
		        if (IsBoolean(comp.m_allowmultipleselection)) {
		          for (var k = 0; k < comp.finalArray.length; k++) {
		            if (comp.m_currentIndexSelect.includes(comp.finalArray[k].id.toString())) {
		              var value = comp.finalArray[k].name;
		              var text = comp.finalArray[k].name;
		              /* push the selected values inside filter chips array */
		              filterchips.m_savedfilterschips.push({
		                "key": text,
		                "value": value,
		                "objectid": filterchips.m_assignedfilters[i],
		                "objecttype": "hierarchical_combo"
		              });
		              filterchips.m_savedtext.push(text);
		              newArr.push(text);
		              filterArr.push(text);
		            }
		          }
		        } else {
		          for (var j = 0; j < comp.selectedRecordArray.length; j++) {
		            var value = comp.selectedRecordArray[j];
		            var text = comp.selectedRecordArray[j];
		            /* push the selected values inside filter chips array */
		            filterchips.m_savedfilterschips.push({
		              "key": text,
		              "value": value,
		              "objectid": filterchips.m_assignedfilters[i],
		              "objecttype": "hierarchical_combo"
		            });
		            filterchips.m_savedtext.push(text);
		            newArr.push(text);
		            filterArr.push(text);
		          }
		        }
		        /*if ((comp.finalArray[j].name === text) && (comp.m_allowmultipleselection)) {
		        filterchips.m_savedfilterschips.push({
		            "key": text,
		            "value": value,
		            "objectid": filterchips.m_assignedfilters[k],
		            "objecttype": "hierarchical_combo"
		        });
		        filterchips.m_savedtext.push(text);
		        newArr.push(text);
		        filterArr.push(text);
		        } else if ((comp.finalArray[j].name === text)) {
		        filterchips.m_savedfilterschips.push({
		            "key": text,
		            "value": value,
		            "objectid": filterchips.m_assignedfilters[k],
		            "objecttype": "hierarchical_combo"
		        });
		        filterchips.m_savedtext.push(text);
		        newArr.push(text);
		        filterArr.push(text);
		        }*/
		        filterchips.m_filterDisplayValues[filterchips.m_assignedfilters[i]] = filterArr
		        break;
		      case "date_picker":
		    	  var idValue = getStringARSC(comp.m_referenceid);
		    	  if (comp.m_nodefaultdate == false || comp.fieldNameValueMap) {
		    	      if (comp.fieldNameValueMap) {
		    	          var value = comp.fieldNameValueMap.Value;
		    	          var text = comp.fieldNameValueMap.Value;
		    	      } else {
		    	          var defaultdate = new Date();
		    	          var datetext = defaultdate.toLocaleDateString();
		    	          var datepicker = this.getWidget(idValue);
		    	          var value = datepicker.getFormattedDate(datetext, comp.m_formatstring);
		    	          var text = datepicker.getFormattedDate(datetext, comp.m_formatstring);
		    	      }
		    	      filterchips.m_savedfilterschips.push({
		    	          "key": text,
		    	          "value": value,
		    	          "objectid": filterchips.m_assignedfilters[i],
		    	          "objecttype": "date_picker"
		    	      });
		    	      newArr.push(text);
		    	      filterArr.push(text);
		    	  }
		    	  break;
		    }
		  }
		}
		filterchips.m_savedtext = newArr;
		filterchips.drawObject();
	};
	/*DAS-408*/
	/*@description - SDK method for updating the dashboard theme dynamically in the dashboard.*/
	this.updateDashboardTheme = function(theme) {
	    if (checkReinitialisation()) {
	        var dark = {
	            "dashboard": {
	                "bgColor": "#000000",
	                "opacity": "1"
	            },
	            "component": {
	                "bgColor": "#262626",
	                "bgBorderColor": "#262626",
	                "titleBgColor": "#262626,#262626",
	                "opacity": "1",
	                "fontColor": "#FFFFFF",
	                "selectionColor": "#317BDB",
	                "selectionFontColor": "#FFFFFF",
	                "axisFontColor": "#EAEAEA",
	                "axisLabelFontColor": "#EAEAEA",
	                "axisLineColor": "#EFF0F0"
	            }
	        };
	        var light = {
	            "dashboard": {
	                "bgColor": "#FFFFFF",
	                "opacity": "1"
	            },
	            "component": {
	                "bgColor": "#FFFFFF",
	                "bgBorderColor": "#EFF0F0",
	                "titleBgColor": "#EFF0F0,#EFF0F0",
	                "opacity": "1",
	                "fontColor": "#000000",
	                "selectionColor": "#FFFFFF",
	                "selectionFontColor": "#000000",
	                "axisFontColor": "#000000",
	                "axisLabelFontColor": "#494950",
	                "axisLineColor": "#EFF0F0"
	            }
	        };
	        var setTheme = (theme == "dark") ? dark : light;
	        /*update dashboard background clolor*/
	        this.dashboard.m_AbsoluteLayout.m_gradients = setTheme.dashboard.bgColor;
	        this.dashboard.m_AbsoluteLayout.drawAbsoluteCanvas();
	        /*update bgcolor of dashboard components*/
	        /*@ get all @component for current dashboard*/
	        var component = this.dashboard.m_dashboardjson.Niv.Dashboard.AbsoluteLayout.Object;
	        for (var i = 0; i < component.length; i++) {
	            var wid = this.getWidget(component[i].referenceID);
	            if (wid != undefined) {
	                colors = setTheme.component.bgColor;
	                if (wid.m_gradients) {
	                    wid.m_gradients = colors;
	                } else if (wid.m_bggradients) {
	                    wid.m_bggradients = colors;
	                } else {
	                    // Do nothing
	                }

	                /*based on component type change the font color and header bgcolor*/
	                var charType = component[i].objectType;
	                switch (charType) {
	                    case "chart":
	                        wid.m_bordercolor = setTheme.component.bgBorderColor;
	                        /*Title updates*/
	                        if (wid.m_title.m_fontcolor) {
	                            wid.m_title.m_fontcolor = setTheme.component.fontColor;
	                        }
	                        if (wid.m_fontcolor) {
	                            wid.m_fontcolor = setTheme.component.fontColor;
	                        }
	                        wid.m_gradientcolor = setTheme.component.titleBgColor;
	                        /*X Axis updates*/
	                        if (wid.m_xAxis) {
	                            wid.m_xAxis.m_fontcolor = setTheme.component.axisFontColor;
	                            wid.m_xAxis.m_labelfontcolor = setTheme.component.axisLabelFontColor;
	                            wid.m_xAxis.m_lineaxiscolor = setTheme.component.axisLineColor;
	                        }
	                        /*X Axis updates*/
	                        if (wid.m_yAxis) {
	                            wid.m_yAxis.m_fontcolor = setTheme.component.axisFontColor;
	                            wid.m_yAxis.m_labelfontcolor = setTheme.component.axisLabelFontColor;
	                            wid.m_yAxis.m_lineaxiscolor = setTheme.component.axisLineColor;
	                        }

	                        wid.draw();
	                        break;
	                    case "filter":
	                        wid.m_selectioncolor = setTheme.component.selectionColor;
	                        wid.m_selectionfontcolor = setTheme.component.selectionFontColor;
	                        wid.m_fontcolor = setTheme.component.fontColor;
	                        wid.m_bgcolor = setTheme.component.bgColor;
	                        wid.m_backgroundcolor = setTheme.component.bgColor;
	                        wid.m_chromecolor = setTheme.component.bgColor;
	                        wid.draw();
	                        break;
	                    case "datagrid":
	                        wid.m_headerchromecolor = setTheme.component.bgColor;
	                        wid.m_headerfontcolor = setTheme.component.fontColor;
	                        wid.m_title.m_gradientColor = setTheme.component.bgColor;
	                        wid.m_title.m_fontcolor = setTheme.component.fontColor;
	                        wid.draw();
	                        break;
	                    case "label":
	                        wid.m_color = setTheme.component.fontColor;
	                        wid.m_backgroundcolor = setTheme.component.bgColor;
	                        wid.draw();
	                        break;
	                    default:
	                        if (wid.m_fontcolor) {
	                            wid.m_fontcolor = setTheme.component.fontColor;
	                        }
	                        if (wid.m_bgcolor) {
	                            wid.m_bgcolor = setTheme.component.bgColor;
	                        }
	                        if (wid.m_color) {
	                            wid.m_color = setTheme.component.fontColor;
	                        }
	                        if (wid.m_backgroundcolor) {
	                            wid.m_backgroundcolor = setTheme.component.bgColor;
	                        }
	                        if (wid.m_chromecolor) {
	                            wid.m_chromecolor = setTheme.component.bgColor;
	                        }
	                        wid.draw();
	                        break;
	                }

	            }

	        }
	    }
	};
	
	this.applyDrill = function(compIds, dataObj, field) {
		/*if(this.dashboard.m_crosshighligter){
			this.dashboard.m_crosshighligter = false;
		} else {
			this.dashboard.m_crosshighligter = true;
		}*/
		this.dashboard.m_drillcomps = compIds;
		this.dashboard.m_dataobj = dataObj;
		this.dashboard.m_drillcomp = dataObj.drillComponent;
		compIds = createArray(compIds);
	   for(var i=0;i<compIds.length;i++){
		   var wid = this.getWidget(compIds[i]);
		   comp = wid.m_componenttype;
		   var ind = dataObj.drillIndex;
		   for(var val in dataObj){
			   if(dataObj["drillComponent"].fieldNameValueMap.drillComponent.chartJson.componentType =="group_bar_chart"||dataObj["drillComponent"].fieldNameValueMap.drillComponent.chartJson.componentType =="group_column_chart"){
				   if(IsBoolean(dataObj.drillComponent.m_subCategoryVisibleArr[val])){
						var catData = dataObj[val],
						catVal = val;
						break; 
				  } else{
					  }
				  }else if(dataObj["drillComponent"].fieldNameValueMap.drillComponent.chartJson.componentType =="scattered_plot_chart"){
					   if(IsBoolean(dataObj.drillComponent.m_seriesVisibleArr[val])){
							//var catindex = dataObj.drillComponent.m_categoryData[0].indexOf(dataObj[val]);
							var catData = dataObj[val],
							catVal = val;
							break; 
						}
					  /*if(dataObj.drillComponent.m_dataProvider){
						  var catData = dataObj.drillComponent.m_dataProvider[ind][field],
							catVal = field;
							break;
					  }*/
				  }
			   else {
			    if(IsBoolean(dataObj.drillComponent.m_categoryVisibleArr[val])){
					//var catindex = dataObj.drillComponent.m_categoryData[0].indexOf(dataObj[val]);
					var catData = dataObj[val],
					catVal = val;
					break;
				}
			   }
			}
		   switch (comp) {
			case "bar_chart":
				for(var s=0;s<wid.m_noofseries;s++){
					for(var c=0;c<wid.m_categoryData[0].length;c++){
					  if(dataObj.drillComponent.m_categoryData[0].length == wid.m_dataProvider.length){
						  if(c==ind || wid.m_dataProvider[c][catVal]  == catData){//&& IsBoolean( dataObj.drillComponent.m_drilltoggle)
							    $("#stackgrp"+wid.m_objectid+"s"+s+"c"+c).css("opacity", "1");
							} else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
							    $("#stackgrp"+wid.m_objectid+"s"+s+"c"+c).css("opacity", "1");
							} else {
							    $("#stackgrp"+wid.m_objectid+"s"+s+"c"+c).css("opacity", "0.5");
							}
					  } else {
						  if(wid.m_dataProvider[c][catVal]  == catData){//&& IsBoolean( dataObj.drillComponent.m_drilltoggle)
							    $("#stackgrp"+wid.m_objectid+"s"+s+"c"+c).css("opacity", "1");
							} else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
								$("#stackgrp"+wid.m_objectid+"s"+s+"c"+c).css("opacity", "1");
							} else {
								$("#stackgrp"+wid.m_objectid+"s"+s+"c"+c).css("opacity", "0.5");
							}
					  }
					}
				}
				break;
			case "bubble_chart":
				for(var s = 0; s < wid.m_seriesData[0].length; s++){
					for(var c = 0; c < wid.m_categoryData.length; c++){
					  if(dataObj.drillComponent.m_categoryData.length == wid.m_dataProvider.length){
						  if(c==ind || wid.m_dataProvider[c][catVal]  == catData){
							  wid.m_transparencyarr[s][c] = 1;
						  } else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
							  wid.m_transparencyarr[s][c] = 1;
						  } else{
							  wid.m_transparencyarr[s][c] = 0.5;
						  }
					  } else {
						    if(wid.m_dataProvider[c][catVal]  == catData){
							  wid.m_transparencyarr[s][c] = 1;
						  } else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
							  wid.m_transparencyarr[s][c] = 1;
						  } else {
							  wid.m_transparencyarr[s][c] = 0.5;
						  }
					  }
					}
				}
				wid.initializeBubble();
				wid.drawChart();
				break;
			case "timeline_chart":
				//wid.m_slidertoggle = (IsBoolean(wid.m_showslider))? true: false;
				wid.m_drillcomptoggle = dataObj.drillComponent.m_drilltoggle;
				wid.m_slidercatarr = [];
				for(var s=0;s<wid.m_seriesData.length;s++){
					for(var c=0;c<wid.SerData[0].length;c++){//wid.m_categoryData[0].length
						var clickid = (wid.m_columnSeries[wid.m_seriesNames[s]] !== undefined) ? "topRoundedStack" + wid.svgContainerId + s + c : "linestack" + wid.svgContainerId + s + c;
						var clickid_sl = (wid.m_columnSeries[wid.m_seriesNames[s]] !== undefined) ? "topRoundedStack_stackgrpslider" + wid.svgContainerId + s + c : "linestack" + wid.svgContainerId + s + c;
						if(IsBoolean(!wid.m_showslider)){
							if(dataObj.drillComponent.m_categoryData[0].length == wid.m_dataProvider.length){
								
								if(wid.m_columnSeries[wid.m_seriesNames[s]] !== undefined){
		            				var clickid = "topRoundedStack" + wid.svgContainerId + s + c;
		            			}else{
		            				var clickid = "linestack" + wid.svgContainerId + s + c;
		            			}
								  if(c==ind || wid.m_dataProvider[c][catVal]  == catData){//&& IsBoolean( dataObj.drillComponent.m_drilltoggle)
									    //$("#topRoundedStack"+wid.svgContainerId+s+c).attr("opacity", "1");
									  $("#"+clickid).css("opacity", "1");
									} else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
										  //$("#topRoundedStack"+wid.svgContainerId+s+c).attr("opacity", "0.5");
										  $("#"+clickid).css("opacity", "1");
									} else {
										  //$("#topRoundedStack"+wid.svgContainerId+s+c).attr("opacity", "1");
										  $("#"+clickid).css("opacity", "0.5");
									}
							  } else {
								  if(wid.m_dataProvider[c][catVal]  == catData){//&& IsBoolean( dataObj.drillComponent.m_drilltoggle)
									  //$("#topRoundedStack"+wid.svgContainerId+s+c).attr("opacity", "1");
									  $("#"+clickid).css("opacity", "1");
									} else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
										  //$("#topRoundedStack"+wid.svgContainerId+s+c).attr("opacity", "0.5");
										  $("#"+clickid).css("opacity", "1");
									} else {
										  //$("#topRoundedStack"+wid.svgContainerId+s+c).attr("opacity", "1");
										  $("#"+clickid).css("opacity", "0.5");
									}
							  }
						} else {
							if(dataObj.drillComponent.m_categoryData[0].length == wid.m_dataProvider.length){
								  if(c==ind || wid.m_dataProvider[c][catVal]  == catData){//&& IsBoolean( dataObj.drillComponent.m_drilltoggle)
									    //$("#topRoundedStack"+wid.svgContainerId+s+c).attr("opacity", "1");
									    //$("#topRoundedStack_stackgrpslider"+wid.svgContainerId+s+c).attr("opacity", "1");
									    $("#"+clickid).css("opacity", "1");
									    $("#"+clickid_sl).css("opacity", "1");
									    //if(IsBoolean(this.dashboard.m_crosshighligter)){
									    	wid.m_slidercatarr.push(c);
									    //}
									} else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
										  //$("#topRoundedStack"+wid.svgContainerId+s+c).attr("opacity", "0.5");
										  //$("#topRoundedStack_stackgrpslider"+wid.svgContainerId+s+c).attr("opacity", "0.5");
										  $("#"+clickid).css("opacity", "1");
										  $("#"+clickid_sl).css("opacity", "1");
									} else {
										  //$("#topRoundedStack"+wid.svgContainerId+s+c).attr("opacity", "1");
										  //$("#topRoundedStack_stackgrpslider"+wid.svgContainerId+s+c).attr("opacity", "1");
										  $("#"+clickid).css("opacity", "0.5");
										  $("#"+clickid_sl).css("opacity", "0.5");
										  //if(IsBoolean(this.dashboard.m_crosshighligter)){
										    	wid.m_slidercatarr.push(c);
										    //}
									}
							  } else {
								  if(wid.m_dataProvider[c][catVal]  == catData){//&& IsBoolean( dataObj.drillComponent.m_drilltoggle)
									  $("#topRoundedStack"+wid.svgContainerId+s+c).css("opacity", "1");
									  $("#topRoundedStack_stackgrpslider"+wid.svgContainerId+s+c).css("opacity", "1");
									  //if(IsBoolean(this.dashboard.m_crosshighligter)){
									    	wid.m_slidercatarr.push(c);
									    //}
									} else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
										  $("#topRoundedStack"+wid.svgContainerId+s+c).css("opacity", "1");
										  $("#topRoundedStack_stackgrpslider"+wid.svgContainerId+s+c).css("opacity", "1");
									} else {
										  $("#topRoundedStack"+wid.svgContainerId+s+c).css("opacity", "0.5");
										  $("#topRoundedStack_stackgrpslider"+wid.svgContainerId+s+c).css("opacity", "0.5");
										  //if(IsBoolean(this.dashboard.m_crosshighligter)){
										    	wid.m_slidercatarr.push(c);
										    //}
									}
							  }
						}
					}
				}
				break;
			case "group_bar_chart":
				for(var s=0;s<wid.m_seriesData.length;s++){
					for(var c=0;c<wid.m_categoryData[0].length;c++){
					  if(dataObj.drillComponent.m_categoryData[0].length == wid.m_dataProvider.length){
						  /**DAS-826 adding comparing category data incase of grpbar and grpcolumn */
						  if(c==ind || wid.m_dataProvider[c][catVal]  == catData || wid.m_categoryData[0][c]  == catData){//&& IsBoolean( dataObj.drillComponent.m_drilltoggle)
							    $("#stackgrp"+wid.m_objectid+s+c).css("opacity", "1");
							} else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
								  $("#stackgrp"+wid.m_objectid+s+c).css("opacity", "1");
							} else {
								  $("#stackgrp"+wid.m_objectid+s+c).css("opacity", "0.5");
							}
					  } else {
						  if(wid.m_dataProvider[c][catVal]  == catData || wid.m_categoryData[0][c]  == catData){//&& IsBoolean( dataObj.drillComponent.m_drilltoggle)
							  $("#stackgrp"+wid.m_objectid+s+c).css("opacity", "1");
							} else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
								  $("#stackgrp"+wid.m_objectid+s+c).css("opacity", "1");
							} else {
								  $("#stackgrp"+wid.m_objectid+s+c).css("opacity", "0.5");
							}
					  }
					}
				}
				break;
				
			case "group_column_chart":
				for(var s=0;s<wid.m_seriesData.length;s++){
					for(var c=0;c<wid.m_categoryData[0].length;c++){
					  if(dataObj.drillComponent.m_categoryData[0].length == wid.m_dataProvider.length){
						  /**DAS-826 adding comparing category data incase of grpbar and grpcolumn */
						  if(c==ind || wid.m_dataProvider[c][catVal]  == catData || wid.m_categoryData[0][c]  == catData){//&& IsBoolean( dataObj.drillComponent.m_drilltoggle)
							    $("#stackgrp"+wid.m_objectid+s+c).css("opacity", "1");
							} else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
								  $("#stackgrp"+wid.m_objectid+s+c).css("opacity", "1");
							} else {
								  $("#stackgrp"+wid.m_objectid+s+c).css("opacity", "0.5");
							}
					  } else {
						  if(wid.m_dataProvider[c][catVal]  == catData || wid.m_categoryData[0][c]  == catData){//&& IsBoolean( dataObj.drillComponent.m_drilltoggle)
							  $("#stackgrp"+wid.m_objectid+s+c).css("opacity", "1");
							} else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
								  $("#stackgrp"+wid.m_objectid+s+c).css("opacity", "1");
							} else {
								  $("#stackgrp"+wid.m_objectid+s+c).css("opacity", "0.5");
							}
					  }
					}
				}
				break;
			case "scattered_plot_chart":
				for(var s=0;s<wid.m_seriesData.length;s++){
					for(var c=0;c<wid.m_categoryData[0].length;c++){
					  if(dataObj.drillComponent.m_categoryData[0].length == wid.m_dataProvider.length){
						  if(c==ind || wid.m_dataProvider[c][catVal]  == catData){//&& IsBoolean( dataObj.drillComponent.m_drilltoggle)
							    $("#scatterplot"+wid.m_objectid+s+c).css("opacity", "1");
							} else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
								  $("#scatterplot"+wid.m_objectid+s+c).css("opacity", "1");
							} else {
								  $("#scatterplot"+wid.m_objectid+s+c).css("opacity", "0.5");
							}
					  } else {
						  if(wid.m_dataProvider[c][catVal]  == catData){//&& IsBoolean( dataObj.drillComponent.m_drilltoggle)
							  $("#scatterplot"+wid.m_objectid+s+c).css("opacity", "1");
							} else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
								  $("#scatterplot"+wid.m_objectid+s+c).css("opacity", "1");
							} else {
								  $("#scatterplot"+wid.m_objectid+s+c).css("opacity", "0.5");
							}
					  }
					}
				}
				break;
			case "mixed_chart":
				for(var s = 0; s < wid.m_seriesData[0].length; s++){//this.m_seriesNames
					for(var c = 0; c < wid.m_seriesNames.length; c++){
					  if(dataObj.drillComponent.m_categoryData.length == wid.m_dataProvider.length){
						  if(s==ind || wid.m_dataProvider[s][catVal]  == catData){
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 1;
						  } else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 1;
						  } else {
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 0.5;
						  }
					  } else {
						  if(wid.m_dataProvider[s][catVal]  == catData){
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 1;
						  } else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 1;
						  } else{
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 0.5;
						  }
					  }
					}
				}
				wid.instanciateSeries(wid.seriesDataMap);
				//this.m_yAxis.m_yAxisMarkersArray = "";
			  	//this.m_yAxis.m_isSecodaryAxis = false;
				wid.drawChart();
				break;
			case "line_chart":
				for(var s = 0; s < wid.m_seriesData[0].length; s++){//this.m_seriesNames
					for(var c = 0; c < wid.m_seriesNames.length; c++){
					  if(dataObj.drillComponent.m_categoryData.length == wid.m_dataProvider.length){
						  if(s==ind || wid.m_dataProvider[s][catVal]  == catData){
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 1;
						  } else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 1;
						  } else {
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 0.5;
						  }
					  } else {
						  if(wid.m_dataProvider[s][catVal]  == catData){
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 1;
						  } else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 1;
						  } else{
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 0.5;
						  }
					  }
					}
				}
				wid.initializeCalculation();
				wid.drawChart();
				break;
			case "column_stack_chart":
				for(var s = 0; s < wid.m_seriesData[0].length; s++){//this.m_seriesNames
					for(var c = 0; c < wid.m_seriesNames.length; c++){
					  if(dataObj.drillComponent.m_categoryData.length == wid.m_dataProvider.length){
						  if(s==ind || wid.m_dataProvider[s][catVal]  == catData){
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 1;
						  } else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 1;
						  } else {
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 0.5;
						  }
					  } else {
						  if(wid.m_dataProvider[s][catVal]  == catData){
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 1;
						  } else if(IsBoolean(dataObj.drillComponent.m_drilltoggle)){
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 1;
						  } else{
							  wid.m_transparencyarr[wid.m_seriesNames[c]][s] = 0.5;
						  }
					  }
					}
				}
				wid.m_stackWidth = wid.m_calculation.getBarWidth();
				wid.initializeColumns();
				wid.drawChart();
				break;
		   }

	   }
	   if(dataObj.drillComponent.m_componenttype == "column_stack_chart" || dataObj.drillComponent.m_componenttype == "line_chart" || dataObj.drillComponent.m_componenttype == "mixed_chart" ||  dataObj.drillComponent.m_componenttype == "bubble_chart"){
			dataObj.drillComponent.m_drilltoggle = true;
		}
	};
	/** Removes Dataset Filter script from component **/
	this.removeDataSetFilter = function(component) {
		var ds = this.getComponentDataset(component);
		if (ds) {
			ds.m_DataSetFilter.m_conditionsArr = "";
		}
	};
	/** Apply additional rows to component dataset **/
	this.appendRows = function(component, rows) {
		var ds = this.getComponentDataset(component);
		if (ds) {
			if (rows != undefined && rows != "" && typeof rows == "object") {
				try {
					ds.setAppendRowsEnable(true);
					ds.setAppendRows(rows);
				} catch (e) {
					console.log(e);
				}
			} else {
				console.log(component + " append rows object is invalid !");
			}
		}
	};
	/** Updates the order of operation on dataset **/
	this.updateDatasetOperationOrder = function(component, obj) {
		if (component) {
			var temp = this;
			$.each(component, function(index, id) {
				var ds = temp.getComponentDataset(id);
				if (ds) {
					ds.setOperationOrder(obj);
				}
			});
		}
	};
	/** Apply sorting to the entire connection data and refresh all associated components**/
	this.sortData = function(connection, field, order, numeric) {
		try {
			this.applyArraySort(this.getGlobalVariable(connection).attributes.data, field, order, numeric);
			var dp = findInArray(this.dashboard.m_DataProviders.m_dataurl, "m_id", connection);
			if (dp) {
				for (var i = 0; i < dp.m_associateddataset.length; i++) {
					this.reloadDataset(dp.m_associateddataset[i]["id"]);
				}
			}
		} catch (e) {
			console.log(e);
		}
	};
	/** Sorting method **/
	this.applyArraySort = function(data, field, order, numeric) {
		try {
			var ord = order.toLowerCase() != "desc";
			var pri = numeric ? parseFloat : undefined;
			data.sort(sortFn(field, !ord, pri))
		} catch (e) {
			console.log(e);
		}
	};
	/** Returns aggregated Dataset object **/
	this.getAggregatedDataSet = function(data, operations, fields, groupByField) {
		if (data != undefined) {
			var aggregatedData = data;
			try {
				if (operations == undefined && fields == undefined && groupByField == undefined) {
					//when no parameter is passed , it will return sum of all fields
					return getSUMOfData(aggregatedData);
				} else if (operations != undefined && operations != "" && groupByField == undefined && groupByField != "" && fields != "") {
					//arrange  aggregation information into req formate
					var summaryoperation = operations.split(",");
					switch ((summaryoperation[0]).toLowerCase()) {
						case "sum":
							return getSUMOfData(aggregatedData);
							break;
						case "avg":
							return getAVGOfData(aggregatedData);
							break;
						case "max":
							if(fields == undefined) {
							return getMAXOfData(aggregatedData);
							} else {
							return getMAXOfFieldData(aggregatedData, fields);
							}
							break;
						case "min":
							if(fields == undefined) {
								return getMINOfData(aggregatedData);
							} else {
								return getMINOfFieldData(aggregatedData, fields);
							}
							break;
						case "count":
							return getCOUNTOfData(aggregatedData);
							break;
						default:
							return getSUMOfData(aggregatedData);
							break;
					}
					return aggregatedData(aggregatedData)
				} else {
					// Do nothing
				}
			} catch (e) {
				console.log(e);
			}
			return aggregatedData;
		}
		return {};
	};
	/** Sets category indicator to pie chart **/
	this.setPieIndicator = function(compId, categoryField, indicatorArr, connData) {
		var wid = this.getWidget(compId);
		if (wid && wid.m_type == "Pie") {
			try {
				var colors = wid.m_seriescolor.split(",");
				if (colors.length < connData.length) {
					for (var i = colors.length, count = 0; i < connData.length; i++, count++) {
						colors[i] = colors[count];
					}
				}
				for (var i1 = 0; i1 < connData.length; i1++) {
					if(indicatorArr){
						for (var j = 0; j < indicatorArr.length; j++) {
							if (connData[i1][categoryField] == indicatorArr[j].name) {
								colors[i1] = indicatorArr[j].color;
							}
						}
					}
				}
				wid.m_seriescolor = colors.join(",");
			} catch (e) {
				console.log(e);
			}
			/** Set the indicator colors **/
			try{
				if(indicatorArr && wid.getCategoryColors()){
					wid.getCategoryColors().categoryColorsObject = wid.getCategoryColors().categoryColorsObject || {};
					var obj = wid.getCategoryColors().categoryColorsObject;
					indicatorArr.map(function(item) {
						obj[item.name] = item.color;
					});
					this.setCategoryColors(compId, obj);
				}
			} catch (e) {
				console.log(e);
			}
		}
	};
	/** @description Sets category colors to the component **/
	this.setCategoryColors = function(component, colorMap) {
		var chart = this.getWidget(component);
		if (chart) {
			try{
				var CatColor = [];
				if(IsBoolean(chart.m_isrepeater)){
					/** TODO **/
					if(chart.chartJson && chart.chartJson.Chart && chart.chartJson.Chart.CategoryColors){
						for (var item in colorMap) {
							if (colorMap.hasOwnProperty(item)) {
								CatColor.push({
									"categoryName": item,
									"color": colorMap[item],
									"seriesName": ""
								});
							}
						}
						if(chart.chartJson.Chart.CategoryColors.CategoryColor.length > 0){
							CatColor = $.extend(chart.chartJson.Chart.CategoryColors.CategoryColor, CatColor);
							chart.chartJson.Chart["CategoryColors"]["CategoryColor"] = chart.chartJson.Chart["CategoryColors"]["CategoryColor"].concat(CatColor);
						}else{
							chart.chartJson.Chart["CategoryColors"] = {
								"categoryDefaultColor" : "#7F7F7F",
								"categoryDefaultColorSet" : "#7F7F7F",
								"showColorsFromCategoryName" : "true",
								"CategoryColor" : CatColor
							}
						}
					}				
				}else{
					try {
						for (var item1 in colorMap) {
							if (colorMap.hasOwnProperty(item1)) {
								var cc = new CategoryColor();
								cc.setCategoryName(item1);
								cc.setColor(colorMap[item1]);
								CatColor.push(cc);
							}
						}
						chart.m_categoryColors.m_categorydefaultcolorset = chart.m_categoryColors.m_categorydefaultcolorset || "#FFF";
						chart.m_categoryColors.m_categoryColor = chart.m_categoryColors.m_categoryColor.concat(CatColor);
						chart.m_categoryColors.cateogryNameColorMap = $.extend(chart.m_categoryColors.cateogryNameColorMap, colorMap);
						chart.m_categoryColors.m_showcolorsfromcategoryname = true;
					} catch (e) {
						console.log(e);
					}
				}
			} catch (e) {
				console.log(e);
			}			
		} else {
			console.log(component + " is Not Available in Dashboard");
		}
	};
	
	/** Set a fixed colorSet to the components **/
	this.setCategoryColorSet = function(component, colorSet) {
		var chart = this.getWidget(component);
		if (chart && chart.getCategoryColors()) {
			try{
				chart.getCategoryColors().m_categorydefaultcolorset = colorSet.join();
				chart.getCategoryColors().setCategoryDefaultColorSet();
			}catch(e){
				console.log(e);
			}
		}
	}
	
	/** @description Stores the log messages **/
	this.pushLog = function(msg, type) {
		if (enableLog) {
			type = type ? type : "Info";
			var d = new Date().toISOString().replace("T", " ").replace("Z", "");
			var item = "[" + d + "] [" + type + "] " + msg;
			logItems.push(item);
			return item;
		} else {
			return enableLog;
		}
	};
	/** @description Clears the log **/
	this.clearLog = function() {
		logItems = [];
	};
	/** @description Prints the log **/
	this.printLogInConsole = function() {
		console.log(logItems);
	};
	/** @description Prints the data object in console **/
	this.log = function(data) {
		if(IsBoolean(dGlobals.isDevMode)){
			if (data) {
				console.log(data);
			} else {
				console.log(this.lastChangedItem.attributes);
			}
		}
	};
	this.getConnection = function(connection) {
		return findInArray(this.dashboard.m_DataProviders.m_dataurl, "m_id", connection);
	};
	this.getConnectionJSON = function(id) {
		return findInArray(this.dashboard.m_dashboardjson.Niv.Dashboard.DataProviders.DataURL, "id", id);
	};
	/** @description returns the details of the Connections inside a dashboard
	 * @return Array of objects with the required details of connection **/
	this.getConnectionDetails = function() {
		//return this.dashboard.m_DataProviders.m_dataurl;
		var obj = [];
		var durls = this.dashboard.m_dashboardjson.Niv.Dashboard.DataProviders.DataURL;
		if (durls) {
			for (var i = 0; i < durls.length; i++) {
				obj[i] = {
					"dataSourceName": durls[i].dataSourceName,
					"selectedDataSourceID": durls[i].selectedDataSourceID,
					"selectedServiceID": durls[i].selectedServiceID,
					"url": durls[i].url,
					"queryName": durls[i].queryName,
					"nividhQueryName": durls[i].nividhQueryName,
					"dataSourceType": durls[i].dataSourceType,
					"hostName": durls[i].hostName,
					"databaseName": durls[i].databaseName,
					"Type": durls[i].Type,
					"availableFieldSet": durls[i].availableFieldSet,
					"availableConditionSet": durls[i].availableConditionSet,
					"connectionName": durls[i].connectionName					
				}
			}
		}
		return obj;
	};
	/** @description returns the dashboard JSON object **/
	this.getDashboardJSON = function() {
		return this.dashboard.m_dashboardjson.Niv.Dashboard;
	};
	/** @description downloads the dashboard bvzx file **/
	this.exportDashboardJSON = function() {
		var temp = this;
		/*
		var basepath = window.location.href;
		var splitArr = basepath.split("/");
		var path = "";
		for (var i = 0; i < splitArr.length - 2; i++) {
			path += splitArr[i] + "/";
		}
		path = (splitArr.indexOf("designer") > -1) ? path : path + "designer/";
		*/
		var path = appRootPath + "designer/views/designer/";
		$.ajax({
			url: path + "resources/data/dashboard.data",
			success: function(res) {
				var dJson = JSON.parse(res);
				dJson.Dashboard = temp.getDashboardJSON();
				/** remove the published details from dashboard when it is exported **/
				try{
					dJson.Dashboard.backendId = "";
					dJson.Dashboard.workspaceId = "";
					dJson.Dashboard.versionDetails.publishDocId = 0;
					dJson.Dashboard.versionDetails.publishedVersions = [];
				}catch(e){
					console.log(e);
				}
				dJson = JSON.stringify({
					"dashboardJson": dJson
				});
				if (isIE = /*@cc_on!@*/ false || !!document.documentMode) {
					// If IE 
					var blobObject = new Blob([dJson]);
					window.navigator.msSaveBlob(blobObject, "dashboard.bvzx");
				} else if (isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0) {
					// If Safari
					var uri = "data:application/...," + encodeURIComponent(dJson);
					location.replace(uri);
				} else {
					var blob = new Blob([dJson], {
						type: "text/plain"
					});
					var url = URL.createObjectURL(blob);
					$("#exportAnchor").remove();
					var link = document.createElement("a");
					link.setAttribute("id", "exportAnchor");
					link = document.body.appendChild(link);
					link.setAttribute("download", "dashboard.bvzx");
					link.setAttribute("href", url);
					$(link)[0].click();
					$("#exportAnchor").remove();
				}
			},
			error: function() {
				console.log("Error in Export");
			}
		});
	};
	/** @description return the connection response **/
	this.getConnectionData = function(connID) {
		try {
			if (connID && this.getLastChangedItem(connID)) {
				return this.getLastChangedItem(connID).attributes.data || [];
			} else {
				return [];
			}
		} catch (e) {
			console.log(e);
			return [];
		}
	};
	/** @description return the connection response for annotation **/
	this.getAnnotationConnectionData = function(dataURL) {
		try {
				if(dataURL.m_type === "ds"){
								return dataURL.getDataFromConnection(dataURL.getDataSetValues(), frameworkController.setXMLResponseForDs.bind(frameworkController));
							}else{
								
								dataURL.getDataFromConnection(dataURL.getDataSetValues(), frameworkController.setXMLResponse.bind(frameworkController));
							}
		} catch (e) {
			console.log(e);
			return [];
		}
	};
	/** @description returns the Summary string from PA connection **/
	this.getConnectionSummary = function(connID) {
		try {
			if (connID && this.getLastChangedItem(connID)) {
				return this.getLastChangedItem(connID).attributes.FrameworkComponent.status.summary || "No summary";
			} else {
				return "No summary";
			}
		} catch (e) {
			console.log(e);
			return "No summary";
		}
	};
	/** @description returns the Graph URL from PA connection **/
	this.getConnectionGraphs = function(connID) {
		try {
			if (connID && this.getLastChangedItem(connID)) {
				return this.getLastChangedItem(connID).attributes.FrameworkComponent.status.graph || "No graph";
			} else {
				return "No graph";
			}
		} catch (e) {
			console.log(e);
			return "No graph";
		}
	};
	/** @description returns the socket response for WS connection **/
	this.getWebSocketResponse = function(connID) {
		var obj = {
			"state": "",
			"message": ""
		};
		try {
			var tempLastChangedItem = this.getLastChangedItem(connID);
			if (connID && tempLastChangedItem) {
				if (tempLastChangedItem.attributes.FrameworkComponent.status) {
					obj.state = tempLastChangedItem.attributes.FrameworkComponent.status.state;
					obj.message = tempLastChangedItem.attributes.FrameworkComponent.status.message;
				}
			}
			return obj;
		} catch (e) {
			console.log(e);
			return obj;
		}
	};
	/** @description closes the WS connection **/
	this.closeWebSocket = function(ids) {
		var dps = getArrayFromIDArray(this.dashboard.m_DataProviders.m_dataurl, "m_id", ids);
		if (dps) {
			$.each(dps, function(index, dataURL) {
				if (dataURL && dataURL.getWebService() && dataURL.getWebService().getWebSocket()) {
					try {
						dataURL.getWebService().getWebSocket().close();
					} catch (e) {
						console.log(e);
					}
				}
			});
		}
	};
	/** @description updates the skipFilterValues array for given connections **/
	this.setSkipFilterValues = function(ids, arr) {
		var dps = getArrayFromIDArray(this.dashboard.m_DataProviders.m_dataurl, "m_id", ids);
		if (dps) {
			$.each(dps, function(index, dataURL) {
				if (dataURL) {
					dataURL.m_skipfiltervalues = dataURL.m_skipfiltervalues.concat(arr);
				}
			});
		}
	};
	/** @description updates the selectedIndex(s) of the filters **/
	this.setFilterSelectedIndex = function(component, arr) {
		var comp = this.getWidget(component);
		if (comp) {
			if(arr && arr.length > 0){
				try{
					switch(comp.m_componenttype){
					
						case "hierarchical_combo":
							/** for hfilter, index should be started from 1 **/
							if(comp.m_hierarchylevel == "Multiple" && IsBoolean(comp.m_allowmultipleselection)){
								comp.m_currentIndexSelect = arr;
							} else {
								comp.m_currentIndexSelect = arr[0];
							}
							break;
						case "radio_filter":
							comp.m_selectedindex = arr[0];
							break;
						case "list_filter":
							if(IsBoolean(comp.m_allowmultipleselection) || IsBoolean(comp.m_enabledualselectionlist)){
								comp.m_selectedindex = arr;
							}else{
								comp.m_selectedindex = arr[0];
							}
							break;
						case "combo_filter":
							if(comp.m_selectiontype == "multiselect"){
								comp.m_selectedindex = arr;
							}else{
								comp.m_selectedindex = arr[0];
							}
							break;
						default:
							comp.m_selectedindex = arr;
					}
				}catch(e){
					console.log(e);
				}
			} else {
				console.log("Invalid Selected Indexes array");
			}
		} else {
			console.log(comp + " is not available");
		}
	};

	/** @description returns the last changedItem object for Connections and components **/
	this.getLastChangedItem = function(id) {
		var orignalKeyResp = this.lastChangedItemMap[id];
		if(id){
			var lowerCaseKeyResp = this.lastChangedItemMap[id.toLowerCase()];
			if(orignalKeyResp == undefined && lowerCaseKeyResp != undefined){
				return lowerCaseKeyResp;
			}
		}
		return orignalKeyResp;
	};
	/** @description imports the fonts from the url **/
	this.importFont = function(font) {
		var ls = document.createElement('link');
		ls.rel = "stylesheet";
		ls.href = font;
		document.getElementsByTagName('head')[0].appendChild(ls);
	};
	/** @description apply global fonts to the dashboard **/
	this.applyGlobalFont = function(map) {
		if (map && map.fontFamily && IsBoolean(map.useGlobalFont)) {
			if (map.url !== "") {
				this.importFont(map.url);
			}
			var dObj = this.dashboard.m_AbsoluteLayout;
			dObj.m_useglobalfont = IsBoolean(map.useGlobalFont);
			dObj.m_fontfamily = map.fontFamily;
			
			/** Set in the dashboard level variables **/
			var gf = {
				"useGlobal" : dObj.m_useglobalfont,
				"fontFamily" : dObj.m_fontfamily,
				"useFontFromUrl" : dObj.m_usefontfromurl,
				"fontUrl" : dObj.m_fonturl
			};
			setGlobalFont(gf);
		}
	};

	/** @description Load opendocument from SDK method **/
	this.loadOpenDoc = function(params, openDocUrl) {
		var paramStr = "?";
		if (params) {
			paramStr += $.map(Object.getOwnPropertyNames(params), function(k) {
				return [k, params[k]].join("=")
			}).join("&");
		} else {
			paramStr = "";
		}
		if (parent.parent.$(".iframeStyle")[0]) {
			try {
				$(parent.parent.$(".iframeStyle")[0]).attr('src', "views/opendocument/opendocument.html" + paramStr);
				return {
					success: true
				};
			} catch (e) {
				console.log(e);
				if (openDocUrl) {
					window.open(openDocUrl + paramStr, "_self");
				} else {
					window.open(appRootPath + "opendocument.html?" + paramStr, "_self");
				}
				return {
					success: true
				};
			}
		} else {
			if (openDocUrl) {
				window.open(openDocUrl + paramStr, "_self");
			} else {
				window.open(appRootPath + "opendocument.html?" + paramStr, "_self");
			}
			return {
				success: true
			};
		}
	};
	/** @description Apply the language mapping in dashboard **/
	this.applyLanguageMapping = function(obj) {
		if (obj) {
			if(this.dashboard.m_LanguageMapping !== ""){
				if(obj.isEnabled != undefined){
					this.dashboard.m_LanguageMapping.m_enable = IsBoolean(obj.isEnabled);
					dGlobals.langMap.isEnabled = IsBoolean(obj.isEnabled);
				}
				if(obj.language != undefined){
					this.dashboard.m_LanguageMapping.m_language = obj.language;
					dGlobals.langMap.language = obj.language || "";
				}
				if(obj.id != undefined){
					this.dashboard.m_LanguageMapping.m_mappingid = obj.id;
					dGlobals.langMap.id = obj.id || "";
				}
				if(obj.name != undefined){
					this.dashboard.m_LanguageMapping.m_mappingname = obj.name;
					dGlobals.langMap.name = obj.name || "";
				}
				if(obj.hideBrackets != undefined){
					this.dashboard.m_LanguageMapping.m_hidebrackets = (IsBoolean(obj.hideBrackets) ? true : false);
					dGlobals.langMap.hideBrackets = (IsBoolean(obj.hideBrackets) ? true : false);
				}
			}else{
				dGlobals.langMap.isEnabled = IsBoolean(obj.isEnabled);
				dGlobals.langMap.language = obj.language || "";
//				dGlobals.langMap.id = obj.id || "";
				dGlobals.langMap.name = obj.name || "";
				dGlobals.langMap.hideBrackets = (IsBoolean(obj.hideBrackets) ? true : false);
			}
		}
	};
	/** Method return a value with number formatter and precision
	 * For e.g 25450.345 to 25,450.345 **/
	this.getNumberFormatedValue = function(data, precision) {
		try {
			return (data * 1).toLocaleString(navigator.userLanguage || navigator.language, {
				maximumFractionDigits: precision
			});
		} catch (e) {
			return ((data * 1).toFixed(precision)).toLocaleString();
		}
	};
	/** Method returns the active dashboard layout type **/
	this.getLayoutType = function() {
		return this.dashboard.m_AbsoluteLayout.m_layouttype;
	};
	/** @description Returns the current currency conversion rates **/
	this.getCurrencyConversionRates = function(base, cb) {
		/** Credits:
		 * http://fixer.io/
		 * https://github.com/hakanensari/fixer
		 */
		$.ajax({
			url: "//api.fixer.io/latest?base=" + (base || "USD"),
			success: function(data, success) {
				if (success && data) {
					this.setContext('currencyConversionRate', data.rates, false);
					cb && cb(data);
				} else {
					cb && cb({
						"base": base,
						rates: {}
					});
				}
			}
		});
	};
	this.setStatusMessage = function(obj) {
		if (obj == undefined) {
		    obj = {
		        type: "info",
		        message: "Status Message",
		        timeout: "3000"
		    }
		}
		alertPopUpModal(obj);
	};
	/** @description Starts a tour in dashboard, configuration object, cb on start of tour, cb on end of the tour **/
	this.startDashboardTour = function(config) {
		if (config) {
			try {
				var preserveStyle = {
					'WatermarkDivOverflow': $("#WatermarkDiv").css('overflow'),
					'draggablesParentDivOverflow': $(".draggablesParentDiv").css('overflow')
				};
				var tourConfig = {
					name: config.name,
					steps: config.steps,
					storage: false,
					backdrop: true,
					animation: false,
					onStart: function(tour) {
						/** To make autoscroll work in portal #BDD-621 **/
						$('#WatermarkDiv').css('overflow', '');
						if (dGlobals.layoutType !== "AbsoluteLayout") {
							$(".draggablesParentDiv").css('overflow', '').removeClass("iPhoneScrollBar").removeClass("mobileViewCSS");
						}
						config.onStart && config.onStart();
					},
					onEnd: function(tour) {
						$('#WatermarkDiv').css('overflow', preserveStyle.WatermarkDivOverflow);
						if (dGlobals.layoutType !== "AbsoluteLayout") {
							$('.draggablesParentDiv').css('overflow', preserveStyle.draggablesParentDivOverflow).addClass("iPhoneScrollBar").addClass("mobileViewCSS");
						}
						config.onEnd && config.onEnd();
					},
					onPause: function (tour) {
						$('#WatermarkDiv').css('overflow', '');
						if (dGlobals.layoutType !== "AbsoluteLayout") {
							$(".draggablesParentDiv").css('overflow', '').removeClass("iPhoneScrollBar").removeClass("mobileViewCSS");
						}
						config.onPause && config.onPause();
					},
					template: '<div class="popover tour"><div class="arrow">&nbsp;</div><h3 class="popover-title">&nbsp;</h3><div class="popover-content">&nbsp;</div><div class="popover-navigation"><button class="btn btn-default" data-role="prev">&laquo; Prev</button> <button class="btn btn-default" data-role="next">Next &raquo;</button><button class="btn btn-default" data-role="pause-resume">Pause</button> <button class="btn btn-default" data-role="end">End tour</button></div></div>'
				};

				/** update Additional Configuration **/
				for (var key in config) {
					if (config.hasOwnProperty(key)) {
						if (key == 'onStart' || key == 'onEnd') {
							// Do nothing, as these CallBacks are added in the above tourConfig
						} else {
							tourConfig[key] = config[key];
						}
					}
				}

				// Instance the tour
				var tour = new Tour(tourConfig);

				if (tour.ended()) {
					// Restart the tour
					tour.restart();
				} else {
					// Initialize the tour
					tour.init();
					// Start the tour after page loaded
					tour.start();
				}
			} catch (e) {
				console.log(e);
			}
		}
	};
	this.injectCSSRules = function(rule) {
		try{
			$("<div />", {
				html: '&shy;<style>' + rule + '</style>'
			}).appendTo("body");
		}catch(e){
			console.log(e);
		}
	};
	
	/**Modify action buttons options component level**/
	this.controlAction = function(id,obj) {
		var getComp = this.getWidget(id);
		if (getComp !== undefined) {
			try {
				for (var key in obj) {
					for (var key1 in obj[key]) {
						getComp.m_chartactions[key][key1] = obj[key][key1]; 
					}
				}
			} catch (e) {
				console.log(e);
			}
		}
	};
	
	/** Enable GoogleAnalytics **/
	this.enableGoogleAnalytics = function(config) {
		if(config && config.enable){
			try{
				(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-T7KD2Z8');
				document.body.insertAdjacentHTML('beforeend', '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T7KD2Z8" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>');
				var sCallBack = function(){
					window.dataLayer = window.dataLayer || [];
					function gtag(){
						dataLayer.push(arguments);
					}
					gtag('js', new Date());
					gtag('config', config.token || 'UA-133684628-1');
				}
				loadScript({"urls": ["https://www.googletagmanager.com/gtag/js?id="+config.token+""], "type": "script", "async": "false", "cbArgs": "", "eCB": "", "sCB": sCallBack});
			}catch(e){
				console.log(e);
			}
		}
	};
	
	/** removing dashboard object stored in local storage **/
	this.refreshCache = function() {
	    if (pageInPortal !== undefined) {
	        try {
	            var urlParam = getUrlParameters();
	            var jsonObject = JSON.parse(localStorage.getItem("dbCacheMap"));
	            delete jsonObject[urlParam.docid];
	            localStorage.setItem("dbCacheMap", JSON.stringify(jsonObject));
	            parser.dashboardJson.Niv["Dashboard"].enableCache = false;
	            parser.parseDashboardJSON(); 
	            frameworkController.onBeforeDashboardLoad();
	        } catch (e) {
	            console.log(e);
	        }
	    }
	};
	
	this.dataHash = function(text){
		return sha256(text);
	};
	
	this.createExportComponentForReportBurst = function () {
		var dashboardId = parser.dashboard.m_id,
		 dashboardObj = parser.dashboard,
		 buttonId = parser.dashboard.m_reportburstbutton;
		$.ajax({url: appRootPath+designerContextRoot+"views/designer/resources/bizvizchart-themes/default-theme/singleValuedComponent/ExportToPPTButton.data", success: function(data){
			var data = JSON.parse(data)["ExportToPPTButton"];
			var	container = $("#draggablesParentDiv" + dashboardId),
			zIndex = 2000,
			chart = ReflectUtil.newInstance("ExportToPPTButton", container, zIndex);
			chart.m_dashboard = dashboardObj;
			data.Properties.Object.objectID =buttonId;
			data.Properties.Object.referenceID = buttonId;
			data.Properties.Object.x = "0";
			data.Properties.Object.y = "0";
			data.Properties.Object.height ="1";
			data.Properties.Object.width ="1";
			data.Properties.Object.ExportPPTButton.exportWindow = "false";
			data.Properties.Object.ExportPPTButton.mode = "pdf";
			data.Properties.Object.ExportPPTButton.exportAllCompSeperatelyInPdf = "false";
			parser.dashboard.m_widgetsArray.push(chart);
			chart.setProperty(data.Properties);
			/**removing title and subtitle from reportburst pdf */
			chart.m_pptheading = "";
			chart.m_pptsubheading = "";
			chart.draw();
		}});
	};
	
	this.filterReportBurst = function(){
		var parameters = frameworkController.getQueryStrings();
		for (var key in parameters) {
			if (key !== undefined && key !== "") {
				if (key.indexOf(".") > -1) {
					var compName = key.split(".")[0],
					fieldname = key.split(".")[1],
					arr = [],
					obj = {};
					obj[fieldname]= parameters[key] ;
					if(parameters[key].indexOf(",") > 0){
						arr = parameters[key].split(",");
					} else {
						arr.push(parameters[key]);
					}
					var comp = this.getWidget(compName);
					if (comp) {
						if(arr && arr.length > 0){
							try{
								switch(comp.m_componenttype){
								
									case "hierarchical_combo":
										/** for hfilter, index should be started from 1 **/
										this.updateGlobalVariable(compName, obj, true);
										break;
									case "list_filter":
									case "combo_filter":
										if(comp.m_selectiontype == "multiselect"){
											var indexArr= [];
											for(var i = 0,j=0; i< comp.m_seriesData.length; i++){
												if(comp.m_seriesData[i][0]==arr[j]){
													indexArr.push(i);
													j++;
												}
											}
											comp.m_selectedindex = indexArr;
											this.reloadDataset( [compName ] );
										}else{
											var indexArr= [];
											for(var i = 0; i< comp.m_seriesData.length; i++){
												if(comp.m_seriesData[i][0]==arr[0]){
													indexArr.push(i);
													break;
												}
											}
											comp.m_selectedindex = indexArr[0];
											this.reloadDataset( [compName ] );
										}
										break;
									default:
										break;
								}
							}catch(e){
								console.log(e);
							}
						} else {
							console.log("Invalid Selected Indexes array");
						}
					}
					//sdk.updateGlobalVariable(compName, obj, true);
				} 
			}
		}
	};
	
	function getSUMOfData(aggregatedData) {
		var aggrData = {};
		for (var i = 0; i < aggregatedData.length; i++) {
			for (var key in aggregatedData[i]) {
				if (!aggrData[key]) {
					aggrData[key] = 0;
				}
				var data = getNumericComparableValue(aggregatedData[i][key]);
				if ((data != undefined && data !== null && data !== "") && data != "null" && !isNaN(data) && data.length != 0) {
					aggrData[key] = aggrData[key] * 1 + data * 1;
				}
			}
		}
		return aggrData;
	};

	function getAVGOfData(aggregatedData) {
		var aggrData = {};
		for (var i = 0; i < aggregatedData.length; i++) {
			for (var key in aggregatedData[i]) {
				if (!aggrData[key]) {
					aggrData[key] = 0;
				}
				var data = getNumericComparableValue(aggregatedData[i][key]);
				if ((data != undefined && data !== null && data !== "") && data != "null" && !isNaN(data) && data.length != 0) {
					aggrData[key] = aggrData[key] * 1 + data * 1;
				}
			}
		}
		for (var key1 in aggrData) {
			if (aggrData != 0 && aggregatedData.length != 0) {
				aggrData[key1] = (aggrData[key1] / aggregatedData.length).toFixed(2);
			}
		}
		return aggrData;
	};

	function getMAXOfData(aggregatedData) {
		var aggrData = {};
		for (var i = 0; i < aggregatedData.length; i++) {
			for (var key in aggregatedData[i]) {
				var data = getNumericComparableValue(aggregatedData[i][key]);
				if (!aggrData[key]) {
					aggrData[key] = data;
				}
				if ((data != undefined && data !== null && data !== "") && data != "null" && !isNaN(data) && data.length != 0) {
					if (data * 1 >= aggrData[key] * 1) {
						aggrData[key] = data * 1;
					}
				}
			}
		}
		return aggrData;
	};

	function getMAXOfFieldData(aggregatedData, compareField) {
		var aggrData = {};
		for (var i = 0; i < aggregatedData.length; i++) {
			for (var key in aggregatedData[i]) {
				var data = getNumericComparableValue(aggregatedData[i][key]);
				if (!aggrData[key]) {
					aggrData[key] = data;
				}
				if ((data != undefined && data !== null && data !== "") && data != "null" && !isNaN(data) && data.length != 0 && key == compareField) {
					if (data * 1 >= aggrData[key] * 1) {
						aggrData = aggregatedData[i];
					}
				}
			}
		}
		return aggrData;
	};
	
	function getMINOfData(aggregatedData) {
		var aggrData = {};
		for (var i = 0; i < aggregatedData.length; i++) {
			for (var key in aggregatedData[i]) {
				var data = getNumericComparableValue(aggregatedData[i][key]);
				if (!aggrData[key]) {
					aggrData[key] = data;
				}
				if ((data != undefined && data !== null && data !== "") && data != "null" && !isNaN(data) && data.length != 0) {
					if (data * 1 <= aggrData[key]) {
						aggrData[key] = data * 1;
					}
				}
			}
		}
		return aggrData;
	};
	
	function getMINOfFieldData(aggregatedData, compareField) {
		var aggrData = {};
		for (var i = 0; i < aggregatedData.length; i++) {
			for (var key in aggregatedData[i]) {
				var data = getNumericComparableValue(aggregatedData[i][key]);
				if (!aggrData[key]) {
					aggrData[key] = data;
				}
				if ((data != undefined && data !== null && data !== "") && data != "null" && !isNaN(data) && data.length != 0 && key == compareField) {
					if (data * 1 <= aggrData[key]) {
						aggrData = aggregatedData[i];
					}
				}
			}
		}
		return aggrData;
	};

	function getCOUNTOfData(aggregatedData) {
		var aggrData = {};
		for (var i = 0; i < aggregatedData.length; i++) {
			for (var key in aggregatedData[i]) {
				if (!aggrData[key]) {
					aggrData[key] = 0;
				}
				aggrData[key] = aggregatedData.length;
			}
		}
		return aggrData;
	};
	var sortFn = function(field, reverse, primer) {
		var key = primer ? function(x) {
			return primer(x[field])
		} : function(x) {
			return x[field]
		};
		reverse = !reverse ? 1 : -1;
		return function(a, b) {
			return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
		}
	};
	//	PRIVATE Functions
	var messages = {
		errors: {
			generic: "Error Occured in user script execution",
			not_implemented: "Not implemented",
			cannot_delete: "Cannot Delete reserved context keys",
			re_initialized: "SDK reinitialised, cannot perform operations.",
			unexpected_parameters: "Unexpected parameters sent to {method}."
		}
	};
	var conditionExistInDataProvider = function(durl, changeVar) {
		var clauseMap = durl["m_con"]["clauseMap"];
		for (var key in clauseMap) {
			if (clauseMap.hasOwnProperty(key)) {
				var keyDot = changeVar["key"] + ".";
				if (clauseMap[key].indexOf(keyDot) > -1) {
					return true;
				}
			}
		}
		return false;
	};
	var refreshConnections = function (dps) {
		$.each(dps, function (index, dataURL) {
			if(dataURL.m_type === "ds"){
				if (dataManager != undefined) {
					dataManager.handleTimelyRefresh(dataURL, frameworkController.setXMLResponseForDs.bind(frameworkController));
				}
				dataURL.getDataFromConnection(dataURL.getDataSetValues(), frameworkController.setXMLResponseForDs.bind(frameworkController));
			}else{
				if (dataManager != undefined) {
					dataManager.handleTimelyRefresh(dataURL, frameworkController.setXMLResponse.bind(frameworkController));
				}
				dataURL.getDataFromConnection(dataURL.getDataSetValues(), frameworkController.setXMLResponse.bind(frameworkController));
			}
		});
	};
	var inArray = function(value, array) {
		return _.contains(_.map(array, function(value) {
			return value.toLowerCase();
		}), value.toLowerCase());
	};
	var createArray = function(dataArray) {
		return $.isArray(dataArray) ? dataArray : [dataArray];
	};
	/** @description if dashboard is empty user re-initialised **/
	var checkReinitialisation = function() {
		if (this.dashboard == "") {
			throw messages.errors.re_initialized;
		} else {
			return true;
		}
	};
	/** @description getting items from ID array **/
	var getArrayFromIDArray = function(arr, name, values) {
		var results = [];
		$.each(values, function(index, value) {
			var result = $.grep(arr, function(n) {
				return ((value !== undefined) && n[name].toLowerCase() == value.toLowerCase());
			});
			if (result[0]) {
				results.push(result[0]);
			}
		});
		if (results.length > 0) {
			return results;
		} else {
			return undefined;
		}
	};
	/** @description finding item in an array **/
	var findInArray = function(arr, name, value) {
		var result = $.grep(arr, function(n) {
			return ((value !== undefined) && n[name].toLowerCase() == value.toLowerCase());
		});
		if (result.length > 0) {
			return result[0];
		} else {
			return undefined;
		}
	};
	
};
var bizviz = new BizvizSDK();
var sdk = bizviz;
parent.window.BIZVIZ = parent.window.BIZVIZ || {};
parent.window.BIZVIZ.designer = parent.window.BIZVIZ.designer || {};
parent.window.BIZVIZ.designer.sdk = sdk;
//# sourceURL=BizVizDesignUserSDK.js