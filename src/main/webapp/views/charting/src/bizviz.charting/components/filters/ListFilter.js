/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: ListFilter.js
 * @description List filter
 **/
function ListFilter(m_chartContainer, m_zIndex) {
    this.base = Filter;
    this.base();
    this.m_fieldNameValueMap = new Object();
    this.m_dropDownDivHeight = 100;
    this.m_objectID = [];
    this.m_componentid = "";
    this.m_chromecoloropacity = "1";
    this.m_selectedindex = "0";
    this.m_backgroundcolor = "#cccccc";
    this.m_bgalpha = "1";
    this.m_listbordercolor = "";
    this.m_enableborder = "false";
    this.m_chromecolorUpdate = "";
    this.m_size = "";
    this.additionalFields;
    this.value = [];
    this.displayField = [];
    this.m_values = [];
    this.m_chartContainer = m_chartContainer;
    this.m_zIndex = m_zIndex;
    this.m_isDataSetavailable = false;    
    this.m_enhanceCheckbox = false;  
    this.m_showsearch = true;
    this.m_allowmultipleselection = false;
    this.m_actionbarenabled = true;
    this.m_listheight = 25;
    this.m_hexBackgroundColor = "";
    this.m_hexChromeColor = "";
    this.m_updateFilterList = [];
	this.currentSelectedListItem = "";
    this.m_checkboxstatus = {};
    this.preSelectedValue = {
        cat: "",
        ser: ""
    };
    this.m_isMultiselectPanelVisible = false;
    this.m_menupanelfontcolor = "#333333";
    this.m_menupanelfontsize = "12";
    this.m_selectionfontcolor = "#000000";
	this.m_cursortype = "pointer";
	this.m_selectedindexarray = [];
	this.m_actionbarheight = 25;
	/**Added to accesses list row and search box height through script*/
	this.m_menupanelrowheight = 32;
	this.m_listelementproperty = {
		    "boxShadow": "1px 1px #efefef",
		    "borderRadius": "5",
		    "borderWidth": "1",
		    "borderStyle": "solid",
		    "margin": "3px 5px 3px 3px"
		};
};
/** @description Making prototype of Filter class to inherit its properties and methods into List filter **/
ListFilter.prototype = new Filter;

/** @description This method will parse the chart JSON and create a container **/
ListFilter.prototype.setProperty = function(chartJson) {
    this.ParseJsonAttributes(chartJson.Object, this);
    this.initCanvas();
};

/** @description Setter Method of DataProvider **/
ListFilter.prototype.setDataProvider = function (m_dataProvider) {
	this.m_dataProvider = m_dataProvider;
};

/** @description Getter Method of DataProvider **/
ListFilter.prototype.getDataProvider = function() {
    return this.m_dataProvider;
};
/** @description Iterate through chart JSON and set class variable values with JSON values **/
ListFilter.prototype.ParseJsonAttributes = function(jsonObject, nodeObject) {
	this.chartJson = jsonObject;
    this.m_values = [];
    for (var key in jsonObject) {
        if (key == "Filter") {
            for (var filterkey in jsonObject[key]) {
                switch (filterkey) {
                    case "DataSet":
                        this.m_isDataSetavailable = true;
                        break;
                    case "Values":
                        for (var i = 0; i < jsonObject[key][filterkey].length; i++) {
                            var values = new Values();
                            values.setLabel(this.getProperAttributeNameValue(jsonObject[key][filterkey][i], "label"));
                            values.setValue(this.getProperAttributeNameValue(jsonObject[key][filterkey][i], "value"));
                            values.setUncheckedValue(this.getProperAttributeNameValue(jsonObject[key][filterkey][i], "unCheckedValue"));
                            this.m_values.push(values);
                        }
                        break;
                    case "Title":
    					for (var titleKey in jsonObject[key][filterkey]) {
    						var propertyName = this.getNodeAttributeName(titleKey);
    						nodeObject.m_title[propertyName] = jsonObject[key][filterkey][titleKey];
    					}
    					break;
                    default:
                        var propertyName = this.getNodeAttributeName(filterkey);
                        nodeObject[propertyName] = jsonObject[key][filterkey];
                        break;
                }
            }
        } else {
            var propertyName = this.getNodeAttributeName(key);
            nodeObject[propertyName] = jsonObject[key];
        }
    }
};

/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
ListFilter.prototype.initCanvas = function() {
    var temp = this;
    $("#draggableDiv" + temp.m_objectid).remove();
    this.initializeDraggableDivAndCanvas(this.m_chartContainer, this.m_zIndex);
};

/** @description Setter Method of Fields **/
ListFilter.prototype.setFields = function(fieldsJson) {
    this.m_fieldsJson = fieldsJson;
    var m_categoryName = "";
    var m_seriesName = "";
    var m_additionalFields = "";
    if (fieldsJson.length == 1) {
        // from flex
        for (var i = 0; i < fieldsJson.length; i++) {
            m_categoryName = this.getProperAttributeNameValue(fieldsJson[i], "DisplayField");
            m_seriesName = this.getProperAttributeNameValue(fieldsJson[i], "Value");
            m_additionalFields = this.getProperAttributeNameValue(fieldsJson[i], "additionalFields");
        }
    } else {
        // from designer
        for (var i1 = 0; i1 < fieldsJson.length; i1++) {
            switch (fieldsJson[i1].Type) {
                case "Value":
                    m_seriesName = fieldsJson[i1].Name;
                    break;
                case "DisplayField":
                    m_categoryName = fieldsJson[i1].Name;
                    break;
                case "additionalFields":
                    m_additionalFields = fieldsJson[i1].Name;
                    break;
                default:
                	break;
            }
        }
    }
    this.setCategoryNames(m_categoryName);
    this.setSeriesNames(m_seriesName, m_additionalFields);
};

/** @description Setter Method of CategoryNames **/
ListFilter.prototype.setCategoryNames = function(category) {
    this.m_categoryName = [];
    if (category != "" && category != undefined)
        this.m_categoryName[0] = category;
};

/** @description Setter Method of SeriesNames **/
ListFilter.prototype.setSeriesNames = function(series, additionalFieldsName) {
    this.m_seriesName = [];
    if (series != "" && series != undefined)
        this.m_seriesName.push(series);
    if (additionalFieldsName != "" && additionalFieldsName != undefined) {
        var additionalFields = additionalFieldsName.split(",");
        for (var j = 0; j < additionalFields.length; j++) {
            if (this.m_seriesName[0] != additionalFields[j]) {
                if (this.getCategoryNames().length > 0 && this.getCategoryNames()[0] != additionalFields[j])
                    this.m_seriesName.push(additionalFields[j]);
            }
        }
    }
};

/** @description Getter Method of CategoryNames **/
ListFilter.prototype.getCategoryNames = function() {
    return this.m_categoryName;
};
/** @description Getter Method of SeriesNames **/
ListFilter.prototype.getSeriesNames = function() {
    return this.m_seriesName;
};

/** @description  Will create an id for component to be used for dashboard operation management**/
ListFilter.prototype.setDashboardNameAndObjectId = function() {
    this.m_objectId = this.m_objectid;
    if (this.m_objectid.split(".").length == 2)
        this.m_objectid = this.m_objectid.split(".")[1];
    this.m_componentid = "listBoxdiv" + this.m_objectid;
};

/** @description will call init() and draw () of ListFilter **/
ListFilter.prototype.drawObject = function() {
    if (this.m_isDataSetavailable || IsBoolean(this.m_designMode)) {
        if (this.getDataProvider().length > 0) {
            this.removeMessage();
            this.init();
            this.drawChart();
        } else {
            this.drawMessage(this.m_status.noData);
        }
    } else {
        this.drawMessage(this.m_status.noDataset);
    }
};

/** @description will call draw() method of FilterChips **/
ListFilter.prototype.updateFilterChipsComponent = function() {
	var temp = this;
	if (!IsBoolean(this.m_designMode)) {
		var filterChipsObj = this.getFilterChipsComponentObj();
		if (filterChipsObj != undefined){
			/*for (var i = 0; i < this.staticOptsValue.length; i++) {			
				var value = this.staticOptsValue[i];
				var text = this.displayField[i];					
				if (this.getSelectedIndex(i)) {
					save value to filterchips array
					filterChipsObj.m_savedfilterschips.push({"key":text});
				}
				//filterChipsObj[]
			}*/
			filterChipsObj.m_filterDisplayValues[temp.m_objectid] = temp.getValue().split(',');
		}
	}
};

/** @description Initialization of ListFilter **/
ListFilter.prototype.init = function() {
    if (!IsBoolean(this.m_isDataSetavailable) && !IsBoolean(this.m_designMode)) {
        this.setData();
    } else {
        this.setCategoryData(this.getCategoryforDataSet());
        this.setSeriesData(this.getSeriesforDataSet());
    }

    if (IsBoolean(this.m_isDataSetavailable)) {
        if (this.getSeriesNames().length != 0 && this.getCategoryNames().length != 0) {
            this.setUniqueData();
        }
    } else {
        this.value = this.m_seriesData;
        this.displayField = this.m_categoryData;
    }
};

