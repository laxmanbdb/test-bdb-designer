/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: DataSearch.js
 * @description DataSearch
 **/
function DataSearch(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();

	this.m_objectID = [];
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_globalkey = "";

	this.m_objectID = [];
	this.m_componentid = "";
	this.m_selecteddsid = "";
	this.isDataStoreLoaded = false;
	this.m_selecteddstore = {};
	this.m_searchquery = "";
	this.m_nlqresultobject = {};
	this.m_associatedchart = {
		"chart": "",
		"ds": "",
		"fields": [],
		"data": []
	};
	this.m_associateddschartid = "";
	this.m_panelheight = 300;
	this.m_paneliconfontsize = 14;
	this.m_fontcolor = "#000000";
	this.m_fontweight = "normal";
	this.m_fontfamily = "roboto";
	this.m_fontsize = "12";
	this.m_fontstyle = "normal";
	this.m_textdecoration = "none";
	this.m_cursortype = "pointer";
	this.m_placeholdertext = "Data Search";
	this.m_seriescolor = ["#03C9A9", "#F64747", "#4183D7", "#F89406", "#23C759", "#2682D5", "#FEAE47", "#3E9FC5", "#8BBFDC", "#86dff9"];
	this.m_fieldname = "";
	this.m_fieldvalue = "";
};

/** @description Using prototype inheriting the variable and method of Widget into DataSearch. **/
DataSearch.prototype = new Widget();

/** @description This method will parse the chart JSON and create a container **/
DataSearch.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

/** @description Iterate through chart JSON and set class variable values with JSON values **/
DataSearch.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "DataSearch") {
			for (var labelKey in jsonObject[key]) {
				this.setAttributeValueToNode(labelKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

/** @description Canvas Initialization **/
DataSearch.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description Creating Draggable Div and Canvas **/
DataSearch.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};

/** @description Creating component ID **/
DataSearch.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2) {
		this.m_objectid = this.m_objectid.split(".")[1];
	}
	this.m_componentid = "dataSearchDiv" + this.m_objectid;
};

/** @description Setting DataProvider and required Data formate date and default date **/
DataSearch.prototype.setDataProvider = function (data) {};

/** @description Starting of Date Picker Drawing **/
DataSearch.prototype.draw = function () {
	this.drawObject();
};

/** @description Calling init and drawChart function **/
DataSearch.prototype.drawObject = function () {
	this.init();
	this.drawChart();
	if (this.m_onafterrendercallback != "") {
		onAfterRender(this.m_onafterrendercallback);
	}
};

/** @description Date Picker initialization **/
DataSearch.prototype.init = function () {};

/** @description Drawing of DataSearch. **/
DataSearch.prototype.drawChart = function () {
	this.drawContainerDiv();
};
/** @description Drawing of DataSearch. **/
DataSearch.prototype.drawContainerDiv = function () {
	var temp = this;
	if (IsBoolean(this.m_isActive)) {
		var container = $("#draggableDiv" + temp.m_objectid);
		if ($("#" + temp.m_componentid) != null) {
			$("#" + temp.m_componentid).remove();
		}
		var div = document.createElement("div");
		div.setAttribute("id", temp.m_componentid);
		div.setAttribute("class", "dataSearchDiv");
		$(div).css({
			"height": this.m_height + "px",
			"border": this.m_borderthickness + "px solid " + this.m_bordercolor,
			"border-radius": this.m_borderradius + "px",
			"background-color": hex2rgb(convertColorToHex(this.m_backgroundcolor), this.m_bgalpha)
		});
		$(container).append(div);
		this.createInputNLQDiv(div);
		/** If datastoreID is available for component, get the information about the cube **/
		if(this.m_selecteddsid && this.m_selecteddsid !== ""){
			this.getCubeInfo(this.m_selecteddsid);
		}
	}
};
/** @description Create dataSearch input NLQ div element **/
DataSearch.prototype.setPlaceholderCSS = function (selector, cssObj) {
	var cssStr = "";
	for (var key in cssObj) {
		cssStr = cssStr + key + ": " + cssObj[key] + ";";
	}
	var rule = selector + "::placeholder" + "{ " + cssStr + "} ";
	rule += selector + "::-ms-input-placeholder" + "{ " + cssStr + "}";
	try {
		$("<div />", {
			html: '&shy;<style>' + rule + '</style>'
		}).appendTo(this.m_chartContainer);
	} catch (e) {
		console.log(e);
	}
};
/** @description Create dataSearch input NLQ div element **/
DataSearch.prototype.createInputNLQDiv = function (mainDiv) {
	var temp = this;
	var inputNLQDiv = document.createElement("div");
	inputNLQDiv.setAttribute("class", "inputNLQDiv");
	$(inputNLQDiv).css({
		"height": this.m_height + "px"
	});
	$(mainDiv).append(inputNLQDiv);

	var inputNLQ = document.createElement("input");
	inputNLQ.type = "text";
	inputNLQ.setAttribute("placeholder", temp.m_placeholdertext);
	inputNLQ.setAttribute("id", "inputNLQ" + temp.m_objectid);
	inputNLQ.setAttribute("class", "inputNLQText");
	inputNLQ.value = temp.m_searchquery;
	$(inputNLQ).css({
		"color": convertColorToHex(this.m_fontcolor),
		"font-size": (this.m_fontsize * 1) * this.minWHRatio() + "px",
		"font-family": selectGlobalFont(this.m_fontfamily),
		"font-weight": selectGlobalFont(this.m_fontweight),
		"font-style": selectGlobalFont(this.m_fontstyle),
		"text-decoration": this.m_textdecoration
	});
	$(inputNLQDiv).append(inputNLQ);
	temp.setPlaceholderCSS("#inputNLQ" + temp.m_objectid, {
		"color": convertColorToHex(this.m_fontcolor),
		"font-weight": selectGlobalFont(this.m_fontweight),
		"font-style": selectGlobalFont(this.m_fontstyle),
		"text-decoration": this.m_textdecoration
	});

	var clearInputText = document.createElement("span");
	clearInputText.id = "clearInputText" + temp.m_objectid;
	clearInputText.setAttribute("class", "inputNLQClear bd-close");
	//clearInputText.setAttribute("title", "Clear the search");
	$(clearInputText).on("mouseenter", function(e){
    	if(!temp.m_designMode){
    		//$(this).css({"color": "#000000"});
    		temp.removeToolTipDiv();
    		var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
    		var scrollLeft =  parentDiv.scrollLeft;
    		var scrollTop =  parentDiv.scrollTop;
    		var offset = $(parentDiv).offset();
    		var PageTop =  offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
    		var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft; 
    		var offsetLeft = $(this)[0].offsetLeft;
    		var offsetTop = $(this)[0].offsetTop;
    		var divTop = e.pageY - e.offsetY- PageTop + offsetTop + 20;
    		var divLeft = e.pageX - PageLeft - offsetLeft + 25;
    		var tooltipDiv = document.createElement("div");
    		tooltipDiv.innerHTML = "Clear the search";
    		tooltipDiv.setAttribute("id", "toolTipDiv");
    		tooltipDiv.setAttribute("class", "settingIcon");
    		tooltipDiv.setAttribute("placement", "bottom");
    		$(".draggablesParentDiv").append(tooltipDiv);
    		
    		var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
    			"top": divTop + "px",
    			"left": divLeft + "px"
    		});
    		$(tooltipDiv).css(tooltipObjCss);
    		var wd = tooltipDiv.offsetWidth * 1;
    		ht = tooltipDiv.offsetHeight * 1;
    		//var lt = e.pageX - e.offsetX - PageLeft - (wd/2)  +  "px";
    		var lt =  e.pageX - e.offsetX + $(inputNLQ)[0].offsetWidth - (tooltipDiv.offsetWidth/2) + ($(clearInputText)[0].offsetWidth/2 ) - PageLeft - 16 + "px";
    		$(tooltipDiv).css("left",lt);
    		$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
    	}
	}).on("mouseleave", function(){
		//$(this).css({"color": convertColorToHex(temp.m_menupanelfontcolor)});
		temp.removeToolTipDiv();
	});
	$(clearInputText).css({
		"line-height": this.m_height + "px",
		"color": convertColorToHex(this.m_fontcolor)
	});
	$(inputNLQDiv).append(clearInputText);

	if (!temp.m_designMode) {
		/** initialize clear text button event */
		if (detectDevice.mobile() || detectDevice.tablet()) {
			clearInputText.addEventListener("touchstart", function (event) {
				inputNLQ.value = "";
				temp.m_searchquery = "";
				$(clearInputText).hide();
				$(inputNLQ).css("width", "100%");
				temp.m_nlqresultobject = {};
			}, false);
		} else {
			clearInputText.addEventListener("click", function (event) {
				inputNLQ.value = "";
				temp.m_searchquery = "";
				$(clearInputText).hide();
				$(inputNLQ).css("width", "100%");
				temp.m_nlqresultobject = {};
			}, false);
		}
		/** initialize inputNLQ element event */
		inputNLQ.addEventListener("keyup", function (event) {
			// Cancel the default action, if needed
			event.preventDefault();
			temp.m_searchquery = $(event.target).val();
			temp.inputCursorPos = this.selectionEnd; // index of cursor
			if (temp.m_searchquery != "") {
				$(inputNLQ).css("width", "calc(100% - 25px)");
				$(clearInputText).show();
			} else {
				$(clearInputText).hide();
				$(inputNLQ).css("width", "100%");
				temp.m_nlqresultobject = {};
			}
			// Number 13 is the "Enter" key on the keyboard
			if (event.keyCode === 13) {
				//Trigger the button element with a click or touch
				if (detectDevice.mobile() || detectDevice.tablet()) {
					var e = new Event('touchstart');
					e.touches = [];
					document.getElementById("inputNLP" + temp.m_objectid).dispatchEvent(e);
				} else {
					document.getElementById("inputNLP" + temp.m_objectid).click();
				}
			}
		});
	}

	this.createControlButtons(mainDiv);
};

