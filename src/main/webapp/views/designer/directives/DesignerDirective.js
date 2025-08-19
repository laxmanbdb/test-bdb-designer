/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File DesignerDirective.js
 * @description directives for designer modules 
 * **/
(function() {
	/** Designer **/
    angular.module("designer")
    	.directive("bizMainmenu", function() {
            return {
                restrict: "A",
                controller: "MainMenuController",
                templateUrl: "./views/designerToggleMenu/MainMenu.html"
            };
        }).directive("bizDsncontainer", function() {
            return {
                restrict: "A",
                controller: "DashboardDesignerController",
                templateUrl: "./views/designArea/DesignerContainer.html"
            };
        }).directive("designHomeView", function() {
            return {
                restrict: "E",
                controller: "DesignerController",
                templateUrl: "./views/designArea/DesignHomeView.html"
            };
        }).directive("bizMaintab", function() {
            return {
                restrict: "A",
                controller: "DesignerPropertyController",
                templateUrl: "./views/dashboardTabs/MainTab.html"
            };
        }).directive("bvzSearchObjects", function() {
            return {
                restrict: "AE",
                controller: "DesignerController",
                templateUrl: "./views/SearchObjects.html"
            };
        }).directive("gvarSearchTool", function() {
            return {
                restrict: "AE",
                controller: "DesignerController",
                templateUrl: "./views/SearchGvarAttributes.html"
            };
        }).directive("fnSearchTool", function() {
            return {
                restrict: "AE",
                controller: "UserScriptController",
                templateUrl: "./views/SearchFunctions.html"
            };
        }).directive("bizvizWorkspaceManagement", function() {
            return {
                restrict: "E",
                controller: "MainMenuController",
                templateUrl: "./views/designerToggleMenu/manageWorkspace.html"
            };
        }).directive("bizvizTemplates", function() {
            return {
                restrict: "E",
                controller: "MainMenuController",
                templateUrl: "./views/designerToggleMenu/Templates.html"
            };
        }).directive("bizvizTemplateList", function() {
            return {
                restrict: "E",
                controller: "MainMenuController",
                templateUrl: "./views/designerToggleMenu/TemplateList.html"
            };
        }).directive("bizvizSampleDashboard", function() {
            return {
                restrict: "E",
                controller: "MainMenuController",
                templateUrl: "./views/designerToggleMenu/SampleDashboard.html"
            };
        }).directive("bizvizOpenDashboard", function() {
            return {
                restrict: "E",
                controller: "MainMenuController",
                templateUrl: "./views/designerToggleMenu/OpenDashboard.html"
            };
        }).directive("bizvizExportDashboard", function() {
            return {
                restrict: "E",
                controller: "MainMenuController",
                templateUrl: "./views/designerToggleMenu/ExportDashboard.html"
            };
        }).directive("bizvizUserPreferencesDashboard", function() {
            return {
                restrict: "E",
                controller: "MainMenuController",
                templateUrl: "./views/designerToggleMenu/UserPreferencesDashboard.html"
            };
        }).directive("bizvizPublishDashboard", function() {
            return {
                restrict: "E",
                controller: "MainMenuController",
                templateUrl: "./views/designerToggleMenu/PublishDashboard.html"
            };
        }).directive("bizvizWelcomeNote", function() {
            return {
                restrict: "E",
                controller: "MainMenuController",
                templateUrl: "./views/designerToggleMenu/WelcomePage.html"
            };
        }).directive("bizvizFileExplorer", function() {
            return {
                restrict: "EA",
                controller: "FileExplorerController",
                templateUrl: "./views/FileExplorer.html"
            };
        }).directive("bizvizDesignerHelp", function() {
        	return {
                restrict: "E",
                controller: "HelpController",
                templateUrl: "./views/helpIndex.html"
            };
        }).directive('matTooltip', function () {
            return {
                link: function ($scope, element, attr) {
                    tippy(element[0],
                    		{
                        content: attr.matTooltip || '',
                        placement: attr.placement || 'bottom',
                        allowHTML: true
                    });
                }
            }
        }).directive("repeatEnd", function() {
            return {
                restrict: "A",
                link: function($scope, el, attrs) {
                    if ($scope.$last) {
                        $scope.$eval(attrs.repeatEnd);
                    }
                }
            };
        }).directive("bvzResponsive", ["$compile", function($compile) {
            var x = "";
            var updateAttr = function($div, attr) {
                    if (attr) {
                        for (var k in attr) {
                            if (attr.hasOwnProperty(k)) {
                                $div.attr(k, attr[k]);
                            }
                        }
                    }
                },
                createLayout = function($target, containers) {
                    var $div,
                        $parent,
                        perHt,
                        ht,
                        dpdHt = $(".draggablesParentDiv").height();
                    for (var i = 0; i < containers.length; i++) {
                        $div = $("<div></div>").attr("id", containers[i]["id"]);
                        updateAttr($div, containers[i]["attr"]);
                        if (!containers[i]["parent"].trim()) {
                            $target.append($div);
                        }
                        else {
                            perHt = containers[i]["pheight"] * 1;
                            if (perHt) {
                                ht = Math.floor(dpdHt * perHt / 100) - 2;
                                $div.height(ht);
                            }
                            $parent = $("#" + containers[i]["parent"]);
                            $parent.append($div);
                        }
                    }
                },
                handleIds = function($scope) {
                    var $innerDivs = $("#templeteContainer div");
                    $.each($innerDivs, function(k, v) {
                        var id = $(v).attr("id");
                        if (id.indexOf("dashboard") == -1) {
                            $(v).attr("id", $scope.modal.selectedDashboard.id + "-" + $(v).attr("id"));
                        }
                    });
                },
                getTemplete = function(containers, $scope) {
                    createLayout($("#templeteContainer"), containers);
                    handleIds($scope);
                    var $cols = $("#templeteContainer").find(".bv-col-bs"),
                        $vDiv = "";
                    $.each($cols, function(k, v) {
                        if ($(v).children().length == 0) {
                            $vDiv = $("<div></div>");
                            $vDiv.addClass("vDiv");
                            $(this).attr("data-drop", "true").attr("ng-drop", "true").attr("ng-drop-success", "onDropComplete( $data, $event, element )").append($vDiv);
                        } else {
                            $(v).removeClass("bv-col-bs");
                        }
                    });
                    return $("#templeteContainer").html();
                },
                linkFn = function(scope, element) {
                    var containers = scope.modal.selectedDashboard.json.Dashboard["Containers"]["Container"],
                        templete = getTemplete(containers, scope);
                    element.empty();
                    element.append(templete);
                    $compile(element.contents())(scope);
                    $("#templeteContainer").empty();
                };
            return {
                restrict: "A",
                controller: "MainMenuController",
                template: x,
                link: linkFn
            };
        }]).directive("sglclick", ["$parse", function($parse) {
            return {
                restrict: "A",
                link: function(scope, element, attr) {
                    var fn = $parse(attr["sglclick"]),
                        delay = 300,
                        clicks = 0,
                        timer = null;
                    element.on("click", function(event) {
                        clicks++;
                        if (clicks === 1) {
                            timer = setTimeout(function() {
                                scope.$apply(function() {
                                    fn(scope, {
                                        $event: event
                                    });
                                });
                                clicks = 0;
                            }, delay);
                        } else {
                            clearTimeout(timer);
                            clicks = 0;
                        }
                    });
                }
            };
        }]).directive("jqSortable", ["$timeout", function($timeout) {
            return {
                restrict: "A",
                scope: {
                    sortCfg: "="
                },
                link: function($scope, el) {
                    $timeout(function() {
                        $(el).sortable($scope.sortCfg);
                    }, 0);
                }
            };
        }])
        /** 
         * @description wrapper directive for jquery-ui resizable 
         * @require jqury-ui
         *  <ANY jq-resizable="jqUiResizableConfig"></ANY>
         *  where jqUiResizableConfig is a javascript object as in jquery-ui resizable
         * */
        .directive("jqResizable", ["$parse", function($parse) {
            return {
                link: function($scope, el, attrs) {
                    var resizeConfig = $parse(attrs.jqResizable)($scope);
                    el.resizable(resizeConfig);
                }
            };
        }])
        /** 
         * @description wrapper directive for jquery-ui selectable 
         * @require jqury-ui
         *  <ANY jq-selectable="jqUiSelectableConfig"></ANY>
         *  where jqUiSelectableConfig is a javascript object as in jquery-ui selectable
         * */
        .directive("jqSelectable", ["$parse", function($parse) {
            return {
                link: function($scope, el, attrs) {
                    var selectConfig = $parse(attrs.jqSelectable)($scope);
                    el.selectable(selectConfig);
                }
            };
        }])
        /** 
         * @description for searching in list according to the property name 
         *  <ANY ng-repeat="x in xList | advSearch :[searchToken] :[pName]"></ANY>
         *  where searchToken should be any variable which contains string as ngModel 
         *  for text box and pName is the propertyName as string
         * */
        .filter("advSearch", function() {
            return function(list, searchToken, pName) {
                if (!searchToken) {
                    return list
                };
                var ciSearchToken = searchToken.toLowerCase(),
                    fList = [],
                    ciIvalue,
                	compRefid;
                angular.forEach(list, function(v, k) {
                    if (typeof(v) === "object") {
                        if (v.hasOwnProperty(pName)) {
                            ciIvalue = v[pName].toString().toLowerCase();
                            compRefid = (v["referenceID"] !== undefined) ? v["referenceID"].toString().toLowerCase() : "";
                            if ((ciIvalue.indexOf(ciSearchToken) != -1) || (compRefid.indexOf(ciSearchToken) != -1)) {
                                fList.push(v);
                            }
                        }
                    } else {
                        ciIvalue = v.toString().toLowerCase();
                        if (ciIvalue.indexOf(ciSearchToken) != -1) {
                            fList.push(v);
                        }
                    }
                });
                return fList;
            };
        })
        /**added filter to search text in the script section of components & connections**/
        .filter("scriptSearch", function() {
            return function(list, searchToken, pName) {
                if (!searchToken) {
                    return list
                };
                var ciSearchToken = searchToken.toLowerCase(),
                    fList = [],
                    ciIvalue,
                	compRefid;
                angular.forEach(list, function(v, k) {
                    if (typeof(v) === "object") {
                            ciIvalue = v['variable']['userScript'][pName].toString().toLowerCase();
                            compRefid = (v["referenceID"] !== undefined) ? v["referenceID"].toString().toLowerCase() : "";
                            if ((ciIvalue.indexOf(ciSearchToken) != -1)) {
                                fList.push(v);
                            }
                    } else {
                        ciIvalue = v.toString().toLowerCase();
                        if (ciIvalue.indexOf(ciSearchToken) != -1) {
                            fList.push(v);
                        }
                    }
                });
                return fList;
            };
        })
        /** 
         * @description filter for converting string to TitleCase
         * used in header of property/ dataset palette. 
         * */
        .filter("titlecase", function() {
            return function(input) {
                var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
                try {
                    var inputStr = ("" + input).toLowerCase();
                    return inputStr.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
                        if (index > 0 && index + match.length !== title.length && match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" && (title.charAt(index + match.length) !== "-" || title.charAt(index - 1) === "-") && title.charAt(index - 1).search(/[^\s-]/) < 0) {
                            return match.toLowerCase();
                        }
                        if (match.substr(1).search(/[A-Z]|\../) > -1) {
                            return match;
                        }
                        return match.charAt(0).toUpperCase() + match.substr(1);
                    });
                }
                catch (e) {
                    return input;
                }
            }
        });
    
    /** ComponentManager **/
    angular.module(designerModules.module.ComponentManager)
	    .directive("bizCompContainer", function() {
	        return {
	            templateUrl: "./views/dashboardTabs/WidgetExplorer.html",
	            controller: "WidgetController"
	        }
	    });
    
    /** DesignerPropertyManager **/
    angular.module(designerModules.module.DesignerPropertyManager)
	    .directive("bizObjectBrowserContainer", function() {
	        return {
	            templateUrl: "./views/dashboardTabs/ObjectBrowserManagement.html",
	            controller: "ObjectBrowserController"
	        };
	    });
    
    /** Restrict special character typing in input-textbox of Save Dashboard Name / Published Dashboard Name/ Calculated Field Name **/
    angular.module(designerModules.module.DesignerPropertyManager)
    .directive('ngPatternRestrict', [function () {
    	'use strict';
    	return {
    		restrict: 'A',
    		require: "?ngModel",
    		compile: function uiPatternRestrictCompile() {
    			return function ngPatternRestrictLinking(scope, iElement, iAttrs, ngModelController) {
    				var regex, // validation regex object
    				oldValue, // keeping track of the previous value of the element
    				caretPosition, // keeping track of where the caret is at to avoid jumpiness
    				// housekeeping
    				initialized = false, // have we initialized our directive yet?
    				eventsBound = false, // have we bound our events yet?
    				// functions
    				getCaretPosition, // function to get the caret position, set in detectGetCaretPositionMethods
    				setCaretPosition; // function to set the caret position, set in detectSetCaretPositionMethods

    				//-------------------------------------------------------------------
    				// caret position
    				function getCaretPositionWithInputSelectionStart() {
    					return iElement[0].selectionStart; // we need to go under jqlite
    				}

    				function getCaretPositionWithDocumentSelection() {
    					// create a selection range from where we are to the beggining
    					// and measure how much we moved
    					var range = document.selection.createRange();
    					range.moveStart('character', -iElement.val().length);
    					return range.text.length;
    				}

    				function getCaretPositionWithWindowSelection() {
    					var s = window.getSelection(),
    					originalSelectionLength = String(s).length,
    					selectionLength,
    					didReachZero = false,
    					detectedCaretPosition,
    					restorePositionCounter;

    					do {
    						selectionLength = String(s).length;
    						s.modify('extend', 'backward', 'character');
    						// we're undoing a selection, and starting a new one towards the beggining of the string
    						if (String(s).length === 0) {
    							didReachZero = true;
    						}
    					} while (selectionLength !== String(s).length);

    					detectedCaretPosition = didReachZero ? selectionLength : selectionLength - originalSelectionLength;
    					s.collapseToStart();

    					restorePositionCounter = detectedCaretPosition;
    					while (restorePositionCounter-- > 0) {
    						s.modify('move', 'forward', 'character');
    					}
    					while (originalSelectionLength-- > 0) {
    						s.modify('extend', 'forward', 'character');
    					}

    					return detectedCaretPosition;
    				}

    				function setCaretPositionWithSetSelectionRange(position) {
    					iElement[0].setSelectionRange(position, position);
    				}

    				function setCaretPositionWithCreateTextRange(position) {
    					var textRange = iElement[0].createTextRange();
    					textRange.collapse(true);
    					textRange.moveEnd('character', position);
    					textRange.moveStart('character', position);
    					textRange.select();
    				}

    				function setCaretPositionWithWindowSelection(position) {
    					var s = window.getSelection(),
    					selectionLength;

    					do {
    						selectionLength = String(s).length;
    						s.modify('extend', 'backward', 'line');
    					} while (selectionLength !== String(s).length);
    					s.collapseToStart();
    					while (position--) {
    						s.modify('move', 'forward', 'character');
    					}
    				}

    				// HACK: Opera 12 won't give us a wrong validity status although the input is invalid
    				// we can select the whole text and check the selection size
    				// Congratulations to IE 11 for doing the same but not returning the selection.
    				function getValueLengthThroughSelection(input) {
    					// only do this on opera, since it'll mess up the caret position
    					// and break Firefox functionality
    					if (!/Opera/i.test(navigator.userAgent)) {
    						return 0;
    					}

    					input.focus();
    					document.execCommand("selectAll");
    					var focusNode = window.getSelection().focusNode;
    					return (focusNode || {}).selectionStart || 0;
    				}

    				//-------------------------------------------------------------------
    				// event handlers
    				function revertToPreviousValue() {
    					if (ngModelController) {
    						scope.$apply(function () {
    							ngModelController.$setViewValue(oldValue);
    						});
    					}
    					iElement.val(oldValue);

    					if (!angular.isUndefined(caretPosition)) {
    						setCaretPosition(caretPosition);
    					}
    				}

    				function updateCurrentValue(newValue) {
    					oldValue = newValue;
    					caretPosition = getCaretPosition();
    				}

    				function genericEventHandler(evt) {
    					//HACK Chrome returns an empty string as value if user inputs a non-numeric string into a number type input
    					// and this may happen with other non-text inputs soon enough. As such, if getting the string only gives us an
    					// empty string, we don't have the chance of validating it against a regex. All we can do is assume it's wrong,
    					// since the browser is rejecting it either way.
    					var newValue = iElement.val(),
    					inputValidity = iElement.prop("validity");
    					if (newValue === "" && iElement.attr("type") !== "text" && inputValidity && inputValidity.badInput) {
    						evt.preventDefault();
    						revertToPreviousValue();
    					} else if (newValue === "" && getValueLengthThroughSelection(iElement[0]) !== 0) {
    						evt.preventDefault();
    						revertToPreviousValue();
    					} else if (regex.test(newValue)) {
    						updateCurrentValue(newValue);
    					} else {
    						evt.preventDefault();
    						revertToPreviousValue();
    					}
    				}

    				//-------------------------------------------------------------------
    				// setup based on attributes
    				function tryParseRegex(regexString) {
    					try {
    						regex = new RegExp(regexString);
    					} catch (e) {
    						throw "Invalid RegEx string parsed for ngPatternRestrict: " + regexString;
    					}
    				}

    				//-------------------------------------------------------------------
    				// setup events
    				function bindListeners() {
    					if (eventsBound) {
    						return;
    					}

    					iElement.bind('input keyup click', genericEventHandler);
    				}

    				function unbindListeners() {
    					if (!eventsBound) {
    						return;
    					}

    					iElement.unbind('input', genericEventHandler);
    					//input: HTML5 spec, changes in content

    					iElement.unbind('keyup', genericEventHandler);
    					//keyup: DOM L3 spec, key released (possibly changing content)

    					iElement.unbind('click', genericEventHandler);
    					//click: DOM L3 spec, mouse clicked and released (possibly changing content)

    					eventsBound = false;
    				}

    				//-------------------------------------------------------------------
    				// initialization
    				function readPattern() {
    					var entryRegex = !!iAttrs.ngPatternRestrict ? iAttrs.ngPatternRestrict : iAttrs.pattern;
    					tryParseRegex(entryRegex);
    				}

    				function notThrows(testFn, shouldReturnTruthy) {
    					try {
    						return testFn() || !shouldReturnTruthy;
    					} catch (e) {
    						return false;
    					}
    				}

    				function detectGetCaretPositionMethods() {
    					var input = iElement[0];

    					// Chrome will throw on input.selectionStart of input type=number
    					// See http://stackoverflow.com/a/21959157/147507
    					if (notThrows(function () {
    							return input.selectionStart;
    						})) {
    						getCaretPosition = getCaretPositionWithInputSelectionStart;
    					} else {
    						// IE 9- will use document.selection
    						// TODO support IE 11+ with document.getSelection()
    						if (notThrows(function () {
    								return document.selection;
    							}, true)) {
    							getCaretPosition = getCaretPositionWithDocumentSelection;
    						} else {
    							getCaretPosition = getCaretPositionWithWindowSelection;
    						}
    					}
    				}

    				function detectSetCaretPositionMethods() {
    					var input = iElement[0];
    					if (typeof input.setSelectionRange === 'function') {
    						setCaretPosition = setCaretPositionWithSetSelectionRange;
    					} else if (typeof input.createTextRange === 'function') {
    						setCaretPosition = setCaretPositionWithCreateTextRange;
    					} else {
    						setCaretPosition = setCaretPositionWithWindowSelection;
    					}
    				}

    				function initialize() {
    					if (initialized) {
    						return;
    					}

    					readPattern();

    					oldValue = iElement.val();
    					if (!oldValue) {
    						oldValue = "";
    					}

    					bindListeners();

    					detectGetCaretPositionMethods();
    					detectSetCaretPositionMethods();

    					initialized = true;
    				}

    				function uninitialize() {
    					unbindListeners();
    				}

    				iAttrs.$observe("ngPatternRestrict", readPattern);
    				iAttrs.$observe("pattern", readPattern);

    				scope.$on("$destroy", uninitialize);

    				initialize();
    			}
    		}
    	}
    }]);
    
})();