/** @description Getter method of categoryData for DataSet. **/
ListFilter.prototype.getCategoryforDataSet = function() {
    this.m_categoryData = [];
    for (var i = 0; i < this.getCategoryNames().length; i++) {
        this.m_categoryData[i] = this.getDataFromJSON(this.getCategoryNames()[i]);
    }
    this.m_categoryData = convertArrayType(this.m_categoryData);
    return this.m_categoryData;
};

/** @description Getter method of seriesData for DataSet. **/
ListFilter.prototype.getSeriesforDataSet = function() {
    this.m_seriesData = [];
    for (var i = 0; i < this.getSeriesNames().length; i++) {
        this.m_seriesData[i] = this.getDataFromJSON(this.getSeriesNames()[i]);
    }
    this.m_seriesData = convertArrayType(this.m_seriesData);
    return this.m_seriesData;
};

/** @description Drawing of component started by drawing different parts of component like container,options. **/
ListFilter.prototype.drawChart = function() {
	this.m_checkboxstatus = {};
    this.setColor();
    var containerDiv = this.drawContainerDiv();
    if(IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)){
    	var titleDiv = this.titleContainerDiv();
    	 /**DAS-669 */
    	$(titleDiv).css({"padding": "0px 16px"});
        $(containerDiv).append(titleDiv);
    }
    
    var innerDiv = this.innerContainerDiv();
    /**Added to show Search Box on the Top*/
    if(!IsBoolean(this.m_enabledualselectionlist)&&IsBoolean(this.m_allowmultipleselection)){
    	var SearchBoxDiv = document.createElement("div");
    	SearchBoxDiv.setAttribute("id", "SearchBoxDiv"+ this.m_componentid);
    	$(SearchBoxDiv).css({"display": "block","height": 1*this.m_menupanelrowheight + 2*this.m_searchboxuiobj.margin + "px","width":"100%","background-color" : this.m_hexChromeColor, "padding-right":"2px"});
    	var SearchBox = this.createSearchBox();
    	/*DAS-303*/
    	if(this.m_showsearch && this.value.length > 0)
    		{
    	$(SearchBoxDiv).append(SearchBox);
        $(containerDiv).append(SearchBoxDiv);
        /** set search cross icon top based upon search box height **/
        /**DAS-669 */
        $("#SearchTextCross"+ this.m_componentid).css({"line-height": (1*this.m_menupanelrowheight) + "px"});
    		}
    }
    $(containerDiv).append(innerDiv);
    var orderListDiv = this.addOrderedList();
    $(innerDiv).append(orderListDiv);
    //this.drawTitle();
	if(IsBoolean(this.m_enabledualselectionlist)){
		this.drawDualSelectionList();
	}else{
		var selectedList = {val:[], dVal:[], index: [], li: []};
		for (var i = 0; i < this.value.length; i++) {
	        var li = this.drawOptions(this.displayField[i], this.value[i], i, orderListDiv);
	        if (this.getSelectedIndex(i)) {
		        if (IsBoolean(this.m_allowmultipleselection)) {
		        	selectedList.val.push( this.value[i] );
		        	selectedList.dVal.push( this.displayField[i] );
		        	selectedList.index = [i];
		        	selectedList.li.push(li);
		        }else{
	    			selectedList.val = [this.value[i]];
	    			selectedList.dVal = [this.displayField[i]];
	    			selectedList.li = [li];
	    			selectedList.index = [i];
		        }
	        }
	    }
		/*DAS-303*/
		if(this.value.length <=0){
		    var li = document.createElement("li");
		    li.setAttribute("value", "No Field Available");
		    li.setAttribute("class", "listFilterLi");
		    li.innerHTML = "No Field Available";
		    $(li).css({
		    	"margin": this.m_listelementproperty.margin,
		    	"display": "block",
		    	"vertical-align": "middle",
		    	"padding": "3px",
		    	"width": "inherit",
		    	"text-align":"center",
		    	"height": this.m_menupanelrowheight+"px",
		    	"background-color": this.m_hexChromeColor,
		    	"font-size": this.fontScaling(this.m_fontsize) + "px",
		    	"color": "#e74c3c",
		    	"font-family": selectGlobalFont(this.m_fontfamily),
		    	"font-style": this.m_fontstyle,
		    	"font-weight": this.m_fontweight,
		    	"cursor": this.m_cursortype,
		    	"white-space": "nowrap",
		    	"overflow": "hidden",
		    	"text-overflow": "ellipsis",
		    });
		    if(this.m_enhanceCheckbox)
		    li.setAttribute("class", "listFilterLi enhancelist");
		    orderListDiv.appendChild(li);
		}

	    if (IsBoolean(this.m_allowmultipleselection)) {
	    	if(IsBoolean(this.m_actionbarenabled) && this.value.length > 0){
		        this.createActionIcons(containerDiv);
	    	}else{
	    		/** Get search bar working even when action icons are not visible **/
	    		this.initSearchBarEvent();
	    	}
	        if(IsBoolean(isTouchEnabled)) {
	        	this.initCheckBoxChangeEvent();
	        }
	    }

        for(var i1=0; i1<selectedList.li.length; i1++){
        	selectedList.li[i1].style.backgroundColor = convertColorToHex(this.m_selectioncolor);
	    	selectedList.li[i1].setAttribute("class", "listFilterLi selectedFilterLi");
	    	if (!IsBoolean(this.m_allowmultipleselection))
	    	   this.m_checkboxstatus[selectedList.val] = true;
	    	if(this.m_enhanceCheckbox)
	    		selectedList.li[i1].setAttribute("class", "listFilterLi enhancelist selectedFilterLi");
        }
        this.m_selectedindexarray = this.m_selectedindex;// Added for filtersaver
		/** To pass default filter selected index value to associated component on preview **/
        /** commented this method bcz connection loading multiple times  **/
		if(IsBoolean(this.m_enablegvautoupdate)){
        	this.m_notifychange = this.m_notifygvautoupdate;
        	this.handleOnChangeEvent(selectedList.val.join(), selectedList.dVal.join(), 0);
        }
	}
};
ListFilter.prototype.drawTitle = function () {

};
//Nik Start

/*
 * @drawList This draw method is for simple list display on canvas
 */
ListFilter.prototype.drawList = function () {
	this.setColor();
	var containerDiv = this.drawContainerDiv();
	for (var i = 0; i < this.value.length; i++) {
		this.drawOptions(this.displayField[i], this.value[i], i, containerDiv);
	}
	if (IsBoolean(this.m_allowmultipleselection) && IsBoolean(isTouchEnabled)) {
		this.initCheckBoxChangeEvent();
	}
};

/*
 * @drawDualSelectionList this draw method is for drawing dual selection list
 */