/** @description Create dataSearch control buttons **/
DataSearch.prototype.createControlButtons = function (innerDiv) {
	var temp = this;
	var buttonContainer = document.createElement("div");
	$(innerDiv).append(buttonContainer);
	buttonContainer.setAttribute("class", "NLQButtonContainer");
	$(buttonContainer).css({
		"height": this.m_height + "px",
		"line-height": this.m_height + "px"
	});

	var buttons = [{
			iClass: "bd-search inputNLPSearch",
			id: "inputNLP",
			title: "Search",
			value: "Input NLP"
		}, {
			iClass: "bd-save inputNLPSave",
			id: "saveNLQ",
			title: "Save this search query",
			value: "Save NLP"
		}, {
			iClass: "bd-list inputNLPList",
			id: "listNLQ",
			title: "List saved queries",
			value: "List NLP"
		}, {
			iClass: "bd-data-base-1 inputNLPDataStore",
			id: "dataStore",
			title: "Select a DataStore",
			value: "Get DataStore"
		}
	];
	for (var b = 0; b < buttons.length; b++) {
		var iconDiv = document.createElement("div");
		$(buttonContainer).append(iconDiv);
		iconDiv.setAttribute("class", "NLQButtonContainerIcon");

		var icon = document.createElement("span");
		$(iconDiv).append(icon);
		icon.setAttribute('id', buttons[b].id + temp.m_objectid);
		icon.setAttribute("class", "bdmenuicon icons " + buttons[b].iClass);
		//icon.title = buttons[b].title;
		icon.value = buttons[b].value;
		$(icon).css({
			"font-size": (this.m_paneliconfontsize * 1) * this.minWHRatio() + "px",
			"color": convertColorToHex(this.m_fontcolor)
		});
		if(!temp.m_designMode){
			this.initMouseAndTouchEvent("#" + buttons[b].id + temp.m_objectid, buttons[b].title);
		}
	}
	
	/** Initialization of control buttons events **/
	if (!temp.m_designMode) {
		this.initializeCtrlBtnEvent();
	}
};

