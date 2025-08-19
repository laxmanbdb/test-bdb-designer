/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ServiceFactory.js
 * @description service class for operations across the designer
 * **/
(function () {
	angular.module("designer")
	.factory("ServiceFactory", ["$http", "$timeout", "DesignerFactory", "notify", /*"toaster",*/ function ($http, $timeout, dF, notify/*, toaster*/) {
				var services = {};
				var currentMessages = {};

				/**
				 * @function
				 * @description This function will get the JSON from a data file specified.
				 * @param { string } dataFile - The data file path.
				 * @param { function } sCallback - The callback function which will be called after successfully finishing the operation.
				 * @param { string | number | object } args - The argument if we want to get into the eCallback/sCallback function.
				 * @param { function } eCallback - The callback function which will be called in case of any error during the operation.
				 */
				services.getJsonFileData = function (dataFile, sCallback, args, eCallback) {
					$http.get(dataFile, {cache: true})
					.then(function (response) {
						if (sCallback && typeof sCallback === "function") {
							sCallback(response.data, args);
						}
					},function (html, status, c, d) {
						if (eCallback && typeof eCallback === "function") {
							eCallback(status, args);
						}
						console.log("Error status code : " + status);
					});
				};

				services.getAuthInfo = function () {
					return dF.AUTH_INFO;
				};

				services.showLoader = function (config) {
					$.unblockUI();
					$.blockUI({
						message : "<div class=\"la-ball-clip-rotate la-dark la-lg\"><div></div></div>",
						timeout : ((config && config.timeout !== undefined) ? config.timeout : 60000),
						css : {
							zIndex : 9999999999,
							border : "none",
							top : "25%",
							background : "transparent"
						},
						overlayCSS : {
							backgroundColor : "#2dc3e8",
							opacity : 0.2,
							cursor : "wait",
							zIndex : 9999999999
						}
					});
				};

				services.hideLoader = function () {
					$.unblockUI();
				};

				services.AUTH_INFO = {
					get : function (propertyName) {
						switch (propertyName) {
					    case "authType":
					        return dF.AUTH_INFO[ "authType" ];
					        break;
						case "token":
							return dF.AUTH_INFO["authToken"];
							break;
						case "spacekey":
							return dF.AUTH_INFO["user"]["spaceKey"];
							break;
						case "userID":
							return dF.AUTH_INFO["user"]["id"];
							break;
						case "preferenceObject":
							return dF.AUTH_INFO["preference"]["themeID"];
							break;
						case "rootFolders":
							return dF.AUTH_INFO["trees"];
							break;
						case "user":
							return dF.AUTH_INFO["user"];
							break;
						case "preferenceID":
							return undefined;
							break;
						case "lite":
							return dF.AUTH_INFO["user"]["lite"];
							break;
						default:
							return undefined;
							break;
						}
					}
				};

				/**
				 * @function
				 * @description returns the common element in the arrays supplied
				 * @param { array } ... - any number of arguments as array of string
				 **/
				services.getCommonElement = function () {
					var result = [],
					matched = true;
					if (arguments.length > 0) {
						for (var i = 0; i < arguments[0].length; i++) {
							for (var j = 1; j < arguments.length; j++) {
								if (arguments[j].indexOf(arguments[0][i]) == -1) {
									matched = false;
								} else {
									matched = true;
								}
							}
							if (matched) {
								result.push(arguments[0][i]);
							}
						}
					}
					return result;
				}

				/**
				 * @function
				 * @description checks whether argument is an array or not
				 * @param { any } arg0 - The argument to check
				 **/
				services.isArray = function (arg0) {
					return Object.prototype.toString.call(arg0) === "[object Array]";
				};

				/**
				 * @function
				 * @description checks whether array contains the element or not
				 * @param { array } array - Array to be checked
				 * @param { string } element - The element to be searched in the array
				 **/
				services.isArrayContains = function (array, element) {
					return array.indexOf(element) != -1;
				}

				services.showNotification = function (message, classes, duration) {
					var nFyObj = null;
					var alertDuration = 60000;
					duration = (classes == "alert-warning" || classes == "alert-danger") ? alertDuration : duration;
					if (classes == "alert-success" && 
					        dF.userPreference && 
					        !dF.userPreference.defaultSettings.notifyOnSuccess) {
						return false;
					}
					if(classes == "alert-info" && dF.userPreference && dF.userPreference.defaultSettings.blockNotificaton){
						return false;
					}
					// Check if a message of the same type is already being displayed
			        if (currentMessages[message]) {
			            currentMessages[message].close();
			            currentMessages[message]= null;
			        }			        
					if (message) {
						nFyObj = notify({
								message : message,
								classes : classes,
								duration : duration
							});
						// Store the current message by its type
            			currentMessages[message] = nFyObj;            	
						if(duration>0){
								setTimeout(function () {
									nFyObj.close();
									currentMessages[message] = null;
									}, duration);
						}						
					}
				}

				services.closeAllNotifications = function () {
					notify.closeAll();
				};

				services.setUpHeaders = function () {
					return {
						"Content-Type" : "application/x-www-form-urlencoded",
						"authtoken" : services.AUTH_INFO.get("token"),
						"spacekey" : services.AUTH_INFO.get("spacekey"),
						"userid" : services.AUTH_INFO.get("userID")
					};
				}
				services.setupFormData = function (formData) {
					formData["token"] = services.AUTH_INFO.get("token");
					formData["spacekey"] = services.AUTH_INFO.get("spacekey");
					formData["userid"] = services.AUTH_INFO.get("userID");
					formData["from"] = 0;
					formData["rows"] = 9999;
					return formData;
				}

				services.postRequestToServer = function (url, requestHeaders, data, successCallback, errorCallback) {
					dF.xhrInProgress = true;
					dF.xhrCounter++;
					$("#web-conn-loader").show();
					var tOut = setTimeout(function () {
						$(".loader").hide();
						services.showNotification("Server is taking too much time", "alert-info", 3000);
					}, 60000);
					
					BIZVIZ.SDK.secureRequest(url, data, 
					function (data, status, headers, config) {
						successCallback(data, status, headers, config);
						dF.xhrCounter--;
						if (!dF.xhrCounter) {
							$("#web-conn-loader").hide();
						}
						clearTimeout(tOut);
						dF.xhrInProgress = false;
					}, function (a, b, c, d) {
						$("#web-conn-loader").hide();
						if (b == 0) {
							clearTimeout(tOut);
							$("#sessionWarning").modal("show");
						}
						if (errorCallback && typeof(errorCallback) === "function") {
							errorCallback(a, b, c, d);
						}
					});
				};
				
				services.isValidHexColorString = function (hexColorString) {
					return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hexColorString);
				};
				services.correctObjectFormat = function (_string) {
					if (typeof(_string) == "boolean") {
						return _string;
					} else if (typeof(_string) == "object") {
						return _string;
					} else if (isNaN(_string)) {
						if (_string === "true") {
							return true;
						} else if (_string === "false") {
							return false;
						} else {
							return _string;
						}
					} else {
						return parseFloat(_string)
					}
				};
				services.getValidBoolean = function( value ) {
                    var lcString;
                    if( typeof( value ) === "string" ) {
                        lcString = value.toLowerCase();
                        if( lcString == "true" ) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else if( typeof( value ) === "boolean" ) {
                        return value;
                    }
                    else {
                        return !!value;
                    }
                };
				return services;
			}
		])
	.factory("XLSXReaderService", ["$q", "$rootScope",
			function ($q, $rootScope) {
				var service = function (data) {
					angular.extend(this, data);
				}
				service.readFile = function (file, readCells, toJSON) {
					var deferred = $q.defer();
					XLSXReader(file, readCells, toJSON, function (data) {
						$rootScope.$apply(function () {
							deferred.resolve(data);
						});
					});
					return deferred.promise;
				}
				return service;
			}
		]);

})();
//# sourceURL=ServiceFactory.js