ListFilter.prototype.drawDualSelectionList = function(){
	var temp = this;
	temp.m_updateFilterList = [];
	var removedInd = "-1";
	var totalCurrentSelectedListItem = [];
	temp.setColor();
	if(temp.m_isDataSetavailable){
		$("#StatusMsg"+temp.m_objectid).remove();
	}
	$("#" + temp.m_componentid).remove();
	var containerDiv = document.createElement('div');
	containerDiv.setAttribute('id', temp.m_componentid);
	containerDiv.style.position = "absolute";
	containerDiv.setAttribute("style", "width:inherit;height:" + temp.m_height + "px;background-color:" + temp.m_hexBackgroundColor + ";");
	containerDiv.style.overflow = "auto";
	if(IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)){
    	var titleDiv = this.titleContainerDiv();
        $("#draggableDiv" + temp.m_objectid).append(titleDiv);
    }
	$("#draggableDiv" + temp.m_objectid).append(containerDiv);
	
	var filterChipsObj = this.getFilterChipsComponentObj();
	if (filterChipsObj !== undefined) {
	    var prevTextArr = filterChipsObj.m_filterDisplayValues[this.m_objectid];
	    
	    if(filterChipsObj.m_removedChipParentValues.length > 0){
			filterChipsObj.m_filterDisplayValues[this.m_objectid] = [];
			if(filterChipsObj.m_savedtext.length > 0){
				prevTextArr.map(function(val){
				 	var ind2 = filterChipsObj.m_savedtext.indexOf(val);
				 	(ind2 >= 0) ? filterChipsObj.m_savedtext.splice(ind2, 1): filterChipsObj.m_savedtext;
				})
			}
		}
		prevTextArr = filterChipsObj.m_filterDisplayValues[this.m_objectid];
	    if (filterChipsObj.m_removedChipValue !== undefined) {
	        this.m_selectedindex = [];
	    } else if (prevTextArr != undefined && prevTextArr.length > 0 && typeof this.m_selectedindex == "string") { //
	        this.m_selectedindex = [];
	    } else if (prevTextArr != undefined && prevTextArr.length > 0 && Array.isArray(this.m_selectedindex)) {
	        var tempind = this.m_selectedindex;
	        this.m_selectedindex = [];
	        if (tempind !== "" && !Array.isArray(tempind))
	            this.m_selectedindex.push(tempind)
	        else if (Array.isArray(tempind) && tempind.indexOf("-1") >= 0)
	            this.m_selectedindex = [];
	        else
	            this.m_selectedindex = tempind;
	    } else {
	        //do nothing
	    }

	    if (this.m_associatedfilterchipsid !== "" && filterChipsObj.m_removedChipValue !== undefined) {
	        var arr = this.m_dataProvider.filter(function(obj) {
	            for (var key in obj) {
	                if (obj[key] == filterChipsObj.m_removedChipValue) {
	                    return obj;
	                }
	            }
	        })
	        removedInd = this.value.indexOf(filterChipsObj.m_removedChipValue);
	    }

	    if (prevTextArr !== undefined && prevTextArr.length > 0 && arr !== undefined && arr.length > 0) {
	        arr.map(function(ele) {
	            if (prevTextArr.indexOf(ele[temp.m_categoryName[0]]) >= 0) {
	                var ind = prevTextArr.indexOf(ele[temp.m_categoryName[0]]);
	                var ind2 = filterChipsObj.m_savedtext.indexOf(ele[temp.m_categoryName[0]]);
	                (ind >= 0) ? prevTextArr.splice(ind, 1): prevTextArr;
	                (ind2 >= 0) ? filterChipsObj.m_savedtext.splice(ind2, 1): filterChipsObj.m_savedtext;
	            }
	        })
	        temp.m_selectedindex = (prevTextArr.length == 0) ? [] : temp.m_selectedindex;
	    }
	}
	for (var index = 0; index < temp.m_categoryData.length; index++) {
	    if (this.m_associatedfilterchipsid !== "" && removedInd < 0 && filterChipsObj !== undefined && filterChipsObj.m_removedChipValue !== undefined) {
	        var prevTextArr = filterChipsObj.m_filterDisplayValues[this.m_objectid];
	        //filterChipsObj.m_removedChipValue;
	        if (prevTextArr !== undefined && prevTextArr.length > 0 && filterChipsObj !== undefined && filterChipsObj.m_removedChipValue !== undefined && filterChipsObj.m_removedChipValue !== this.displayField[index] && prevTextArr.indexOf(this.displayField[index]) >= 0) { //
	            //var selInd = prevTextArr.indexOf(this.displayField[j]);
	            this.m_selectedindex.push(index);
	        }
	    } else if (prevTextArr !== undefined && prevTextArr.length > 0 && prevTextArr.indexOf(this.displayField[index]) >= 0) {
	        this.m_selectedindex.push(index);
	    }
	}
	if (!Array.isArray(this.m_selectedindex) && Array.isArray(tempind) && tempind.indexOf("-1") >= 0)
	    this.m_selectedindex = "-1";
	
	var sData = [];
	var dData = [];
	for(var i=0 ; i<temp.m_categoryData.length; i++){
		 if (temp.getSelectedIndex(i)) {
			 dData.push(temp.m_categoryData[i]);
			 temp.m_updateFilterList.push(temp.m_categoryData[i].toString());
		}else{
			sData.push(temp.m_categoryData[i]);
		}
	}
	
	$("#"+temp.m_componentid).append(temp.makeSourceList(sData)); //containerDiv.append(this.makeSourceList(this.value)); this method is not working in IE
	$("#"+temp.m_componentid).append(temp.makeDistinationList(dData));
	if(temp.m_categoryData.length > 0){
		$(temp.getListId()).listswap({
			truncate:true, 
			height:temp.m_height - 32 +'px', 
			is_scroll:true, 
		});
	}
	/**DAS-669 */
	$(".listboxswap .listbox_search input").css("outline","none");
	
	this.m_selectedindexarray = this.m_selectedindex;// Added for filtersaver
	/** To pass default filter selected index value to associated component on preview **/
    /** commented this method bcz connection loading multiple times  **/
	if(IsBoolean(this.m_enablegvautoupdate)){
    	this.m_notifychange = this.m_notifygvautoupdate;
		var result = [];
		for(var i1=0 ; i1<this.displayField.length; i1++){
			 if (this.getSelectedIndex(i1)) {
				result.push(i1);
			}
		}
    	this.handleMultiSelectionChangeEvent(result);
    }

	temp.setDualSelectionCss();
	$("#draggableDiv" + temp.m_objectid).find('.clear').attr("title", "Clear").css({"line-height": "12px","font-size": "20px"});
	$('#addAllsource'+temp.m_componentid).click(function(){
		$('#listbox_destination'+temp.m_componentid+ '_wrapper ul li').removeClass('selectedFilterLi');
		$('#listbox_destination'+temp.m_componentid+ '_wrapper ul li').css("backgroundColor",temp.m_hexChromeColor);
		temp.setAllItemListValue();	
	});
	$('#addsource'+temp.m_componentid).click(function(){
		$('#listbox_destination'+temp.m_componentid+ '_wrapper ul li').removeClass('selectedFilterLi');
		$('#listbox_destination'+temp.m_componentid+ '_wrapper ul li').css("backgroundColor",temp.m_hexChromeColor);
		temp.setAllItemListValue();	
	});
	$('#listbox_destination'+temp.m_componentid+ '_wrapper').on('click', 'li', function () {
		temp.currentSelectedListItem = $(this).text();
		totalCurrentSelectedListItem.push(temp.currentSelectedListItem);
	});
	$('#removesource'+temp.m_componentid).click(function(){
		$('#listbox_source'+temp.m_componentid+ '_wrapper ul li').removeClass('selectedFilterLi');
		$('#listbox_source'+temp.m_componentid+ '_wrapper ul li').css("backgroundColor",temp.m_hexChromeColor);
		temp.removeSelectedItemFromList(totalCurrentSelectedListItem);
		temp.setAllItemListValue();
		totalCurrentSelectedListItem = [];
		var result = [];
		for(var i=0 ; i<temp.displayField.length; i++){
			for(var j=0;j<temp.m_updateFilterList.length;j++){
				if(temp.displayField[i]==temp.m_updateFilterList[j]){
					result.push(i);
				}
			}
		}
		temp.handleMultiSelectionChangeEvent(result);
	});
	$('#removeAllsource'+temp.m_componentid).click(function(){
		$('#listbox_source'+temp.m_componentid+ '_wrapper ul li').removeClass('selectedFilterLi');
		$('#listbox_source'+temp.m_componentid+ '_wrapper ul li').css("backgroundColor",temp.m_hexChromeColor);
		temp.removeAllFromList();
		var result = [];
		temp.handleMultiSelectionChangeEvent(result);
	});
};

/*
 * @GetFilterListDataProvider is return update filter list with ser data as well as cat data
 */
ListFilter.prototype.getFilterDataProvider = function(){
	var filterObjArr = [];
	for(var i = 0 ; i < this.m_dataProvider.length ; i++){
		for(var j = 0 ; j < this.m_updateFilterList.length ; j++){
				var compareVal = (isNaN(this.m_updateFilterList[j]) ? (this.m_updateFilterList[j]):(this.m_updateFilterList[j]*1));
				for(var key in this.m_dataProvider[i]){
					if(compareVal == this.m_dataProvider[i][key])
						filterObjArr.push(this.m_dataProvider[i])
			}
		}
	}
	return filterObjArr;
};


/*
 * @removeSelectedItemFromList is remove item from right hand side list or from global array
 */
ListFilter.prototype.removeSelectedItemFromList = function(selItem){
	for(var k = 0 ; k < selItem.length ; k++){
		for(var i = this.m_updateFilterList.length - 1; i >= 0; i--) {
		    if( this.m_updateFilterList[i] === selItem[k]) {
		    	this.m_updateFilterList.splice(i, 1);
		    }
		}
	}
};



/*
 * @removeAllFromList method is empty right hand list
 */
ListFilter.prototype.removeAllFromList = function(){
	var temp = this;
	temp.m_updateFilterList = [];
};

/*
 * set filter value
 */
ListFilter.prototype.setAllItemListValue = function(){
	var temp = this;
	//$('#listbox_source'+this.m_componentid+'_wrapper ul li').toggleClass("selectedFilterLi");
	$('#listbox_destination'+temp.m_componentid+ '_wrapper ul li').each(function(index) {
		if (temp.m_updateFilterList.indexOf($(this).text()) === -1)
		    temp.m_updateFilterList.push($(this).text())
	});
	var result = [];
	for(var i=0 ; i<temp.displayField.length; i++){
		for(var j=0;j<temp.m_updateFilterList.length;j++){
			if(temp.displayField[i]==temp.m_updateFilterList[j]){
				result.push(i);
			}
		}
	}
	temp.handleMultiSelectionChangeEvent(result);
	result = [];
};

/*
 * @set dual selection list css
 */