/** @description For displaying tool tip PLAT-112**/
DataSearch.prototype.initMouseAndTouchEvent = function (comp,tooltiptext) {
	if (!IsBoolean(this.m_designMode)) {
		var temp = this;
		//this.checkToolTipDesc = tooltiptext;
		var mousemoveFn = function (e) {
			if (!temp.m_designMode && temp.m_tooltip != "" && temp.m_tooltip != " ") {
				e.stopPropagation();
				temp.removeToolTipDiv();
				var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
				var scrollLeft =  parentDiv.scrollLeft;
				var scrollTop =  parentDiv.scrollTop;
				var offset = $(parentDiv).offset();
				var PageTop =  offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
				var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft; 
				var offsetLeft = $(this)[0].offsetLeft;
				var offsetTop = $(this)[0].offsetTop;
				var divTop = e.pageY - PageTop - offsetTop + 5;
				var divLeft = e.pageX - PageLeft - offsetLeft + 5;
				var tooltipDiv = document.createElement("div");
				tooltipDiv.innerHTML = tooltiptext;
				tooltipDiv.setAttribute("id", "toolTipDiv");
				tooltipDiv.setAttribute("class", "settingIcon");
				tooltipDiv.setAttribute("placement", "bottom");
				$(".draggablesParentDiv").append(tooltipDiv);
				
				/*	var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
					"top": divTop + "px",
					"left": divLeft + "px"
				});
				$(tooltipDiv).css(tooltipObjCss);*/
				
				var wd = temp.m_width * 1,
				ht = temp.m_height * 1;
				var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
					"top": e.pageY - e.offsetY + ht - PageTop - offsetTop - (temp.m_height/8) + "px",
					"left": e.pageX - e.offsetX - PageLeft - offsetLeft + 10 + "px"
				});
				//"top": temp.m_top + ht  - PageTop - offsetTop - 11 + "px",
				//"left": temp.m_left  - PageLeft - offsetLeft + 10 + "px"
				$(tooltipDiv).css(tooltipObjCss);
				//var lt =  temp.m_left + (wd/2) - (tooltipDiv.offsetWidth/2) - PageLeft - offsetLeft +5+ "px";
				var buttonPadding = ($('.NLQButtonContainerIcon').width() > $(comp)[0].offsetWidth) ? $('.NLQButtonContainerIcon').width() - $(comp)[0].offsetWidth : 0;
				var lt =  e.pageX - e.offsetX - (tooltipDiv.offsetWidth/2) + ($(comp)[0].offsetWidth/2 )+ (buttonPadding/2) - PageLeft - 20 + "px";
				$(tooltipDiv).css("left",lt);
				$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
				
				/** Adjust if going out of boundary **/
				if (divTop * 1 + 10 * 1 + $(tooltipDiv).height() * 1 > temp.m_dashboard.m_AbsoluteLayout.m_height*1 + scrollTop) {
					divTop = PageTop * 1 - 10 + scrollTop * 1 - $(tooltipDiv).height() * 1;
					$(tooltipDiv).css("top", divTop);
				}
				if (divLeft * 1 + 10 * 1 + $(tooltipDiv).width() * 1 > temp.m_dashboard.m_AbsoluteLayout.m_width*1 + scrollLeft) {
					divLeft = divLeft - $(tooltipDiv).width() * 1;
					$(tooltipDiv).css("left", divLeft);   
				}
			}
		};
		var mouseoutFn = function(e){
			temp.removeToolTipDiv();
		};
		var clickFn = function(e){
			OnMouseClick(temp);
		};
		var hoverFn = function(e){
			$(this).css("cursor", temp.m_cursortype);
		};
		var touchstartFn = function(e){
			e.stopImmediatePropagation();
			if (!temp.m_designMode && temp.m_tooltip != "" && temp.m_tooltip != " ") {
				if($(".draggablesParentDiv").find("#" + "toolTipDiv").length === 0 ){
					var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
					var scrollLeft =  parentDiv.scrollLeft;
					var scrollTop =  parentDiv.scrollTop;
					var PageTop = e.originalEvent.touches[0].pageY; 
					var PageLeft = e.originalEvent.touches[0].pageX;
					var divTop = PageTop * 1 + scrollTop * 1 + 20 * 1 ;
					var divLeft = (((PageLeft * 1 + scrollLeft * 1) - 150) < 0) ? (PageLeft * 1 + scrollLeft * 1) : (PageLeft * 1 + scrollLeft * 1) - 160;
					var tooltipDiv = document.createElement("div");
					tooltipDiv.innerHTML = temp.checkToolTipDesc;
					tooltipDiv.setAttribute("id", "toolTipDiv");
					tooltipDiv.setAttribute("class", temp.m_objecttype + "ToolTipDiv");
					$(".draggablesParentDiv").append(tooltipDiv);
					var tStyles = $.extend(temp.getTooltipStyles(), {
						"top": divTop + "px",
						"left": divLeft + "px"
					});
					$(tooltipDiv).css(tStyles);
					
					/** Adjust if going out of boundary **/
					if (divTop * 1 + 20 * 1 + $(tooltipDiv).height() * 1 > temp.m_dashboard.m_AbsoluteLayout.m_height + scrollTop) {
						divTop = PageTop * 1 - 20 + scrollTop * 1 - $(tooltipDiv).height() * 1;
						$(tooltipDiv).css("top", divTop);
					}
					if (divLeft * 1 + 10 * 1 + $(tooltipDiv).width() * 1 > temp.m_dashboard.m_AbsoluteLayout.m_width + scrollLeft) {
						divLeft = PageTop * 1 - 10 + scrollLeft * 1 - $(tooltipDiv).width() * 1;
						$(tooltipDiv).css("left", divLeft);
					}
				}else{
					temp.removeToolTipDiv();
				}
			}
		};
		
		if ("ontouchstart" in document.documentElement) {
			/** captures touch event on container div **/
			$("#draggableDiv" + temp.m_objectid).bind("touchstart", function(e) {
				e.stopImmediatePropagation();
				if($("." + temp.m_objecttype + "ToolTipDiv").length){
					mouseoutFn.bind($(comp))(e);
				}else{
					touchstartFn.bind(this)(e);
				}
				clickFn.bind(this)(e);
			}).bind("touchend", function(e) {
				/** Do Nothing **/
			});
		}else{
			$(comp).click(function (e) {
				clickFn.bind(this)(e);
			})
			.hover(function (e) {
				hoverFn.bind(this)(e);
			})
			.mousemove(function (e) {
				mousemoveFn.bind(this)(e);
			})
			.mouseout(function (e) {
				mouseoutFn.bind(this)(e);
			});
		}
		
		/** captures swipe events on division **/
		$("#draggableDiv" + temp.m_objectid).on("swipeleft", function(e) {
			onSwipeLeft(temp, e);
		}).on("swiperight", function(e) {
			onSwipeRight(temp, e);
		}).on("mousewheel", function(e) {
			temp.hideToolTip();
		});

		$(".draggablesParentDiv").on("scroll", function(e) {
			temp.hideToolTip();
		});
		$("#WatermarkDiv").on("scroll", function(e) {
			temp.hideToolTip();
		});
	}
}
/** @description Create dataSearch control buttons **/
DataSearch.prototype.setNoDataStoreElementStatus = function () {
	var temp = this;
	$("#dataStorelistDiv" + temp.m_objectid).remove();
	var noDataStorelistDiv = document.createElement("div");
	$(temp.m_chartContainer).append(noDataStorelistDiv);
	noDataStorelistDiv.setAttribute("id", "dataStorelistDiv" + temp.m_objectid);
	noDataStorelistDiv.setAttribute("class", "dataStoreListDiv");
	$(noDataStorelistDiv).css({
		"padding": "10px",
		"top": (temp.m_top * 1) + (temp.m_height * 1) + "px",
		"left": temp.m_left + "px",
		"width": temp.m_width + "px",
		"border": temp.m_borderthickness + "px solid " + temp.m_bordercolor,
		"border-radius": temp.m_borderradius + "px",
		"color": convertColorToHex(temp.m_fontcolor),
		"background-color": hex2rgb(convertColorToHex(temp.m_backgroundcolor), temp.m_bgalpha)
	});
	var noDataStorelistStatus = document.createElement("div");
	noDataStorelistStatus.innerHTML = "DataStore list is empty!";
	$(noDataStorelistStatus).css({
		"text-align": "center",
		"font-size": (this.m_fontsize * 1) * this.minWHRatio() + "px",
		"font-family": selectGlobalFont(this.m_fontfamily),
		"font-weight": selectGlobalFont(this.m_fontweight),
		"font-style": selectGlobalFont(this.m_fontstyle),
		"text-decoration": this.m_textdecoration
	});
	$(noDataStorelistDiv).append(noDataStorelistStatus);
};
/** @description Create dataSearch control buttons **/
DataSearch.prototype.setDataStoreElement = function (dataStoreList) {
	var temp = this;
	var sorteddDataStore = dataStoreList.sort(function (a, b) {
		var textA = a.name.toUpperCase();
		var textB = b.name.toUpperCase();
		return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
	});
	
	$("#dataStorelistDiv" + temp.m_objectid).remove();
	var dataStorelistDiv = document.createElement("div");
	$(temp.m_chartContainer).append(dataStorelistDiv);
	dataStorelistDiv.setAttribute("id", "dataStorelistDiv" + temp.m_objectid);
	dataStorelistDiv.setAttribute("class", "dataStoreListDiv");
	$(dataStorelistDiv).css({
		"top": (temp.m_top * 1) + (temp.m_height * 1) + "px",
		"left": temp.m_left + "px",
		"width": temp.m_width + "px",
		"height": temp.m_panelheight + "px",
		"border": temp.m_borderthickness + "px solid " + temp.m_bordercolor,
		"border-radius": temp.m_borderradius + "px",
		"color": convertColorToHex(temp.m_fontcolor),
		"background-color": hex2rgb(convertColorToHex(temp.m_backgroundcolor), temp.m_bgalpha)
	});

	var searchTextContainer = document.createElement("div");
	$(dataStorelistDiv).append(searchTextContainer);
	searchTextContainer.setAttribute("class", "searchTextContainer");

	var searchText = document.createElement("input");
	$(searchTextContainer).append(searchText);
	searchText.id = "search-wrapper" + temp.m_objectid;
	searchText.type = "text";
	searchText.setAttribute("class", "dataStoreSearch");
	searchText.setAttribute("placeholder", "Search DataStore");
	$(searchText).css({
		"font-size": (this.m_fontsize * 1) * this.minWHRatio() + "px",
		"font-family": selectGlobalFont(this.m_fontfamily),
		"font-weight": selectGlobalFont(this.m_fontweight),
		"font-style": selectGlobalFont(this.m_fontstyle),
		"text-decoration": this.m_textdecoration
	});
	temp.setPlaceholderCSS("#search-wrapper" + temp.m_objectid, {
		"color": convertColorToHex(this.m_fontcolor),
		"font-weight": selectGlobalFont(this.m_fontweight),
		"font-style": selectGlobalFont(this.m_fontstyle),
		"text-decoration": this.m_textdecoration
	});

	/** Initialization of Datastore search input box event */
	if (!temp.m_designMode) {
		$(searchText).keyup(function (event) {
			event.stopPropagation();
			var criteria = $(event.target).val().toLowerCase();
			temp.searchDSinList(criteria);
		});
	}

	var ul = document.createElement("ul");
	$(dataStorelistDiv).append(ul);
	ul.setAttribute("id", "dataStoreUL" + temp.m_objectid);

	for (var i = 0; i < sorteddDataStore.length; i++) {
		var dataStoreObj = sorteddDataStore[i];
		if (dataStoreObj.name !== "") {
			this.createListContent(dataStoreObj, ul);
		}
	}
	
	$(ul).find(".dataStore-li-label").css({
		"font-size": (this.m_fontsize * 1) * this.minWHRatio() + "px",
		"font-family": selectGlobalFont(this.m_fontfamily),
		"font-weight": selectGlobalFont(this.m_fontweight),
		"font-style": selectGlobalFont(this.m_fontstyle),
		"text-decoration": this.m_textdecoration
	});
};
/** @description Create dataStore list contents label and buttons **/
DataSearch.prototype.searchDSinList = function (criteria) {
	var temp = this;
	$("#dataStorelistDiv" + temp.m_objectid).find("li").hide();
	$("#dataStorelistDiv" + temp.m_objectid).find("li").filter(function (ind) {
		return $(this).find(".dataStore-li-label").text().toLowerCase().indexOf(criteria) != -1;
	}).show();
};
/** @description Create dataStore list contents label and buttons **/
DataSearch.prototype.createListContent = function (obj, ul) {
	var temp = this;
	var li = document.createElement("li");
	li.setAttribute('id', "li" + obj.id);
	li.setAttribute('class', "dataStore-li");
	li.data = obj;
	$(ul).append(li);

	var apply = document.createElement("span");
	$(li).append(apply);
	apply.setAttribute('id', "Apply" + temp.m_objectid + obj.id);
	apply.setAttribute("class", "dataStore-li-apply bdmenuicon icons " + "bd-ok");
	apply.title = "Click to select this DataStore";
	apply.value = "Select";
	$(apply).css({
		"font-size": (this.m_fontsize * 1) * this.minWHRatio() + "px",
	});

	var label = document.createElement("span");
	$(li).append(label);
	label.setAttribute("class", "dataStore-li-label");
	label.innerHTML = obj.name;
	label.title = obj.name;

	/** Initialization of apply button event */
	if (!temp.m_designMode) {
		if (detectDevice.mobile() || detectDevice.tablet()) {
			$(li).on("taphold", function (event) {
				event.stopPropagation();
				// if-check To handle multiple event triggering for taphold
				if (this.eventHandled === undefined) {
					var cubeId = (this.data.id).toString();
					temp.moveSelectedDSOnTopOfList(cubeId, true);
					temp.m_nlqresultobject = {};
					this.eventHandled = true;
				} else {
					this.eventHandled = undefined;
				}
			});
		} else {
			li.addEventListener("click", function (event) {
				event.stopPropagation();
				var cubeId = (this.data.id).toString();
				temp.moveSelectedDSOnTopOfList(cubeId, true);
				temp.m_nlqresultobject = {};
			}, false);
		}
	}
};
DataSearch.prototype.moveSelectedDSOnTopOfList = function (cubeId, triggerCubeInfo) {
	var temp = this;
	var li = $("#dataStoreUL" + temp.m_objectid).find("#li" + cubeId);
	if (cubeId != "" && cubeId != undefined && li) {
		$(li).siblings().removeClass("dataStore-li-selected");
		$(li).addClass("dataStore-li-selected");
		$(li).parent().prepend($(li));
		$(li).parent().scrollTop(0);
		if(triggerCubeInfo){
			temp.getCubeInfo(cubeId);
		}
	}
	$("#search-wrapper" + temp.m_objectid).val("");
	/** Clear the search string after apply button click **/
	temp.searchDSinList("");
	$("#inputNLQ" + temp.m_objectid).val("");
	$("#clearInputText" + temp.m_objectid).hide();
};
DataSearch.prototype.drawDSSuggestionDiv = function (savedQueryList) {
	var temp = this;
	$("#nlq-suggestion-div" + temp.m_objectid).remove();
	var DSSuggestionContainer = document.createElement("div");
	$(temp.m_chartContainer).append(DSSuggestionContainer);
	DSSuggestionContainer.id = "nlq-suggestion-div" + temp.m_objectid;
	DSSuggestionContainer.setAttribute("class", "nlq-suggestion-div");
	$(DSSuggestionContainer).css({
		"top": (temp.m_top * 1) + (temp.m_height * 1) + "px",
		"left": temp.m_left + "px",
		"width": temp.m_width + "px",
		"height": temp.m_panelheight + "px",
		"border": temp.m_borderthickness + "px solid " + temp.m_bordercolor,
		"border-radius": temp.m_borderradius + "px",
		"color": convertColorToHex(temp.m_fontcolor),
		"background-color": hex2rgb(convertColorToHex(temp.m_backgroundcolor), temp.m_bgalpha)
	});

	var nlqBtnContainer = document.createElement("div");
	$(DSSuggestionContainer).append(nlqBtnContainer);
	nlqBtnContainer.id = "nlq-suggestion-btnContainer" + temp.m_objectid;
	nlqBtnContainer.setAttribute("class", "nlq-suggestion-btnContainer");

	var querySuggestionBtn = temp.createDSSuggestionCtrlBtn("savedQueryBtn", "Search suggestions");
	$(nlqBtnContainer).append(querySuggestionBtn);
	var fieldSuggestionBtn = temp.createDSSuggestionCtrlBtn("savedDSInfoBtn", "Data Store Information");
	$(nlqBtnContainer).append(fieldSuggestionBtn);

	var nlpQuerySuggDiv = temp.createNLQQuerySuggestionDiv(savedQueryList);
	$(DSSuggestionContainer).append(nlpQuerySuggDiv);
	var nlqFieldSuggDiv = temp.createNLQFieldSuggestionDiv();
	$(DSSuggestionContainer).append(nlqFieldSuggDiv);

	/**Click and TouchHold events */
	if (detectDevice.mobile() || detectDevice.tablet()) {
		$(DSSuggestionContainer).find(".ds-info-list").bind("taphold", function (event) {
			event.stopPropagation();
			if (this.eventHandled === undefined) { // To handle multiple event triggering
				if ($(this).parent()[0].id == ("nlq-field-suggestion-innerDiv" + temp.m_objectid)) {
					temp.appendTextInDSInputBox(this);
				} else if ($(this).parent()[0].id == ("nlq-query-suggestion-div" + temp.m_objectid)) {
					var inputBox = $("#inputNLQ" + temp.m_objectid);
					var queryText = $(this).find("span").text();
					inputBox.val("");
					inputBox.val(queryText);
					inputBox.focus();
					inputBox.css("width", "calc(100% - 25px)");
					$("#clearInputText" + temp.m_objectid).show();
					var e = new Event('touchstart');
					e.touches = [];
					document.getElementById("inputNLP" + temp.m_objectid).dispatchEvent(e);
				} else {
					// Do nothing
				}
				this.eventHandled = true;
			} else {
				this.eventHandled = undefined;
			}
		});
	} else {
		$(DSSuggestionContainer).find(".ds-info-list").bind("click", function (event) {
			event.stopPropagation();
			if ($(this).parent()[0].id == ("nlq-field-suggestion-innerDiv" + temp.m_objectid)) {
				temp.appendTextInDSInputBox(this);
			} else if ($(this).parent()[0].id == ("nlq-query-suggestion-div" + temp.m_objectid)) {
				var inputBox = $("#inputNLQ" + temp.m_objectid);
				var queryText = $(this).find("span").text();
				inputBox.val("");
				inputBox.val(queryText);
				inputBox.focus();
				inputBox.css("width", "calc(100% - 25px)");
				$("#clearInputText" + temp.m_objectid).show();
				document.getElementById("inputNLP" + temp.m_objectid).click();
			} else {
				// Do nothing
			}
		});
	}
};
/** @description This method will append suggestion text with DS input box text on click  **/
DataSearch.prototype.appendTextInDSInputBox = function (currentElement) {
	var temp = this;
	var queryText = $(currentElement).find("span").text();
	var inputBox = $("#inputNLQ" + temp.m_objectid);
	var completeTxt = "";
	var existingTxt;
	if (temp.inputCursorPos && temp.inputCursorPos > 0) {
		existingTxt = inputBox.val();
		completeTxt = existingTxt.slice(0, temp.inputCursorPos) + queryText + existingTxt.slice(temp.inputCursorPos);
		inputBox.val(completeTxt);
	} else {
		existingTxt = inputBox.val();
		completeTxt = (existingTxt != "") ? existingTxt + " " + queryText : queryText;
		inputBox.val(completeTxt);
	}
	if (completeTxt != "") {
		inputBox.css("width", "calc(100% - 25px)");
		$("#clearInputText" + temp.m_objectid).show();
		inputBox.focus();
	}
};
/** @description This method will append suggestion text with DS input box text on click  **/
DataSearch.prototype.appendTextInDSInputBox = function (currentElement) {
	var temp = this;
	var queryText = $(currentElement).find("span").text();
	var inputBox = $("#inputNLQ" + temp.m_objectid);
	var existingTxt,
	completeTxt;
	if (temp.inputCursorPos && temp.inputCursorPos > 0) {
		existingTxt = inputBox.val();
		completeTxt = existingTxt.slice(0, temp.inputCursorPos) + queryText + existingTxt.slice(temp.inputCursorPos);
	} else {
		existingTxt = inputBox.val();
		completeTxt = (existingTxt != "") ? existingTxt + " " + queryText : queryText;
	}
	inputBox.val(completeTxt);
};

