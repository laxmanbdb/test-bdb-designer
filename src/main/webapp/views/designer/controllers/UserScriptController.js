/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: UserScriptController.js
 * @description it controls the user script window actions
 * **/
(function () {
	/** Controller function for property
	 * @param  {Object} $scope         The scope object
	 * @param  {Object} ServiceFactory The ServiceFactory
	 * @param  {Object} DesignerFactory The DesignerFactory
	 * @return {undefined}                   undefined
	 */
	var userScriptCtrlFn = function($scope, ServiceFactory, DesignerFactory) {
		$scope.defaultValues = [];
		$scope.fnVisible = false;
		$scope.scriptOf = "";

		/**
		 * Used by code mirror for script hint
		 * @param  {Object} cm   The code mirror instance
		 * @param  {Object} opts The options
		 * @return {Object}      object containing to, from and list of tokens
		 */
		CodeMirror.hint.designerScriptHint = function (cm, opts) {
			var inner = {
				from : cm.getCursor(),
				to : cm.getCursor(),
				list : []
			},
			_propOf = [],
			_cur = cm.getCursor(),

			/**
			 * Checks and fill the tokens
			 * @param  {String} _start start
			 * @param  {String} token  token
			 * @return {undefined}        undefined
			 */
			_checkAndFillTokens = function (_start, token) {
				var
				_caseInSensitiveToken = token.toUpperCase(),
				_caseInSensitiveStart = _start.toUpperCase();
				if (_caseInSensitiveToken.lastIndexOf(_caseInSensitiveStart, 0) == 0) {
					inner.list.push(token);
				}
			},

			/**
			 * Gets token hint from cursor position
			 * @param  {Object} _cm     Code mirror instance
			 * @param  {Object} _curPos position object of the cursor
			 * @return {String}         token
			 */
			_getTokenHint = function (_cm, _curPos) {
				return _cm.getTokenAt(_curPos)
			},

			/**
			 * Gets token
			 * @param  {Object} _cm Code Mirror instance
			 * @return {Object}     token object
			 */
			_getToken = function (_cm) {
				var
				_curPos = _cm.getCursor(),
				_tokenHint = _getTokenHint(_cm, _curPos);
				_tokenHint.state = CodeMirror.innerMode(_cm.getMode(), _tokenHint.state).state,
				_tempProp = null;
				if (!/^[\w$_]*$/.test(_tokenHint.string)) {
					_tokenHint = {
						start : _curPos.ch,
						end : _curPos.ch,
						string : "",
						state : _tokenHint.state,
						type : _tokenHint.string == "." ? "property" : null
					}
				} else if (_tokenHint.end > _curPos.ch) {
					_tokenHint.end = _curPos.ch;
					_tokenHint.string = _tokenHint.string.slice(0, _curPos.ch - _tokenHint.start);
				}

				_tempProp = _tokenHint;
				while (_tempProp.type == "property") {
				    var _tempPropCurPos = CodeMirror.Pos(_curPos.line, _tempProp.start);
					_tempProp = _getTokenHint(_cm, _tempPropCurPos);
					if (_tempProp.string != ".") {
						return false;
					}
					_tempPropCurPos = CodeMirror.Pos(_curPos.line, _tempProp.start);
					_tempProp = _getTokenHint(_cm, _tempPropCurPos);
					_propOf.push(_tempProp);
				}

				return {
					tokenHint : _tokenHint,
					propOf : _propOf
				};
			},

			/**
			 * Gets all string properties from the object specified
			 * @param  {Object} obj The object
			 * @return {Array}     array of properties
			 */
			_getAllStringPropertiesFromObject = function (obj) {
				var
				_result = [],
				_getString = function (value) {
					$.each(value, function (k, v) {
						if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
							_result.push(v);
							return v;
						}
						_getString(v);
					});
				}
				_getString(obj);
				return _result;
			},

			/**
			 * Prepare hints for the designer
			 * @param  {String} _hintToken Hints token
			 * @param  {Object} _propOf    object which hits has to be prepared
			 * @return {undefined}            undefined
			 */
			_prepareDesignerHint = function (_hintToken, _propOf) {
				if (_propOf) {
					var
					sdkProp = $scope.modal.sdkProperties[_propOf.string],
					propList = sdkProp ? _getAllStringPropertiesFromObject(sdkProp) : [];
					for (var i = 0; i < propList.length; i++) {
						_checkAndFillTokens(_hintToken.string, propList[i]);
					}
				} else {
					var
					dvArray = $scope.modal.dashVarMap[DesignerFactory.getSelectedDashboardId()];
					if (dvArray) {
						for (var i = 0; i < dvArray.length; i++) {
							_checkAndFillTokens(_hintToken.string, dvArray[i]);
						}
					}
				}
				inner.from = CodeMirror.Pos(_cur.line, _hintToken.start);
				inner.to = CodeMirror.Pos(_cur.line, _hintToken.end);
			},

			/**
			 * Check for the array element
			 * @param  {Any}  _arrayElement array element
			 * @return {Boolean}               [description]
			 */
			_isArrayHaving = function (_arrayElement) {};

			var tHint = _getToken(cm);
			_prepareDesignerHint(tHint.tokenHint, tHint.propOf[0]);

			return inner;
		};

//				$scope.modal.scriptFor = "";
		/**
		 * Onload callback
		 * @param  {Object} cm Code Mirror instance
		 * @return {undefined}    undefined
		 */
		$scope.onLoadScriptEditor = function (cm) {
			cm.setSize("auto", "100%");
			window.cm = $scope.modal.cm = cm;
			$(document).on("shown.bs.tab", 'a[data-toggle="tab"]', function (e) {
				cm.refresh();
				cm.focus();
			})
		};

		/**
		 * Options for the codemirror
		 * @type {Object}
		 */
		$scope.scriptEditorOptions = {
			lineNumbers : true,
			mode : {
				name : "javascript",
				helperType : "designerScriptHint"
			},
			autofocus : true,
			tabSize: 4,
	        indentUnit: 4,
	        indentWithTabs: true,
			lineNumbers: true,
			undoDepth: 500,
			extraKeys : {
				"Ctrl-Space" : "autocomplete"
			},
			styleActiveLine: true,
		    matchBrackets: true,
		    lint: true,
		    gutters: ["CodeMirror-lint-markers"]
		};

		/**
		 * Resets the function window
		 * @param  {String} _from        from
		 * @param  {Boolean} _isComponent flag to check component or connection
		 * @param  {String} _type        type
		 * @return {undefined}              undefined
		 */
		$scope.resetFunctionWindow = function (_from, _isComponent, _type) {
		    $scope.displayFnOptions = false;
		    $scope.displayObjOptions = false;
			$scope.clearObjectSearchKey();
		
			if (_isComponent) {
				if($scope.modal.selectedComponentId!=""){
				var item = DesignerUtil.prototype.findInArray($scope.modal.selectedDashboard.json.Dashboard[$scope.modal.layoutType].Object, "objectID", $scope.modal.selectedComponentId);
				$scope.userScript = item["variable"]["userScript"];
				$scope.scriptOf = item["objectName"];
				$scope.userScript.id = $scope.modal.selectedComponentId;
				}
			} else if (_type == "Dashboard") {
				$scope.userScript = $scope.modal.selectedDashboard.json.Dashboard.variable.userScript;
				$scope.scriptOf = "Dashboard";
				$scope.userScript.id = $scope.modal.selectedDashboard.json.Dashboard.id;
			} else {
				$scope.userScript = $scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.variable.userScript;
			
			}
			$scope.modal.updateDashboardStatus(1);
			if (_from) {
				pasteElementChange(_from)
			} else {
				pasteElementChange("txt_UserScript_comp");
			}
			setTimeout( $scope.$apply.bind( $scope ) );
//					$scope.$apply();
		};

		/**
		 * Inserts text from the connection
		 * @param  {String} textID      The text id
		 * @param  {String} value       The text value
		 * @param  {String} insertQuote ''/""
		 * @return {undefined}             undefined
		 */
		$scope.insertTextFromConnection = function (textID, value, insertQuote) {
			if (insertQuote == undefined) {
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.variable.userScript.value = insertTextAtCursorPos(textID, "'" + value + "'");
			} else {
				$scope.modal.selectedDashboard.json.Dashboard.DataProviders.selectedConnection.variable.userScript.value = insertTextAtCursorPos(textID, value);
			}
		}

		/**
		 * Inserts text to the text box
		 * @param  {String} textID      text box id
		 * @param  {String} value       value to be inserted
		 * @param  {String} insertQuote ''/""
		 * @return {undefined}             undefined
		 */
		$scope.insertText = function (textID, value, insertQuote) {
			if (insertQuote == undefined) {
				$scope.userScript.value = insertTextAtCursorPos(textID, "'" + value + "'");
			} else {
				$scope.userScript.value = insertTextAtCursorPos(textID, value);
			}
		};

		/**
		 * Change to defuat select
		 * @param  {Object} event The event object
		 * @return {undefined}       undefined
		 */
		$scope.changeToDefaultSelect = function (event) {
			setTimeout(function () {
				$(".sel_InternalFunction").prop("selectedIndex", -1)
			}, 500);
		};

		/**
		 * Paste text from search objects
		 * @param  {Object} $event      The event object
		 * @param  {String} value       Text value
		 * @param  {String} insertQuote ''/""
		 * @return {undefined}             undefined
		 */
		$scope.pasteTextFromSearchObjects = function ($event, value, insertQuote) {
			var textID = $($event.currentTarget).attr("paste-to");
			if (textID != undefined) {
				if (insertQuote == undefined)
					$scope.userScript.value = insertTextAtCursorPos(textID, value);
				else
					$scope.userScript.value = insertTextAtCursorPos(textID, "'" + value + "'");
			}
		};

		/**
		 * Load some function names
		 * @return {undefined} undefined
		 */
		$scope.loadInbuiltFunctions = function () {
			ServiceFactory.getJsonFileData("./resources/data/InbuiltFunctions.data", function (dJson) {
				$scope.inbuiltFunctions = dJson;
			});
		};

		/**
		 * Clears object search key
		 * @return {undefined} undefined
		 */
		$scope.clearObjectSearchKey = function () {
			//			not working with angular!
			$(".searchKeyText").val("");
			$(".searchResult").addClass("ng-hide");
			$(".srchAvailConditionTag").val("");
			$scope.actualTag = "";
		};
		
		/**
		 * Updates selected internal functions
		 * @param  {Object}   e  The event object
		 * @param  {String} fn selected function name
		 * @return {undefined}      undefined
		 */
		$scope.updateSelectedInternalFunction = function( e, fn ) {
		    $scope.selectedInternalFunction = fn;
		    var eFromId = $( e.target ).closest( ".tab-pane" ).attr( "id" );
	        switch( eFromId ) {
	            case "csvLoadScriptDivision":
	            case "excelLoadScriptDivision":
	            case "webserviceLoadScriptDivision":
                    $scope.insertTextFromConnection( "txt_UserScript_csv", fn.internalFunction, false );
                    break;
                default:
                    $scope.insertText( "txt_UserScript_comp", fn.internalFunction, false );
                    break;
	        }
		    $scope.changeToDefaultSelect();
		};
		
		/**
		 * Toggles function options
		 * @param  {Object} e The event object
		 * @return {undefined}   undefined
		 */
		$scope.toggleFnOptions = function( e ) {
		    var $curTag = $( e.target );
		    $scope.displayObjOptions = false;
            if( $curTag.hasClass( "bvz-display" ) || 
                    $curTag.hasClass( "bvz-display-placeholder" ) || 
                    $curTag.hasClass( "glyphicon" ) ) {
                if( $scope.displayFnOptions ) {
                    $scope.displayFnOptions = false;
                    $scope.fnQuery = "";
                }
                else {
                    $scope.displayFnOptions = true;
                    setTimeout( function() {
                        $( ".bvz-search" ).focus();
                    } );
                }
            }
            else if( $curTag.hasClass( "bvz-search" ) ) {
            	// Do nothing
            } else {
                $scope.displayFnOptions = false;
                $scope.fnQuery = "";
            }
		};
	}

	/** @description Controller definition **/
	angular.module(designerModules.module.DesignerPropertyManager)
	.controller("UserScriptController", ["$scope", "ServiceFactory", "DesignerFactory", userScriptCtrlFn]);

})();
//# sourceURL=UserScriptController.js