ListFilter.prototype.setDualSelectionCss = function(){
	var temp = this;
	$('#listbox_source'+this.m_componentid+'_wrapper ul li')
			.css('font-size',this.fontScaling(this.m_fontsize) + "px")
			.css('color',convertColorToHex(this.m_fontcolor))
			.css('font-family',selectGlobalFont(this.m_fontfamily))
			.css('font-style',this.m_fontstyle)
			.css("background-color", this.m_hexChromeColor)
			.css('font-weight',this.m_fontweight);
	$('#listbox_destination'+this.m_componentid+'_wrapper ul li')
			.css('font-size',this.fontScaling(this.m_fontsize) + "px")
			.css('color',convertColorToHex(this.m_fontcolor))
			.css('font-family',selectGlobalFont(this.m_fontfamily))
			.css('font-style',this.m_fontstyle)
			.css("background-color", this.m_hexChromeColor)
			.css('font-weight',this.m_fontweight);
	if(IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_title.m_showgradient)){
		$('#listbox_source'+this.m_componentid+'_wrapper ul')
		.css('height',((1*this.m_height) - (1*this.m_title.m_titlebarheight) - 32));
		$('#listbox_destination'+this.m_componentid+'_wrapper ul')
		.css('height',((1*this.m_height) - (1*this.m_title.m_titlebarheight) - 32));
	}else{
		$('#listbox_source'+this.m_componentid+'_wrapper ul')
		.css('height',((1*this.m_height) - 32));
		$('#listbox_destination'+this.m_componentid+'_wrapper ul')
		.css('height',((1*this.m_height) - 32));
	}
	$(".listbox_search").css({"font-family":selectGlobalFont(this.m_title.m_fontfamily)});
	$('.listbox_controls ul')
		.css('height',((1*this.m_height) - (1*this.m_title.m_titlebarheight)));
	$('#listbox_source'+temp.m_componentid+'_wrapper ul li').on("mousemove",
			function () {
			if (!$(this).hasClass("selectedFilterLi")){
				this.style.backgroundColor = convertColorToHex(temp.m_rollovercolor);
			}
		});
	$('#listbox_source'+temp.m_componentid+'_wrapper ul li').on("mouseout",
			function () {
			if ($(this).hasClass("selectedFilterLi")) {
				this.style.backgroundColor = convertColorToHex(temp.m_selectioncolor);
			} else{
				this.style.backgroundColor = temp.m_hexChromeColor;
			}
		});
	$('#listbox_destination'+temp.m_componentid+'_wrapper ul li').on("mousemove",
			function () {
			if (!$(this).hasClass("selectedFilterLi")){
				this.style.backgroundColor = convertColorToHex(temp.m_rollovercolor);
			}
		});
	$('#listbox_destination'+temp.m_componentid+'_wrapper ul li').on("mouseout",
			function () {
				if ($(this).hasClass("selectedFilterLi")) {
					this.style.backgroundColor = convertColorToHex(temp.m_selectioncolor);
				} else{
					this.style.backgroundColor = temp.m_hexChromeColor;
				}
		});
	$('#listbox_source'+temp.m_componentid+'_wrapper ul li').on("click",
			function () {
					$( this ).toggleClass("selectedFilterLi");
		});
	$('#listbox_destination'+temp.m_componentid+'_wrapper ul li').on("click",
			function () {
					$( this ).toggleClass("selectedFilterLi");
		});
};

ListFilter.prototype.getListId = function(){
	var listIdArr = [];
	listIdArr[0] = "#source"+this.m_componentid;
	listIdArr[1] = "#destination"+this.m_componentid;
	return listIdArr.toString();
};
/*
 * 
 * @makeDistinationList is creating right hand side lsit
 */
ListFilter.prototype.makeDistinationList = function(arr){
	var temp = this;
	var list = document.createElement('selection');
    list.id = "destination"+temp.m_componentid;
    list.setAttribute('data-search',"Search for options");
    for(var i = 0; i < arr.length; i++) {
        // Create the list item:
        var item = document.createElement('option');

        // Set its contents:
        item.appendChild(document.createTextNode(arr[i]));

        // Add it to the list:
        list.appendChild(item);
    }
    return list;
};

/*
 * @makeSource list is creating left side list
 */