DataSearch.prototype.createNLQQuerySuggestionDiv = function (savedQueryList) {
	var temp = this;
	var querySuggDiv = document.createElement("div");
	querySuggDiv.id = "nlq-query-suggestion-div" + temp.m_objectid;
	querySuggDiv.setAttribute("class", "nlq-suggestion-wrapper nlq-query-suggestion");
	temp.createDSSuggestionContent(savedQueryList, querySuggDiv, "ds-savedquery-list", "bd-search");

	return querySuggDiv;
};

DataSearch.prototype.createNLQFieldSuggestionDiv = function () {
	var temp = this;
	var fieldSuggDiv = document.createElement("div");
	fieldSuggDiv.id = "nlq-field-suggestion-div" + temp.m_objectid;
	fieldSuggDiv.setAttribute("class", "nlq-suggestion-wrapper nlq-field-suggestion");

	var fieldFactsDiv = document.createElement("div");
	$(fieldSuggDiv).append(fieldFactsDiv);
	fieldFactsDiv.id = "nlq-field-suggestion-innerDiv" + temp.m_objectid;
	fieldFactsDiv.setAttribute("class", "nlq-field-suggestion-facts");

	var facts = temp.m_selecteddstore.defenition.fieldDef.facts;
	temp.createDSSuggestionContent(facts, fieldFactsDiv, "ds-facts-list", "bd-dimension-1");

	var fieldMeasuresDiv = document.createElement("div");
	$(fieldSuggDiv).append(fieldMeasuresDiv);
	fieldMeasuresDiv.id = "nlq-field-suggestion-innerDiv" + temp.m_objectid;
	fieldMeasuresDiv.setAttribute("class", "nlq-field-suggestion-measures");

	var measures = temp.m_selecteddstore.defenition.fieldDef.measures;
	temp.createDSSuggestionContent(measures, fieldMeasuresDiv, "ds-measures-list", "bd-number-1");

	$(fieldSuggDiv).hide();
	return fieldSuggDiv;
};