ListFilter.prototype.makeSourceList = function(arr){
    // Create the list element:
	var temp = this;
    var list = document.createElement('selection');
    list.id = "source"+temp.m_componentid;
    list.setAttribute('data-search',"Search for options");
 
    for(var i = 0; i < arr.length; i++) {
        // Create the list item:
        var item = document.createElement('option');

        // Set its contents:
        item.appendChild(document.createTextNode(arr[i]));

        // Add it to the list:
        list.appendChild(item);
    }
    /*DAS-303*/
    if(arr.length <=0)
    {
    	var list = document.createElement('selection');
        list.setAttribute('data-search',"Search for options");
        var item = document.createElement('option');
        // Set its contents:
        item.appendChild(document.createTextNode("No Fields Availabe"));
        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
};
//Nik End


/** @description Setter method to setUniqueData . **/
ListFilter.prototype.setUniqueData = function() {
    this.value = [];
    this.displayField = [];
    var uniqueSeriesData = [];
    var uniqueCategoryData = [];
    for (var i = 0; i < this.m_seriesData.length; i++) {
        var exist = false;
        for (var j = 0; j < this.value.length; j++) {
            // there will be only one value field , so we can directly use index:zero
            if (this.value[j] == this.m_seriesData[i][0]) {
                exist = true;
                break;
            }
        }
        if (!exist) {
            this.value.push(this.m_seriesData[i][0]);
            this.displayField.push(this.m_categoryData[i][0]);
            uniqueCategoryData.push(this.m_categoryData[i]);
            uniqueSeriesData.push(this.m_seriesData[i]);
        }
    }
    this.m_categoryData = uniqueCategoryData;
    this.m_seriesData = uniqueSeriesData;
};
/** @description method to create Options and set CSS. **/
ListFilter.prototype.drawOptions = function(text, value, index, container) {
    var temp = this;
    var removedInd = "-1";
    if(!IsBoolean(this.m_enableborder)){
    	temp.m_listelementproperty = {
    	    	"boxShadow": "none",
    	    	"borderRadius": "0",
    	    	"borderWidth":"0", 
    	    	"borderStyle": "none",
    	    	"margin" : "1px 0px 1px 0px"
    	};	
    }
    var li = document.createElement("li");
    li.setAttribute("id", temp.m_componentid + value);
    li.setAttribute("value", value);
    
    li.setAttribute("class", "listFilterLi");
    
    if(this.m_enhanceCheckbox)
    	li.setAttribute("class", "listFilterLi enhancelist");
    	
    li.setAttribute("For", "checkboxLabel");
    
    if (IsBoolean(this.m_allowmultipleselection)) {
    var disp=(this.m_enhanceCheckbox)?'flex':"-webkit-box";
    $(li).css({
    	"margin": temp.m_listelementproperty.margin,
    	"display": disp,
    	"vertical-align": "middle",
    	"padding": "3px",
    	"width": "inherit",
    	"height": temp.m_menupanelrowheight+"px",
    	"background-color": temp.m_hexChromeColor,
    	"font-size": temp.fontScaling(temp.m_fontsize) + "px",
    	"color": convertColorToHex(temp.m_fontcolor),
    	"font-family": selectGlobalFont(temp.m_fontfamily),
    	"font-style": temp.m_fontstyle,
    	"font-weight": temp.m_fontweight,
    	"cursor": temp.m_cursortype,
    	"border-color": temp.m_listbordercolor,
    	"box-shadow": temp.m_listelementproperty.boxShadow,
    	"border-radius": temp.m_listelementproperty.borderRadius + "px",
    	"border-width":temp.m_listelementproperty.borderWidth + "px", 
    	"border-style": temp.m_listelementproperty.borderStyle,
    	"align-items": "center"
    });
    }else
    	{
    	var disp=(this.m_enhanceCheckbox)?'flex':"block";
        $(li).css({
        	"margin": temp.m_listelementproperty.margin,
        	"display": disp,
        	"vertical-align": "middle",
        	"padding": "3px",
        	"width": "inherit",
        	"height": temp.m_menupanelrowheight+"px",
        	"background-color": temp.m_hexChromeColor,
        	"font-size": temp.fontScaling(temp.m_fontsize) + "px",
        	"color": convertColorToHex(temp.m_fontcolor),
        	"font-family": selectGlobalFont(temp.m_fontfamily),
        	"font-style": temp.m_fontstyle,
        	"font-weight": temp.m_fontweight,
        	"cursor": temp.m_cursortype,
        	"border-color": temp.m_listbordercolor,
        	"box-shadow": temp.m_listelementproperty.boxShadow,
        	"border-radius": temp.m_listelementproperty.borderRadius + "px",
        	"border-width":temp.m_listelementproperty.borderWidth + "px", 
        	"border-style": temp.m_listelementproperty.borderStyle,
        	"white-space": "nowrap",
        	"overflow": "hidden",
        	"text-overflow": "ellipsis",
        	"align-items": "center"
        });
    	}
    container.appendChild(li);
    
    var filterChipsObj = this.getFilterChipsComponentObj();
	if(filterChipsObj !== undefined){
		var prevTextArr = filterChipsObj.m_filterDisplayValues[this.m_objectid];
		
		if(filterChipsObj.m_removedChipParentValues.length > 0){
			filterChipsObj.m_filterDisplayValues[this.m_objectid] = [];
			if(filterChipsObj.m_savedtext.length > 0){
				prevTextArr.map(function(val){
				 	var ind2 = filterChipsObj.m_savedtext.indexOf(val);
				 	(ind2 >= 0) ? filterChipsObj.m_savedtext.splice(ind2, 1): filterChipsObj.m_savedtext;
				})
			}
		}
		prevTextArr = filterChipsObj.m_filterDisplayValues[this.m_objectid];
		if (filterChipsObj.m_removedChipValue !== undefined) {
		    this.m_selectedindex = [];
		} else if (prevTextArr != undefined && prevTextArr.length > 0 && typeof this.m_selectedindex == "string") { //
		    this.m_selectedindex = [];
		} else if (prevTextArr != undefined && prevTextArr.length > 0 && Array.isArray(this.m_selectedindex)) {
		    var tempind = this.m_selectedindex;
		    this.m_selectedindex = [];
		    if (tempind !== "" && !Array.isArray(tempind))
		        this.m_selectedindex.push(tempind)
		    else if (Array.isArray(tempind) && tempind.indexOf("-1") >= 0)
		        this.m_selectedindex = [];
		    else
		        this.m_selectedindex = tempind;
		} else {
		    //do nothing
		}

		if (this.m_associatedfilterchipsid !== "" && filterChipsObj.m_removedChipValue !== undefined) {
		    var arr = this.m_dataProvider.filter(function(obj) {
		        for (var key in obj) {
		            if (obj[key] == filterChipsObj.m_removedChipValue) {
		                return obj;
		            }
		        }
		    })
		    removedInd = this.value.indexOf(filterChipsObj.m_removedChipValue);
		}

		if (prevTextArr !== undefined && prevTextArr.length > 0 && arr !== undefined && arr.length > 0) {
		    arr.map(function(ele) {
		        if (prevTextArr.indexOf(ele[temp.m_categoryName[0]]) >= 0) {
		            var ind = prevTextArr.indexOf(ele[temp.m_categoryName[0]]);
		            var ind2 = filterChipsObj.m_savedtext.indexOf(ele[temp.m_categoryName[0]]);
		            (ind >= 0) ? prevTextArr.splice(ind, 1): prevTextArr;
		            (ind2 >= 0) ? filterChipsObj.m_savedtext.splice(ind2, 1): filterChipsObj.m_savedtext;
		        }
		    })
		    temp.m_selectedindex = (prevTextArr.length == 0) ? [] : temp.m_selectedindex;
		}
	}
	if (this.m_associatedfilterchipsid !== "" && removedInd < 0 && filterChipsObj !== undefined && filterChipsObj.m_removedChipValue !== undefined) {
        var prevTextArr = filterChipsObj.m_filterDisplayValues[this.m_objectid];
        //filterChipsObj.m_removedChipValue;
        if (prevTextArr !== undefined && prevTextArr.length > 0 && filterChipsObj !== undefined && filterChipsObj.m_removedChipValue !== undefined && filterChipsObj.m_removedChipValue !== this.displayField[index] && prevTextArr.indexOf(this.displayField[index]) >= 0) { //
            //var selInd = prevTextArr.indexOf(this.displayField[j]);
            this.m_selectedindex.push(index);
        }
    } else if (prevTextArr !== undefined && prevTextArr.length > 0 && prevTextArr.indexOf(this.displayField[index]) >= 0) {
        this.m_selectedindex.push(index);
    }
    if (!Array.isArray(this.m_selectedindex) && Array.isArray(tempind) && tempind.indexOf("-1") >= 0)
        this.m_selectedindex = "-1";
	/**Added above changes for supporting filterchips functionality**/
    if (IsBoolean(this.m_allowmultipleselection) /*&& IsBoolean(isTouchEnabled)*/ ) {
        var idValue = getStringARSC(value) +"-"+ index; /*BDD-833, To get the data of same magnitude but different sign(Ex. -1 & 1)*/
        var childCheckBox = this.createCheckBox(value, idValue, index);
        var label = this.createLabel(text, value, idValue, index);
        var itemDiv = document.createElement("div");
        itemDiv.setAttribute("class", "checkLabeItem");
        /*
        itemDiv.style.paddingTop = "2px";
        itemDiv.style.paddingBottom = "2px";
        */
        //itemDiv.style.height = "24px"; 
        itemDiv.style.height = this.m_menupanelrowheight + "px";
        itemDiv.style.display = "flex";
        itemDiv.style.alignItems = "center";
        $(itemDiv).append(childCheckBox);
        $(itemDiv).append(label);
        $(li).append(itemDiv);
        /** DAS-361 removing padding-right and width of checkbox and left-margin of label from width of li */
        label.style.width = $(li).outerWidth() - parseInt($(li).css("padding-right")) - parseInt($(li).css("padding-left")) - $(childCheckBox).outerWidth() - parseInt($(label).css("margin-left")) + "px";
    } else {
        li.innerHTML = text;
    }
    if (!this.m_designMode) {
	    if (!IsBoolean(this.m_allowmultipleselection)) {
	        li.addEventListener("click", function() {
	            $(this).siblings().removeClass("selectedFilterLi");
	            temp.m_checkboxstatus = {};
	            $(this).siblings().css({
	            	"background-color": temp.m_hexChromeColor,
	            	"color": convertColorToHex(temp.m_fontcolor)
	           });
	            $(this).addClass("selectedFilterLi");
	            temp.m_checkboxstatus[value] = true;
	            $(this).css({
	            	"background-color": convertColorToHex(temp.m_selectioncolor),
	            	"color": convertColorToHex(temp.m_selectionfontcolor)
	           });
	            this.selectedIndex = $("#" + temp.m_componentid + " li").index(this);
	            temp.m_selectedindexarray = this.selectedIndex;
	    		temp.m_notifychange = true;
	            temp.handleOnChangeEvent($(this).attr("value"), this.innerHTML, this.selectedIndex);
	        });
	    }
	    if (IsBoolean(this.m_allowmultipleselection)) {
	        li.addEventListener("click",
	            function(event) {
	                event.stopPropagation();
	                if (event.target.type !== "checkbox") {
	                    if (!$(this.firstChild.firstChild).is(":checked")) {
	                        $(this.firstChild.firstChild).prop('checked', true);
	                        temp.m_checkboxstatus[this.firstChild.firstChild.id.split("checklist" + temp.m_componentid)[1]] = true;
	                        $("#textBox" + temp.m_objectid).val(temp.getDisplayValue());
	                        $(this.firstChild.lastChild).css("color", convertColorToHex(temp.m_selectionfontcolor));
	                        $(this).addClass("selectedFilterLi");
	                        $(this).css("background-color", convertColorToHex(temp.m_selectioncolor));
	                    } else {
	                        $(this.firstChild.firstChild).prop('checked', false);
	                        temp.m_checkboxstatus[this.firstChild.firstChild.id.split("checklist" + temp.m_componentid)[1]] = false;
	                        $("#textBox" + temp.m_objectid).val(temp.getDisplayValue());
	                        $(this.firstChild.lastChild).css("color", convertColorToHex(temp.m_fontcolor));
	                        $(this).removeClass("selectedFilterLi");
	                        $(this).css("background-color", temp.m_hexChromeColor);
	                        var filterChipsObj = temp.getFilterChipsComponentObj();
					        var value = this.firstChild.firstChild.id.split("checklist" + temp.m_componentid)[1].split('-')[0];
					        var value1 = value.replace(/_/g, ' ');
					        value1 = (isNaN(value1)) ? value1 : value1 * 1;
					        if (filterChipsObj != undefined){
					        	var ind = filterChipsObj.m_savedtext.indexOf(value1);
					         	if (ind > -1) {
					         		filterChipsObj.m_savedtext.splice(ind, 1);
					         		filterChipsObj.m_removedChipValue = value;
					         	}
					        }
	                    }
	                } else {
	                    if ($(this.firstChild.firstChild).is(":checked")) {
	                        temp.m_checkboxstatus[this.firstChild.firstChild.id.split("checklist" + temp.m_componentid)[1]] = true;
	                        $("#textBox" + temp.m_objectid).val(temp.getDisplayValue());
	                        $(this.firstChild.lastChild).css("color", convertColorToHex(temp.m_selectionfontcolor));
	                        $(this).addClass("selectedFilterLi");
	                        $(this).css("background-color", convertColorToHex(temp.m_selectioncolor));
	                    } else {
	                        temp.m_checkboxstatus[this.firstChild.firstChild.id.split("checklist" + temp.m_componentid)[1]] = false;
	                        $("#textBox" + temp.m_objectid).val(temp.getDisplayValue());
	                        $(this.firstChild.lastChild).css("color", convertColorToHex(temp.m_fontcolor));
	                        $(this).removeClass("selectedFilterLi");
	                        $(this).css("background-color", temp.m_hexChromeColor);
	                    }
	                }
	                /**Added to hide OK button when none of the field is selected*/
	            	if(IsBoolean(temp.m_hideokbutton)){
	            		if(temp.m_selectedindexarray.length > 0){
	            			$("#Apply" + temp.m_componentid).show();
	            		}else{
	            			$("#Apply" + temp.m_componentid).hide();
	            		}
	            	}else{
	            		$("#Apply" + temp.m_componentid).show();
	            	}
	                $("#Cancel" + temp.m_componentid).show();
	                var isAllSelected = "";
	                for (var key in temp.m_checkboxstatus) {
	                    if (!IsBoolean(temp.m_checkboxstatus[key])) {
	                        isAllSelected = false;
	                        break;
	                    } else {
	                        isAllSelected = true;
	                    }
	                }
	                var parValues;
	                if(filterChipsObj != undefined){	
						for (var key in temp.m_checkboxstatus) {	
						    if (IsBoolean(temp.m_checkboxstatus[key])) {	
								filterChipsObj.m_removedChipParentValues = [];	
						        break;	
						    } else {	
								var value = key.split('-')[0];	
						        filterChipsObj.m_removedChipParentValues.push(value);	
						    }	
						}	
					}
	                if (IsBoolean(isAllSelected)) {
	                    $("#SelectAll" + temp.m_componentid).attr("title", "Remove All");
	                    $("#SelectAll" + temp.m_componentid).removeClass("bd-checkbox");
	                    $("#SelectAll" + temp.m_componentid).addClass("bd-checked");
	                } else if (!IsBoolean(isAllSelected)) {
	                    $("#SelectAll" + temp.m_componentid).attr("title", "Select All");
	                    $("#SelectAll" + temp.m_componentid).addClass("bd-checkbox");
	                    $("#SelectAll" + temp.m_componentid).removeClass("bd-checked");
	                }else{
	                	// Do nothing
	                }
	                
	                if(IsBoolean(temp.m_actionbarenabled)){
	                	/** Do nothing, OK button click will take care **/
	                }else{
	                	/** Update GV when state of a checkbox has been changed **/
	                	temp.m_notifychange = true;
	                    temp.handleOnChangeEvent(temp.getValue(), temp.getDisplayValue(), 0);
	                    temp.preSelectedValue.cat = temp.getDisplayValue();
	                    temp.preSelectedValue.ser = temp.getValue();
	                }
	            });
	    }
	    li.addEventListener("mousemove",
	        function() {
	            if (!$(this).hasClass("selectedFilterLi")){
	                this.style.backgroundColor = convertColorToHex(temp.m_rollovercolor);
          /**CP-920: added this condition to show default cursor for selected value**/
	                if (!IsBoolean(this.m_allowmultipleselection)){
	                        this.style.cursor =  temp.m_cursortype;
	                }
	            } 
	            else{
	            	if (!IsBoolean(this.m_allowmultipleselection)){
	            	     this.style.cursor = "default";}
	            }
	                
	        });
	    li.addEventListener("mouseout",
	        function() {
	            if ($(this).hasClass("selectedFilterLi")) {
	                this.style.backgroundColor = convertColorToHex(temp.m_selectioncolor);
	            } else
	                this.style.backgroundColor = temp.m_hexChromeColor;               
	        });
    }
    return li;
};

/** @description create CheckBox and map on-change            //li.innerHTML = "<input type='checkbox' class='multiSelectListcheck' style='margin:5px;'>" + text;
 event and return objects. **/
ListFilter.prototype.createCheckBox = function(value, idValue, index) {
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", "multiListCheckbox cr-checkbox");
    
    if(this.m_enhanceCheckbox)
    checkbox.setAttribute("class", "multiListCheckbox option-input-cr cr-checkbox");
    
    checkbox.setAttribute("id", "checklist" + this.m_componentid + idValue);
    checkbox.style.cursor = this.m_cursortype;
    checkbox.style.fontSize = 14 * this.minWHRatio() + "px";
    checkbox.style.margin = "0px";
    //checkbox.style.marginLeft = "5px";
    if (this.getSelectedIndex(index)) {
        $(checkbox).attr("checked", true);
        this.preSelectedValue.cat = this.displayField[index];
        this.preSelectedValue.ser = value;
        this.m_checkboxstatus[idValue] = true;
    } else {
        $(checkbox).attr("checked", false);
        this.m_checkboxstatus[idValue] = false;
    }
    this.m_isallselected = true;
	for (var key in this.m_checkboxstatus) {
	    if (!IsBoolean(this.m_checkboxstatus[key])) {
	        this.m_isallselected = false;
	        break;
	    } else {
	        this.m_isallselected = true;
	    }
	}
    return checkbox;
};
/** @description create Label element and set font property  and return objects. **/
ListFilter.prototype.createLabel = function(name, value, idValue, index) {
    var label = document.createElement("label");
    label.id = "checkboxLabel";
    
    if(this.m_enhanceCheckbox)
    	label.setAttribute("class", "ehancelabel");
    
    label.style.fontSize = this.m_fontsize * this.minWHRatio() + "px";
    label.style.fontFamily = selectGlobalFont(this.m_fontfamily);
    label.style.fontWeight = this.m_fontweight;
    label.style.fontStyle = this.m_fontstyle;
    label.style.color = convertColorToHex(this.m_fontcolor);
    label.style.display = "inline-block";
    label.style.verticalAlign = "middle"; //super or middle
    if(this.m_enhanceCheckbox){
    	label.style.display = "inline";
    	label.style.verticalAlign = "text-bottom"; //super or middle
    }
    label.style.whiteSpace= "nowrap";
    label.style.overflow= "hidden";
    label.style.textOverflow= "ellipsis";
    
    label.innerHTML = name;
    label.style.marginLeft = 8 + "px";
    label.style.marginBottom = 0 + "px";
    label.style.cursor = this.m_cursortype;
    //label.setAttribute("For", "checklist" + this.m_componentid + idValue);
    if (this.getSelectedIndex(index)) {
        label.style.color = convertColorToHex(this.m_selectionfontcolor);
    } else {
        label.style.color = convertColorToHex(this.m_fontcolor);
    }
    return label;
};

/** @description return true if selectedIndex value match to current index value . **/
ListFilter.prototype.getSelectedIndex = function(index) {
	var flag = false;
	if (Array.isArray(this.m_selectedindex)) {
		var strArr = this.m_selectedindex.map(String);
		var strIndex = index.toString();
		var idx = strArr.indexOf(strIndex);
		flag = (idx > -1) ? true : flag;
	} else {
		flag = (this.m_selectedindex == index) ? true : flag
	}
	return flag;
};

/** @description create ActionIcons  for multiselect list. **/
ListFilter.prototype.createActionIcons = function(mainDiv) {
    var temp = this;
    temp.m_selectAll = "Select All";
    $("#Apply" + temp.m_componentid).remove();
    $("#Cancel" + temp.m_componentid).remove();
    $("#Search" + temp.m_componentid).remove();
    $("#SelectAll" + temp.m_componentid).remove();
    var fontIconWidth = (temp.m_width * 17.5) / 100;
    
    var select_checkbox=(this.m_enhanceCheckbox)?"select-checkbox":"";
    
    fontIconWidth = (fontIconWidth > this.m_menupanelfontsize) ? this.m_menupanelfontsize : fontIconWidth;
    var div = "<div style='position:absolute;bottom:0px;padding:3px 2px 3px 2px;width:100%;min-height:"+temp.getActionBarHeight()+"px;background:" + convertColorToHex(this.m_chromecolor) + ";box-shadow: 0px 1px 2px 2px rgba(0,0,0,0.1);display: flex;align-items: center'>" +
        "<div style='width:100%'>"+
        "<span class='icons "+select_checkbox+" bd-checkbox' value='' id=\"SelectAll" + temp.m_componentid + "\" style='color:" + convertColorToHex(this.m_menupanelfontcolor) + ";font-size:" + (fontIconWidth * this.minWHRatio()) + "px; cursor:"+this.m_cursortype+"; position:relative;float:left;padding:2px 5px 0px 5px;'></span>" +
        "<span class='icons bd-close' value='' id=\"Cancel" + temp.m_componentid + "\" style='color:" + convertColorToHex(this.m_menupanelfontcolor) + ";font-size:" + (fontIconWidth * this.minWHRatio()) + "px; cursor:"+this.m_cursortype+"; position:relative;float:right;padding:2px 5px 0px 5px;'></span>" + 
        "<span class='icons bd-check-2' value='' id=\"Apply" + temp.m_componentid + "\" style='color:" + convertColorToHex(this.m_menupanelfontcolor) + ";font-size:" + (fontIconWidth * this.minWHRatio()) + "px; cursor:"+this.m_cursortype+"; position:relative;float:right;padding:2px 10px 0px 5px;'></span></div></div>";
    $(mainDiv).append(div);
    if (IsBoolean(this.m_isallselected)) {
	    $("#SelectAll" + temp.m_componentid).removeClass("bd-checkbox");
	    $("#SelectAll" + temp.m_componentid).addClass("bd-checked");
	} else if (!IsBoolean(this.m_isallselected)) {
	    $("#SelectAll" + temp.m_componentid).removeClass("bd-checked");
	    $("#SelectAll" + temp.m_componentid).addClass("bd-checkbox");
	} else {
	    //do nothing
	}
    $("#Apply" + temp.m_componentid).on("mouseenter", function(e){
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
    		var divTop = e.pageY - e.offsetY- PageTop + offsetTop + 12;
    		var divLeft = e.pageX - PageLeft - offsetLeft + 25;
    		var tooltipDiv = document.createElement("div");
    		tooltipDiv.innerHTML = "Apply";
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
    		var lt = e.pageX - e.offsetX - PageLeft - (wd/2) - 10 + "px";
    		$(tooltipDiv).css("left",lt);
    		$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
    	}
	}).on("mouseleave", function(){
		//$(this).css({"color": convertColorToHex(temp.m_menupanelfontcolor)});
		temp.removeToolTipDiv();
	}).on("click", function() {
		temp.m_notifychange = true;
        temp.handleOnChangeEvent(temp.getValue(), temp.getDisplayValue(), 0);
        temp.preSelectedValue.cat = temp.getDisplayValue();
        temp.preSelectedValue.ser = temp.getValue();
        $(this).hide();
        $("#Cancel" + temp.m_componentid).hide();
    });
    $("#Cancel" + temp.m_componentid).on("mouseenter", function(e){
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
    		var divTop = e.pageY - e.offsetY- PageTop + offsetTop + 12;
    		var divLeft = e.pageX - PageLeft - offsetLeft + 25;
    		var tooltipDiv = document.createElement("div");
    		tooltipDiv.innerHTML = "Cancel";
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
    		var lt = e.pageX - e.offsetX - PageLeft - (wd/2) - 10 + "px";
    		$(tooltipDiv).css("left",lt);
    		$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
    	}
	}).on("mouseleave", function(){
		//$(this).css({"color": convertColorToHex(temp.m_menupanelfontcolor)});
		temp.removeToolTipDiv();
	}).on("click", function() {
        $("#textBox" + temp.m_objectid).val(temp.preSelectedValue.cat);
        $("#Cancel" + temp.m_componentid).hide();
        $("#Apply" + temp.m_componentid).hide();
        var value = temp.preSelectedValue.ser.split(",");
        for (var key in temp.m_checkboxstatus) {
            var flag = false;
//            var idValue = key;
            for (var j = 0; j < value.length; j++) {
                if (key == getStringARSC(value[j])){
//                	idValue = value[j];
                    flag = true;
                    break;
                }
            }
            if (flag) {
                $("#checklist" + temp.m_componentid + key).attr("checked", true);
                $("#checklist" + temp.m_componentid + key).prop("checked", true);
                temp.m_checkboxstatus[key] = true;
                $("#checklist" + temp.m_componentid + key).siblings().css("color", convertColorToHex(temp.m_selectionfontcolor));
//                $("#" + temp.m_componentid + " [value='" + idValue + "']").addClass("selectedFilterLi");
//                $("#" + temp.m_componentid + " [value='" + idValue + "']").css("background-color", convertColorToHex(temp.m_selectioncolor));
                $("#checklist" + temp.m_componentid + key).parent().parent().addClass("selectedFilterLi");
                $("#checklist" + temp.m_componentid + key).parent().parent().css("background-color", convertColorToHex(temp.m_selectioncolor));
            } else {
                $("#checklist" + temp.m_componentid + key).attr("checked", false);
                $("#checklist" + temp.m_componentid + key).prop("checked", false);
                temp.m_checkboxstatus[key] = false;
                $("#checklist" + temp.m_componentid + key).siblings().css("color", convertColorToHex(temp.m_fontcolor));
//                $("#" + temp.m_componentid + " [value='" + idValue + "']").removeClass("selectedFilterLi");
//                $("#" + temp.m_componentid + " [value='" + idValue + "']").css("background-color", temp.m_hexChromeColor);
                $("#checklist" + temp.m_componentid + key).parent().parent().removeClass("selectedFilterLi");
                $("#checklist" + temp.m_componentid + key).parent().parent().css("background-color", temp.m_hexChromeColor);
            }
        }
    });
    $("#SelectAll" + temp.m_componentid).on("mouseenter", function(e){
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
    		var divTop = e.pageY - e.offsetY- PageTop + offsetTop + 12;
    		var divLeft = e.pageX - PageLeft - offsetLeft + 25;
    		var tooltipDiv = document.createElement("div");
    		tooltipDiv.innerHTML = temp.m_selectAll;
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
    		var lt = e.pageX - e.offsetX - PageLeft - (wd/2) - 11 + "px";
    		$(tooltipDiv).css("left",lt);
    		$(tooltipDiv).css("box-shadow","0 5px 15px -5px rgb(0 0 0 / 50%)");
    	}
	}).on("mouseleave", function(){
		//$(this).css({"color": convertColorToHex(temp.m_menupanelfontcolor)});
		temp.removeToolTipDiv();
	}).on("click", function() {
    	var isCheck;
        if ($(this).attr("class").indexOf("bd-checked") != -1) {
            isCheck = false
            temp.removeToolTipDiv();
			temp.m_selectAll = "Select All";
            //$(this).attr("title", "Select All");
            $(this).removeClass("bd-checked");
            $(this).addClass("bd-checkbox");
        } else {
            isCheck = true;
            temp.removeToolTipDiv();
			temp.m_selectAll = "Remove All";
            //$(this).attr("title", "Remove All");
            $(this).removeClass("bd-checkbox");
            $(this).addClass("bd-checked");
        }
        
		var filterChipsObj = temp.getFilterChipsComponentObj();
        if (filterChipsObj != undefined){
			filterChipsObj.m_removedChipParentValues = [];
		}
        for (var key in temp.m_checkboxstatus) {
            $("#checklist" + temp.m_componentid + key).attr("checked", isCheck);
            $("#checklist" + temp.m_componentid + key).prop("checked", isCheck);
            temp.m_checkboxstatus[key] = isCheck;
            if(isCheck == false){
		    	var value = key.split('-')[0];
		    	var value1 = value.replace(/_/g, ' ');
		    	value1 = (isNaN(value1)) ? value1 : value1 * 1;
		        if (filterChipsObj != undefined){
		        	var ind = filterChipsObj.m_savedtext.indexOf(value1);
		         	if (ind > -1) {
		         		filterChipsObj.m_savedtext.splice(ind, 1);
		         		//filterChipsObj.m_removedChipValue = value;
		         		filterChipsObj.m_removedChipParentValues.push(value);
		         	}
		        }
		    }
//            var idValue = key;
//            for (var j = 0; j < temp.value.length; j++) {
//            	if (key == getStringARSC(temp.value[j])){
//            		idValue = temp.value[j];
//                	break;
//                }
//            }
            if (IsBoolean(isCheck)) {
                $("#checklist" + temp.m_componentid + key).siblings().css("color", convertColorToHex(temp.m_selectionfontcolor));
//                $("#" + temp.m_componentid + " [value='" + idValue + "']").addClass("selectedFilterLi");
//                $("#" + temp.m_componentid + " [value='" + idValue + "']").css("background-color", convertColorToHex(temp.m_selectioncolor));
                $("#checklist" + temp.m_componentid + key).parent().parent().addClass("selectedFilterLi");
                $("#checklist" + temp.m_componentid + key).parent().parent().css("background-color", convertColorToHex(temp.m_selectioncolor));
            } else {
                $("#checklist" + temp.m_componentid + key).siblings().css("color", convertColorToHex(temp.m_fontcolor));
//                $("#" + temp.m_componentid + " [value='" + idValue + "']").removeClass("selectedFilterLi");
//                $("#" + temp.m_componentid + " [value='" + idValue + "']").css("background-color", temp.m_hexChromeColor);
                $("#checklist" + temp.m_componentid + key).parent().parent().removeClass("selectedFilterLi");
                $("#checklist" + temp.m_componentid + key).parent().parent().css("background-color", temp.m_hexChromeColor);
            }
        }
        $("#textBox" + temp.m_objectid).val(temp.getDisplayValue());
        /**Added to hide OK button when none of the field is selected*/
    	if(IsBoolean(temp.m_hideokbutton)){
    		if(temp.m_selectedindexarray.length > 0){
    			$("#Apply" + temp.m_componentid).show();
    		}else{
    			$("#Apply" + temp.m_componentid).hide();
    		}
    	}else{
    		$("#Apply" + temp.m_componentid).show();
    	}
        $("#Cancel" + temp.m_componentid).show();
    });
   /* $("#Search" + temp.m_componentid).on("click", function() {
        if ($("#SearchTextBox" + temp.m_componentid).is(":visible")) {
            $("#SearchTextBox" + temp.m_componentid).css("display", "none");
            $("#SelectAll" + temp.m_componentid).css("display", "block");
            $("#Cancel" + temp.m_componentid).css("display", "block");
            $("#Apply" + temp.m_componentid).css("display", "block");
        } else {
            $("#SearchTextBox" + temp.m_componentid).css("display", "block").focus().val("");
            $("#SelectAll" + temp.m_componentid).css("display", "none");
            $("#Cancel" + temp.m_componentid).css("display", "none");
            $("#Apply" + temp.m_componentid).css("display", "none");
        }*/
    	this.initSearchBarEvent();
    //});
};
ListFilter.prototype.initSearchBarEvent = function() {
	var temp = this;
	var divid = "InnerContainer" + temp.m_objectid;
	$("#" + divid + " .checkLabeItem").parent().show();
	$("#SearchTextBox" + temp.m_componentid).keyup(function(event) {
	    var criteria = $(event.target).val().toLowerCase();
	    $("#" + divid + " .checkLabeItem").parent().hide();
	    $("#" + divid + " .checkLabeItem").parent().filter(function(ind) {
	        return $(this).find("label").text().toLowerCase().indexOf(criteria) != -1;
	    }).show();
	});
	$("#SearchTextCross"+ temp.m_componentid).click(function(event) {
	   	 $("#SearchTextBox"+ temp.m_componentid).val('');
	   	$("#" + divid + " .checkLabeItem").parent().filter(function(ind) {
	        return $(this).find("label").text().toLowerCase().indexOf("") != -1;
	    }).show();
	});
};
ListFilter.prototype.getActionBarHeight = function() {
	return (IsBoolean(this.m_actionbarenabled)) ? this.m_actionbarheight : 0;
};

/** @description create div element for innerContainer and set property  and return objects. **/
ListFilter.prototype.innerContainerDiv = function() {
    $("#InnerContainer" + this.m_objectid).remove();
    var mainDiv = document.createElement("div");
    mainDiv.style.overflow = "auto";
    mainDiv.setAttribute("id", "InnerContainer" + this.m_objectid);
    mainDiv.style.width = IsBoolean(this.m_enableborder) ? "calc(100% - "+ this.m_listelementproperty.borderWidth*2 +"px)" : "100%";
    if(this.m_designMode){
    	this.m_listelementproperty = {
    	    	"boxShadow": "1px 1px #efefef",
    	    	"borderRadius": "5",
    	    	"borderWidth":"1", 
    	    	"borderStyle": "solid",
    	    	"margin" : "3px 5px 3px 3px"
    	};
    }
    if (IsBoolean(this.m_enableborder)) {
        mainDiv.style.backgroundColor = this.m_hexChromeColor;
    }
    if (IsBoolean(this.m_allowmultipleselection) && !IsBoolean(this.m_enabledualselectionlist)) {
    	var exth=(this.m_showsearch)?(this.m_menupanelrowheight*1 + this.m_searchboxuiobj.margin*2):0;
    	mainDiv.style.height = IsBoolean(this.m_title.m_showtitle)?"calc(100% - "+(1*this.m_title.m_titlebarheight + this.getActionBarHeight()*1 + 3 + exth)+"px)":"calc(100% - "+(this.getActionBarHeight()*1 + 3 + exth) + "px)";
    } else {
    	mainDiv.style.height = IsBoolean(this.m_title.m_showtitle)?"calc(100% - "+(1*this.m_title.m_titlebarheight)+"px)":"100%";
    }
    return mainDiv;
};
ListFilter.prototype.getDisplayValue = function() {
    var selectedValue = "";
    this.m_selectedindexarray  = [];
    for (var j = 0; j < this.value.length; j++) {
        if (IsBoolean(this.m_checkboxstatus[getStringARSC(this.value[j]) +"-"+ j])) { /*BDD-833, To get the data of same magnitude but different sign(Ex. -1 & 1)*/
            selectedValue += this.displayField[j] + ",";
            this.m_selectedindexarray.push(j);
        }
    }
    return selectedValue.substring(0, selectedValue.length - 1);
};
ListFilter.prototype.getValue = function() {
    var selectedValue = "";
    for (var j = 0; j < this.value.length; j++) {
        if (IsBoolean(this.m_checkboxstatus[getStringARSC(this.value[j]) +"-"+ j])) { /*BDD-833, To get the data of same magnitude but different sign(Ex. -1 & 1)*/
            selectedValue += this.value[j] + ",";
        }
    }
    return selectedValue.substring(0, selectedValue.length - 1);
};
/** @description initialize CheckBox ChangeEvent . **/
ListFilter.prototype.initCheckBoxChangeEvent = function() {
    var temp = this;
    $("#ol" + temp.m_componentid + " .multiSelectListcheck").on("change", function(evt) {
        $(this).parent().removeClass("selectedFilterLi");
        $(this).parent().siblings().removeClass("selectedFilterLi");
        var result = [];
        var index = 0;
        $("#ol" + temp.m_componentid + " .multiSelectListcheck").each(function(index, obj) {
            if (obj.checked) {
                $(obj).parent().addClass("selectedFilterLi");
                $(obj).parent().css("background-color", convertColorToHex(temp.m_selectioncolor));
                result.push(index);
            } else {
                $(obj).parent().css("background-color", temp.m_hexChromeColor);
            }
            index++;
        });
        temp.handleMultiSelectionChangeEvent(result);
    });
};