DataSearch.prototype.createDSSuggestionContent = function (list, parentElement, dClass, iconClass) {
	var temp = this;
	var savedNLQArray = list;
	//	var savedNLQArray = list.sort();
	if (savedNLQArray.length > 0) {
		for (var i = 0; i < savedNLQArray.length; i++) {
			var query = document.createElement("p");
			query.setAttribute("class", "ds-info-list " + dClass);
			$(parentElement).append(query);

			var icon = document.createElement("i");
			$(query).append(icon);
			icon.setAttribute("class", iconClass);
			$(icon).css({
				"font-size": (temp.m_fontsize * 1) * temp.minWHRatio() + "px"
			});

			var span = document.createElement("span");
			$(query).append(span);
			span.title = savedNLQArray[i];
			span.innerHTML = savedNLQArray[i];
			$(span).css({
				"font-size": (temp.m_fontsize * 1) * temp.minWHRatio() + "px",
				"font-family": selectGlobalFont(temp.m_fontfamily),
				"font-weight": selectGlobalFont(this.m_fontweight),
				"font-style": selectGlobalFont(this.m_fontstyle),
				"text-decoration": this.m_textdecoration
			});
		}
	}
};

DataSearch.prototype.createDSSuggestionCtrlBtn = function (id, text) {
	var temp = this;
	var btn = document.createElement("input");
	btn.type = "button";
	btn.id = id + temp.m_objectid;
	btn.setAttribute("class", id);
	btn.value = text;
	btn.title = text;
	$(btn).css({
		"font-size": (temp.m_fontsize * 1) * temp.minWHRatio() + "px",
		"font-family": selectGlobalFont(temp.m_fontfamily),
		"font-weight": selectGlobalFont(this.m_fontweight),
		"font-style": selectGlobalFont(this.m_fontstyle),
		"text-decoration": this.m_textdecoration
	})
	/**Click and Touch events */
	if (detectDevice.mobile() || detectDevice.tablet()) {
		btn.addEventListener("touchstart", function (event) {
			event.stopPropagation();
			$(this).siblings().removeClass("filterSaver-selectedBtn");
			if (this.id == "savedQueryBtn" + temp.m_objectid) {
				$("#nlq-query-suggestion-div" + temp.m_objectid).show();
				$("#nlq-field-suggestion-div" + temp.m_objectid).hide();
			} else if (this.id == "savedDSInfoBtn" + temp.m_objectid) {
				$("#nlq-field-suggestion-div" + temp.m_objectid).show();
				$("#nlq-query-suggestion-div" + temp.m_objectid).hide();
			} else {
				// Do nothing
			}
			$(this).addClass("filterSaver-selectedBtn");
		}, false);
	} else {
		btn.addEventListener("click", function (event) {
			event.stopPropagation();
			$(this).siblings().removeClass("filterSaver-selectedBtn");
			if (this.id == "savedQueryBtn" + temp.m_objectid) {
				$("#nlq-query-suggestion-div" + temp.m_objectid).show();
				$("#nlq-field-suggestion-div" + temp.m_objectid).hide();
			} else if (this.id == "savedDSInfoBtn" + temp.m_objectid) {
				$("#nlq-field-suggestion-div" + temp.m_objectid).show();
				$("#nlq-query-suggestion-div" + temp.m_objectid).hide();
			} else {
				// Do nothing
			}
			$(this).addClass("filterSaver-selectedBtn");
		}, false);
	}

	if ((id + temp.m_objectid) == ("savedQueryBtn" + temp.m_objectid)) {
		$(btn).addClass("filterSaver-selectedBtn");
	}
	return btn;
};
/**@description Initialization of control buttons events */
DataSearch.prototype.initializeCtrlBtnEvent = function () {
	var temp = this;
	var inputNLP = $("#inputNLP" + temp.m_objectid)[0];
	var saveNLQ = $("#saveNLQ" + temp.m_objectid)[0];
	var listNLQ = $("#listNLQ" + temp.m_objectid)[0];
	var dataStore = $("#dataStore" + temp.m_objectid)[0];

	/** Event to apply NLP */
	if (detectDevice.mobile() || detectDevice.tablet()) {
		inputNLP.addEventListener("touchstart", function (event) {
			temp.m_searchquery = $("#inputNLQ" + temp.m_objectid).val();
			$("#nlq-suggestion-div" + temp.m_objectid).hide();
			temp.getNLP(temp.m_selecteddsid);
		}, false);
	} else {
		inputNLP.addEventListener("click", function (event) {
			temp.m_searchquery = $("#inputNLQ" + temp.m_objectid).val();
			$("#nlq-suggestion-div" + temp.m_objectid).hide();
			temp.getNLP(temp.m_selecteddsid);
		}, false);
	}
	/** Event to save NLQ  */
	if (detectDevice.mobile() || detectDevice.tablet()) {
		saveNLQ.addEventListener("touchstart", function (event) {
			temp.saveNLPQuery();
		}, false);
	} else {
		saveNLQ.addEventListener("click", function (event) {
			temp.saveNLPQuery();
		}, false);
	}
	/** Event to get list of saved NLQ */
	if (detectDevice.mobile() || detectDevice.tablet()) {
		listNLQ.addEventListener("touchstart", function (event) {
			event.stopPropagation();
			$("#dataStorelistDiv" + temp.m_objectid).hide();
			if ($("#nlq-suggestion-div" + temp.m_objectid) && temp.m_selecteddsid !== "") {
				$("#nlq-suggestion-div" + temp.m_objectid).toggle();
			} else {
				alertPopUpModal({
					type: 'error',
					message: 'DataStore is not selected',
					timeout: '3000'
				});
			}
		}, false);
	} else {
		listNLQ.addEventListener("click", function (event) {
			event.stopPropagation();
			$("#dataStorelistDiv" + temp.m_objectid).hide();
			if ($("#nlq-suggestion-div" + temp.m_objectid) && temp.m_selecteddsid !== "") {
				$("#nlq-suggestion-div" + temp.m_objectid).toggle();
			} else {
				alertPopUpModal({
					type: 'error',
					message: 'DataStore is not selected',
					timeout: '3000'
				});
			}
		}, false);
		/** To forcefully load the saved queries **/
		listNLQ.addEventListener("dblclick", function (event) {
			event.stopPropagation();
			if (temp.m_selecteddsid !== "" && temp.m_selecteddsid !== undefined) {
				temp.getNLPQuery(temp.m_selecteddsid);
			}
		}, false);
	}
	/** Event to get data store cube */
	if (detectDevice.mobile() || detectDevice.tablet()) {
		dataStore.addEventListener("touchstart", function (event) {
			event.stopPropagation();
			$("#nlq-suggestion-div" + temp.m_objectid).hide();
			$("#search-wrapper" + temp.m_objectid).focus();
			if (!IsBoolean(temp.isDataStoreLoaded)) {
				temp.getDatastoreDetails();
			} else {
				$("#dataStorelistDiv" + temp.m_objectid).toggle();
			}
		}, false);
	} else {
		dataStore.addEventListener("click", function (event) {
			event.stopPropagation();
			$("#nlq-suggestion-div" + temp.m_objectid).hide();
			if (!IsBoolean(temp.isDataStoreLoaded)) {
				temp.getDatastoreDetails();
			} else {
				$("#dataStorelistDiv" + temp.m_objectid).toggle();
			}
		}, false);
		/** To forcefully load the dataStores **/
		dataStore.addEventListener("dblclick", function (event) {
			event.stopPropagation();
			$("#nlq-suggestion-div" + temp.m_objectid).hide();
			temp.getDatastoreDetails();
		}, false);
	}
	/** Event to hide active drop down list */
	$(temp.m_chartContainer).click(
		function (e) {
		var panel = $("#draggableDiv" + temp.m_objectid);
		var panel_2 = $("#nlq-suggestion-div" + temp.m_objectid);
		var panel_3 = $("#dataStorelistDiv" + temp.m_objectid);

		if (e.target.id != panel.attr('id') && !panel.has(e.target).length && e.target.id != panel_2.attr('id') && !panel_2.has(e.target).length
			 && e.target.id != panel_3.attr('id') && !panel_3.has(e.target).length) {
			if ((panel_2 && panel_2.is(":visible")) || (panel_3 && panel_3.is(":visible"))) {
				$("#nlq-suggestion-div" + temp.m_objectid).hide();
				$("#dataStorelistDiv" + temp.m_objectid).hide();
			}
		}
	});
};