/** @description handled CheckBox ChangeEvent and call updateDataPoint(). **/
ListFilter.prototype.handleOnChangeEvent = function(optionValue, optionText, selectedIndex) {
    var temp = this;
    var fieldName = (temp.getFieldName() == "" || temp.getFieldName() == undefined) ? "Value" : temp.getFieldName();
    var fieldNameValueMap = {};
    if (IsBoolean(temp.m_isDataSetavailable) && (temp.m_seriesData.length > 0)) {
        for (var i = 0; i < temp.m_seriesData[0].length; i++) {
            fieldNameValueMap[temp.getSeriesNames()[i]] = temp.m_seriesData[selectedIndex][i];
        }
        fieldNameValueMap[this.getSeriesNames()] = optionValue;
        fieldNameValueMap[fieldName] = optionValue;
        fieldNameValueMap[this.getCategoryNames()] = optionText;
    } else {
        fieldNameValueMap[fieldName] = ("" + optionValue).replace(/^ +/gm, "");
    }
    temp.updateDataPoints(fieldNameValueMap);
};

/** @description will draw ContainerDiv for listFilter Element. **/
ListFilter.prototype.drawContainerDiv = function() {
    var temp = this;
    $("#" + temp.m_componentid).remove();
    var containerDiv = document.createElement("div");
    containerDiv.setAttribute("id", this.m_componentid);
    containerDiv.style.position = "absolute";
    containerDiv.setAttribute("style", "width:inherit;height:" + temp.m_height + "px;background-color:" + temp.m_hexBackgroundColor + ";");
    containerDiv.style.overflow = "hidden";
    if(IsBoolean(this.m_enableborder)){
    	$("#draggableDiv" + temp.m_objectid).css({"border-width":temp.m_listelementproperty.borderWidth + "px", "border-style": temp.m_listelementproperty.borderStyle,"border-color": temp.m_listbordercolor});
    }
    $("#draggableDiv" + temp.m_objectid).append(containerDiv);
    return containerDiv;
};
/** @description will create 'OL' element and append into container. **/
ListFilter.prototype.addOrderedList = function(containerDiv) {
    var temp = this;
    var oList = document.createElement("ol");
    $(oList).attr("id", "ol" + this.m_componentid);
    $(oList).css("padding", "0px");
    $(oList).css("height", temp.m_height + "px");
    $(oList).css("display", "initial");
    return oList;
};
/** @description used for handle multiSelect property onChange Event. **/
ListFilter.prototype.handleMultiSelectionChangeEvent = function(selectedIndices) {
    var temp = this;
    var fieldName = (temp.getFieldName() == "") ? "Value" : temp.getFieldName();
    var fieldNameValueMap = {};
    var optionValue = "";
    var optionText = "";
    if (IsBoolean(temp.m_isDataSetavailable) && (temp.m_seriesData.length > 0) ) {
        for (var i = 0; i < temp.m_seriesData[0].length; i++) {
            fieldNameValueMap[temp.getSeriesNames()[i]] = "";
            for (var j = 0; j < selectedIndices.length; j++) {
                var selectedIndex = selectedIndices[j];
                optionValue += temp.m_seriesData[selectedIndex][i];
                fieldNameValueMap[temp.getSeriesNames()[i]] += temp.m_seriesData[selectedIndex][i];
                optionText += temp.m_categoryData[selectedIndex][i];
                if (j != selectedIndices.length - 1) {
                    optionText += ",";
                    optionValue += ",";
                    fieldNameValueMap[temp.getSeriesNames()[i]] += ",";
                }
            }
        }
        fieldNameValueMap[fieldName] = optionValue;
        fieldNameValueMap[this.getCategoryNames()] = optionText;
        fieldNameValueMap["selectedIndices"] = selectedIndices;
    }
    temp.updateDataPoints(fieldNameValueMap);
};
/** @description Setter Method to setColor. **/
ListFilter.prototype.setColor = function() {
    var newcolor = "";
    var chromecolor = "";
    if (this.m_backgroundcolor != undefined && this.m_chromecolor != undefined) {
        newcolor = convertColorToHex(this.m_backgroundcolor);
        chromecolor = convertColorToHex(this.m_chromecolor);
    } else {
        newcolor = convertColorToHex("16777215");
        chromecolor = convertColorToHex("16777215");
    }

    this.m_hexBackgroundColor = hex2rgb(newcolor, this.m_bgalpha);
    this.m_hexChromeColor = hex2rgb(chromecolor, this.m_chromecoloropacity);

    //this.m_backgroundcolor = hex2rgb(newcolor, this.m_bgalpha);
    //this.m_chromecolorUpdate = hex2rgb(chromecolor, this.m_chromecoloropacity);
};

function Values() {
    // console.log("inside NividhValues() constructor");
    this.m_label = "";
    this.m_value = "";
    this.m_uncheckedvalue = "";
};

/** @description Getter Method to getValue. **/
Values.prototype.getValue = function() {
    return this.m_value;
};

/** @description Setter Method to getValue. **/
Values.prototype.setValue = function(value) {
    this.m_value = value;
};

/** @description Getter Method to getLabel. **/
Values.prototype.getLabel = function() {
    return this.m_label;
};

/** @description Setter Method of getLabel. **/
Values.prototype.setLabel = function(label) {
    this.m_label = label;
};

/** @description Getter Method of UncheckedValue. **/
Values.prototype.getUncheckedValue = function() {
    return this.m_uncheckedvalue;
};

/** @description Setter Method of UncheckedValue. **/
Values.prototype.setUncheckedValue = function(uncheckValue) {
    this.m_uncheckedvalue = uncheckValue;
};
//# sourceURL=ListFilter.js