/** @description method will call autoCompleteText webservice **/
DataSearch.prototype.autoCompleteText = function (reqData) {
	var
	REQ_URL = req_url.designer.pluginService,
	REQ_DATA = {
		"criteriaIds": JSON.stringify(reqData)
	},
	requestSuccessFn = function (respData, success) {
//		respData = getDecryptedResponse(respData);
//		console.log(respData);
	},
	requestFailedFn = function (data, success) {};
	showLoader();
	this.webServiceCall(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
};

/** @description method will call getNLP webservice **/
DataSearch.prototype.getNLP = function (dsId) {
	var temp = this;
	var
	REQ_URL = req_url.designer.pluginService,
	REQ_DATA = {
		"consumerName": "CUBEPROCESSSERVICE",
		"serviceName": "getNLP",
		"data": JSON.stringify({
			"cubeId": dsId,
			"userText": temp.m_searchquery
		}),
		"isSecure": "true"

	},
	requestSuccessFn = function (respData, success) {
		respData = getDecryptedResponse(respData);
		temp.m_nlqresultobject = respData || {};
		if (IsBoolean(success)) {
			if (respData && respData.data) {
				try{
					temp.m_nlqresultobject.data = JSON.parse(respData.data);
				}catch(e){
					console.log(e);
				}
			} else {
				alertPopUpModal({
					type: 'error',
					message: 'Invalid search result',
					timeout: '3000'
				});
				temp.m_nlqresultobject.sentence = temp.m_searchquery;
				temp.m_nlqresultobject.data = [];
			}
			/** Re-Draw the associated Chart **/
			try{
				temp.drawAssociatedChart();
			}catch(e){
				console.log(e);
			}
		} else {
			alertPopUpModal({
				type: 'error',
				message: 'Failed to get search result',
				timeout: '3000'
			});
		}
	},
	requestFailedFn = function (data, success) {
		alertPopUpModal({
			type: 'error',
			message: 'Failed to get search result',
			timeout: '3000'
		});
	};

	if (dsId !== "") {
		if (this.m_searchquery !== "") {
			showLoader();
			this.webServiceCall(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
		} else {
			alertPopUpModal({
				type: 'warning',
				message: 'Please write a query',
				timeout: '3000'
			});
		}
	} else {
		alertPopUpModal({
			type: 'error',
			message: 'DataStore is not selected',
			timeout: '3000'
		});
	}
};
/** @description draw the chart with reponse data **/
DataSearch.prototype.drawAssociatedChart = function () {
	this.m_associatedchart.chart = this.getChartObjectById(this.m_associateddschartid);
	if (this.m_associatedchart.chart) {
		this.m_associatedchart.ds = this.getDatasetObjectById(this.m_associateddschartid);
		if (this.m_associatedchart.ds) {
			this.m_associatedchart.fields = [];
			if(this.m_nlqresultobject.metadata && (this.m_nlqresultobject.metadata.category || this.m_nlqresultobject.metadata.series)){
				for (var i = 0; i < this.m_nlqresultobject.metadata.category.length; i++) {
					this.m_associatedchart.fields.push(this.m_associatedchart.ds.getFieldJsonforOneField("Category", this.m_seriescolor[i], this.m_nlqresultobject.metadata.category[i].dimension));
				}
				var svMap = {};
				for (var j = 0; j < this.m_nlqresultobject.metadata.series.length; j++) {
					var serName = this.m_nlqresultobject.metadata.series[j].op + "_" + this.m_nlqresultobject.metadata.series[j].measure;
					svMap[serName] = 0;
					this.m_associatedchart.fields.push(this.m_associatedchart.ds.getFieldJsonforOneField("Series", this.m_seriescolor[j], serName));
				}
			}
			this.m_associatedchart.data = this.m_nlqresultobject.data;

			/** Trigger the onchange event to update the configuration of chart if required **/
			try{
				this.handleOnChangeEvent();
			}catch(e){
				console.log(e);
			}

			/** update Fields and dataProviders so the chart sort can work **/
			this.m_associatedchart.ds.dataSetFieldsJSONParsing(this.m_associatedchart.fields);
			this.m_associatedchart.ds.setDataView(this.m_associatedchart.data);
			this.m_associatedchart.ds.setDataStore(this.m_associatedchart.data);

			this.m_associatedchart.chart.m_title.m_description = this.m_nlqresultobject.sentence;
			this.m_associatedchart.chart.setDataProvider(this.m_associatedchart.data);
			this.m_associatedchart.chart.setFields(this.m_associatedchart.fields);
			this.m_associatedchart.chart.draw();
		} else {
			alertPopUpModal({
				type: 'warning',
				message: this.m_associatedchart.chart.m_referenceid + " does not have dataset",
				timeout: '3000'
			});
			/** Trigger the onchange event to update the configuration of chart if required **/
			try{
				this.handleOnChangeEvent();
			}catch(e){
				console.log(e);
			}
		}
	} else {
		alertPopUpModal({
			type: 'warning',
			message: 'No chart is associated for result',
			timeout: '3000'
		});
		/** Trigger the onchange event to update the configuration of chart if required **/
		try{
			this.handleOnChangeEvent();
		}catch(e){
			console.log(e);
		}
	}
};
/** @description method will call saveNLPQuery webservice **/
DataSearch.prototype.saveNLPQuery = function () {
	var temp = this;
	var
	REQ_URL = req_url.designer.pluginService,
	REQ_DATA = {
		"consumerName": "CUBEPROCESSSERVICE",
		"serviceName": "saveNLPQuery",
		"data": JSON.stringify({
			"sentence": temp.m_nlqresultobject.sentence,
			"cubeId": temp.m_selecteddsid,
			"userText": temp.m_searchquery
		}),
		"isSecure": "true"
	},
	requestSuccessFn = function (respData, success) {
		respData = getDecryptedResponse(respData);
		if (IsBoolean(success)) {
			if (temp.m_selecteddsid !== "" && temp.m_selecteddsid !== undefined) {
				temp.getNLPQuery(temp.m_selecteddsid);
			}
			alertPopUpModal({
				type: 'success',
				message: 'Query has been saved',
				timeout: '3000'
			});
		}
	},
	requestFailedFn = function (data, success) {
		alertPopUpModal({
			type: 'error',
			message: 'Failed to save the query',
			timeout: '3000'
		});
	};
	
	if (temp.m_nlqresultobject && temp.m_nlqresultobject.sentence && temp.m_nlqresultobject.sentence !== "") {
		if (temp.m_selecteddsid !== "") {
			if (temp.m_searchquery !== "") {
				showLoader();
				this.webServiceCall(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
			} else {
				alertPopUpModal({
					type: 'warning',
					message: 'Please write a query',
					timeout: '3000'
				});
			}
		} else {
			alertPopUpModal({
				type: 'error',
				message: 'DataStore is not selected',
				timeout: '3000'
			});
		}
	} else {
		alertPopUpModal({
			type: 'warning',
			message: 'Please write a query',
			timeout: '3000'
		});
	}
};

/** @description method will call getNLPQuery webservice **/
DataSearch.prototype.getNLPQuery = function (cid) {
	var temp = this;
	var
	REQ_URL = req_url.designer.pluginService,
	REQ_DATA = {
		"consumerName": "CUBEPROCESSSERVICE",
		"serviceName": "getNLPQuery",
		"data": JSON.stringify({
			"cubeId": cid,
		}),
		"isSecure": "true"
	},
	requestSuccessFn = function (respData, success) {
		var savedQueryList = [];
		respData = getDecryptedResponse(respData);
		if (IsBoolean(success) && respData && respData.data) {
			savedQueryList = respData.data;
			if(respData.data.length> 0){
				alertPopUpModal({
					type: 'success',
					message: 'Saved queries has been loaded',
					timeout: '3000'
				});			
			}else{
				alertPopUpModal({
					type: 'info',
					message: 'There are no saved queries for this DataStore',
					timeout: '3000'
				});
			}
		}else{
			alertPopUpModal({
				type: 'info',
				message: 'There are no saved queries for this DataStore',
				timeout: '3000'
			});
		}
		temp.drawDSSuggestionDiv(savedQueryList);
	},
	requestFailedFn = function (data, success) {
		alertPopUpModal({
			type: 'error',
			message: 'Failed to load the saved queries',
			timeout: '3000'
		});
	};
	showLoader();
	this.webServiceCall(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
};

/** @description method will call getDatastoreDetails webservice **/
DataSearch.prototype.getDatastoreDetails = function () {
	var temp = this;
	var
	REQ_URL = req_url.designer.pluginService,
	REQ_DATA = {
		"consumerName": "CUBEPROCESSSERVICE",
		"serviceName": "getDatastoreDetails",
		"data": JSON.stringify({
			"id": "0",
			"datasourcetype": "all"
		}),
		"isSecure": "true"
	},
	requestSuccessFn = function (respData, success) {
		respData = getDecryptedResponse(respData);
		if (IsBoolean(success)){
			if(respData && respData.bizvizCubes) {
				temp.isDataStoreLoaded = true;
				if(respData.bizvizCubes.length > 0){
					temp.setDataStoreElement(respData.bizvizCubes);
					if (temp.m_selecteddsid !== "" && temp.m_selecteddsid !== undefined) {
						temp.moveSelectedDSOnTopOfList(temp.m_selecteddsid, false);
					}
					alertPopUpModal({
						type: "success",
						message: "DataStores has been loaded",
						timeout: '3000'
					});
				}else{
					temp.setNoDataStoreElementStatus();
					alertPopUpModal({
						type: "warning",
						message: "DataStore list is empty!",
						timeout: '3000'
					});
				}
			}else{
				alertPopUpModal({
					type: "error",
					message: "DataStores list is Empty",
					timeout: '3000'
				});
			}
		} else {
			alertPopUpModal({
				type: "error",
				message: "Failed to load DataStores",
				timeout: '3000'
			});
		}
	},
	requestFailedFn = function (data, success) {
		alertPopUpModal({
			type: "error",
			message: "Failed to load DataStores",
			timeout: '3000'
		});
	};
	showLoader();
	this.webServiceCall(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
};

/** @description method will call getCubeInfo webservice **/
DataSearch.prototype.getCubeInfo = function (cubeId) {
	var temp = this;
	var
	REQ_URL = req_url.designer.pluginService,
	REQ_DATA = {
		"consumerName": "CUBEPROCESSSERVICE",
		"serviceName": "getCubeInfo",
		"data": JSON.stringify({
			"id": cubeId,
		}),
		"isSecure": "true"
	},
	requestSuccessFn = function (respData, success) {
		respData = getDecryptedResponse(respData);
		if (respData && respData.success && respData.bizvizCube != undefined && respData.bizvizCube.defenition != undefined) {
			temp.m_selecteddsid = (respData.bizvizCube.id).toString();
			temp.m_selecteddstore = respData.bizvizCube;
			var defenition = JSON.parse(respData.bizvizCube.defenition);
	    //  var cubeOptions = JSON.parse(respData.bizvizCube.cubeOptions);
			temp.m_selecteddstore.defenition = defenition;
		//	temp.m_selecteddstore.cubeOptions = cubeOptions;

			$("#dataStorelistDiv" + temp.m_objectid).hide();
			if (temp.m_selecteddsid !== "" && temp.m_selecteddsid !== undefined) {
				temp.getNLPQuery(temp.m_selecteddsid);
			}
			alertPopUpModal({
				type: "success",
				message: "DataStore is selected",
				timeout: '3000'
			});
		}
	},
	requestFailedFn = function (data, success) {
		alertPopUpModal({
			type: "error",
			message: "DataStore selection failed",
			timeout: '3000'
		});
	};
	showLoader();
	this.webServiceCall(REQ_URL, REQ_DATA, requestSuccessFn, requestFailedFn);
};

/** @description will handle the operation with onchange Event. **/
DataSearch.prototype.handleOnChangeEvent = function () {
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
};
//# sourceURL=DataSearch.js