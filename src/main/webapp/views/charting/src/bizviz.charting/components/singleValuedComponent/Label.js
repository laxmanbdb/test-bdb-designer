/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: Label.js
 * @description Label
 **/
function Label(m_chartContainer, m_zIndex) {
	this.base = Widget;
	this.base();

	this.m_text = "";
	this.m_virtualdatafield = "";
	this.m_tooltip = "";
	this.m_datarownumber = "";
	this.m_virtualdataid = "";
	this.m_textdecoration = "";
	this.m_fontweight = "";
	this.m_fontstyle = "";
	this.m_verticalalign = "";
	this.m_fontsize = "";
	this.m_isdynamic = "";
	this.m_backgroundalpha = "";
	this.m_alignmentbaseline = "";
	this.m_fontfamily = "";
	this.m_color = "";
	this.m_textalign = "";
	this.m_backgroundcolor = "";
	this.m_hoverenabled = false;
	this.m_hovercolor = "";
	this.m_bordercolor = "";
	this.m_borderwidth = 0;
    this.m_borderthickness = 0;  
	this.m_editable = false;
	this.m_labelText = "";
	this.m_globalkey = "";
	this.m_fieldvalue = "";
	this.m_borderradius = 0;
	this.m_labelpadding = 0;

	this.m_objectID = [];
	this.m_componentid = "";

	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	/** Label formatter default values*/
	this.m_precision = "default";
	this.m_secondaryunit = "none";
	this.m_unit = "none";
	this.m_signposition = "prefix";
	this.m_formater = "Currency"
	this.m_secondaryformater = "Number";
	this.m_numberformatter = "none";
	
	this.m_tooltipPosition="auto";
	
	this.m_cursortype = "pointer";
};

Label.prototype = new Widget();

Label.prototype.updateWidgetsDataSetValues = function () {
	this.m_labelText = this.m_text;
	if (IsBoolean(this.m_isdynamic)) {
		if (this.m_virtualdatafield != "" && this.m_datarownumber != "") {
			if (this.m_fieldSetValue != "")
				if (this.m_fieldSetValue.m_fieldNameValues[this.m_datarownumber] != undefined)
					if (this.m_fieldSetValue.m_fieldNameValues[this.m_datarownumber][this.m_virtualdatafield] != undefined)
						this.m_labelText = this.m_text = this.m_fieldSetValue.m_fieldNameValues[this.m_datarownumber][this.m_virtualdatafield];
		}
	}
	this.drawObject();
};

Label.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};

Label.prototype.ParseJsonAttributes = function (jsonObject, nodeObject) {
	this.chartJson = jsonObject;
	for (var key in jsonObject) {
		if (key == "Label") {
			for (var labelKey in jsonObject[key]) {
				this.setAttributeValueToNode(labelKey, jsonObject[key], nodeObject);
			}
		} else {
			this.setAttributeValueToNode(key, jsonObject, nodeObject);
		}
	}
};

Label.prototype.setDataProvider = function (data) {
	this.m_labelText = this.m_text = data;
};
Label.prototype.getDataProvider = function () {
	return this.m_labelText;
};
Label.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

Label.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
};
Label.prototype.setDashboardNameAndObjectId = function () {
	this.m_objectId = this.m_objectid;
	if (this.m_objectid.split(".").length == 2){
		this.m_objectid = this.m_objectid.split(".")[1];
	}
	this.m_componentid = "labelDiv" + this.m_objectid;
};
Label.prototype.draw = function () {
	this.drawObject();
};

Label.prototype.drawObject = function () {
	//this.callDrawInit();
	this.init();
	this.drawChart();
	if(this.m_onafterrendercallback!=""){
		onAfterRender(this.m_onafterrendercallback);
	}
};

Label.prototype.init = function () {
	if (!IsBoolean(this.m_isdynamic)){
		this.m_labelText = this.m_text;
	}else if (this.m_virtualdataid == "" || this.m_virtualdatafield == "" || this.m_datarownumber == ""){
		this.m_labelText = this.getValueFromGlobalVariable(this.m_text, "square");
	}else{
		// Do nothing
	}
};

Label.prototype.drawChart = function () {
	if (IsBoolean(this.m_isActive)) {
		this.drawLabel();
	}
};

Label.prototype.drawLabel = function () {
	var temp = this;
	var container = $("#draggableDiv" + temp.m_objectid);

	if ($("#" + temp.m_componentid) != null)
		$("#" + temp.m_componentid).remove();

	var temp1 = this.m_labelText + "";
	var newString = "";
	for (var z = 0; z < temp1.length; z++) {
		if (temp1[z] == " " && temp1[z + 1] == " ")
			newString += "&nbsp;";
		else
			newString += temp1[z];
	}
	this.m_labelText = (newString == "") ? newString : this.getFormattedText(newString);

	var labelObj = document.createElement("span");
	labelObj.setAttribute("id", temp.m_componentid);
	labelObj.setAttribute("class", "LabelComponent");
	labelObj.setAttribute("style","border-color :" +temp.m_bordercolor+ ";border-width :"+temp.m_borderwidth*1+"px;border-style :solid");
	//labelObj.setAttribute("style","width: "+this.m_width+"px;height: "+this.m_height+"px;border: 1px solid black;POSITION: RELATIVE;DISPLAY: TABLE-CELL;VERTICAL-ALIGN: middle;TEXT-ALIGN: CENTER;BACKGROUND-COLOR: antiquewhite;COLOR: black;FONT-FAMILY: cursive;FONT-SIZE: 14PX;width: 150px;height: 100px;border: 1px solid black;POSITION: RELATIVE;DISPLAY: TABLE-CELL;VERTICAL-ALIGN: middle;TEXT-ALIGN: CENTER;BACKGROUND-COLOR: antiquewhite;COLOR: black;FONT-FAMILY: cursive;FONT-SIZE: 14PX;")
	container.css({
		"border-radius": temp.m_borderradius + "px"
		/*"border-color" : temp.m_bordercolor,
        "border-width" : temp.m_borderthickness + "px",
        "border-style" : "solid"*/
	});
	$(labelObj).css({
		"width": this.m_width + "px",
		"height": this.m_height + "px",
		"text-decoration": this.m_textdecoration,
		"font-weight": this.m_fontweight,
		"font-style": this.m_fontstyle,
		"font-size": this.fontScaling(this.m_fontsize * 1) + 'px',
		"font-family": selectGlobalFont(this.m_fontfamily),
		"color": convertColorToHex(temp.m_color),
		"hovercolor":convertColorToHex(temp.m_hovercolor),
		"vertical-align": this.m_verticalalign,
		"cursor": this.m_cursortype,
		"text-align": this.m_textalign,
		"background-color": hex2rgb(convertColorToHex(temp.m_backgroundcolor), this.m_backgroundalpha),
		"display": "TABLE-CELL",
		"position": "relative",
		"border-radius": this.m_borderradius + "px",
		"padding-left" : this.m_labelpadding + "px",
		"padding-right" : this.m_labelpadding + "px"
	});
	
	/**Hover Color**/	    
	if (IsBoolean(this.m_hoverenabled)) {
	    $(labelObj).hover(function() {
	        var hover_color = "#" + temp.m_componentid;
	        if (temp.m_hovercolor == "") {
	            $(hover_color).css("background-color", hex2rgb(convertColorToHex(temp.m_backgroundcolor), temp.m_backgroundalpha));
	        } else {
	            $(hover_color).css("background-color", temp.m_hovercolor);
	        }
	    }, function() {
	        var selectedColor = "#" + temp.m_componentid;
	        $(selectedColor).css("background-color", hex2rgb(convertColorToHex(temp.m_backgroundcolor), temp.m_backgroundalpha));
	    });
	}
	labelObj.innerHTML = this.m_labelText;
	/**Added to rotate label vertical and horizontal positions */
	if (this.m_labeltextrotation == "vertical") {
		$(labelObj).css({
		    "width": this.m_height + "px",
		    "transform-origin": "left top",
		    "transform": "rotate(-90deg) translate(-" + this.m_height + "px, 0px)",
		    "height": this.m_width + "px"
		});
		$(container).css("width", this.m_height); /*DAS-324*/ 
		/*
		$(container).css({
		    "width": this.m_height + "px",
		    "height": this.m_height + "px"
		});
		*/
	}

	labelObj.onclick = (function () {
		if (!IsBoolean(this.m_designMode)) {
			temp.getDataPointAndUpdateGlobalVariable();
		}
	});
	
	 this.checkToolTipDesc = this.updateToolTipInfo(this.m_tooltip);
     var mousemoveFn = function(e) {
         if (!temp.m_designMode && temp.m_tooltip != "" && temp.m_tooltip != " ") {
         	e.stopPropagation();
             temp.removeToolTipDiv();
             var parentDiv = (temp.m_objecttype == "gauge" || temp.m_objecttype == "semigauge") ? document.body : document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
             var scrollLeft = parentDiv.scrollLeft;
             var scrollTop = parentDiv.scrollTop;
             var offset = $(parentDiv).offset();
             var PageTop = 0;//offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
             var PageLeft = 0;//offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft;
             var offsetLeft = $(this)[0].offsetLeft;
             var offsetTop = $(this)[0].offsetTop;
             var divTop = e.pageY - PageTop - offsetTop + 5;
             var divLeft = e.pageX - PageLeft - offsetLeft + 5;
             var tooltipDiv = document.createElement("div");
             tooltipDiv.innerHTML = temp.checkToolTipDesc;
             tooltipDiv.setAttribute("id", "toolTipDiv");
             tooltipDiv.setAttribute("class", "settingIcon");
             tooltipDiv.setAttribute("placement", "bottom");
             if (temp.m_objecttype == "gauge" || temp.m_objecttype == "semigauge") {
                 $(document.body).append(tooltipDiv);
             } else {
                 $(".draggablesParentDiv").append(tooltipDiv);
             }

             /**Commented this for updating enhanced tooltip PLAT-112**/
             /*var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
             	"top": divTop + "px",
             	"left": divLeft + "px"
             });
             $(tooltipDiv).css(tooltipObjCss);*/
             var wd = temp.m_width * 1,
                 ht = temp.m_height * 1;
             var deeptop = (ht > 16) ? 8 + temp.m_tooltipborderwidth : 0;
             var deepleft = (wd > 16) ? 8 + temp.m_tooltipborderwidth : 0;
             var lt,sidemargin = 40,pointerH = 20,pointerW = 38;
             var tolerance = 1;//(temp.m_tooltipborderwidth == 0) ? 1 : 2;
             var left = e.pageX - e.offsetX - PageLeft - offsetLeft;
             var top = (temp.m_objecttype == "gauge" || temp.m_objecttype == "semigauge") ? e.pageY - e.offsetY + ht - PageTop - offsetTop - deeptop : temp.m_top + ht - PageTop - offsetTop - deeptop;
             //if(left + wd + 110 > temp.m_dashboard.m_AbsoluteLayout.m_width * 1 + scrollLeft){
             left = left / 2;
             //}
             var tooltipObjCss = $.extend(temp.getTooltipStyles(), {
                 "top": top + "px",
                 "left": left + "px"
             });
             divTop = temp.m_top * 1 + ht - PageTop - offsetTop;
             $(tooltipDiv).css(tooltipObjCss);
             if (temp.m_objecttype == "gauge" || temp.m_objecttype == "semigauge") {
                 var tp = temp.m_top * 1 + $(comp)[0].offsetHeight - PageTop + "px";
                 $(tooltipDiv).css("top", tp);
                 lt = e.pageX - e.offsetX - (tooltipDiv.offsetWidth / 2) + (($(comp)[0].offsetWidth) / 2) - PageLeft - 8 + "px";
                 divLeft = e.pageX - e.offsetX - (tooltipDiv.offsetWidth / 2) + (($(comp)[0].offsetWidth) / 2) - PageLeft - 8;
             } else {
                 lt = temp.m_left * 1 + (wd / 2) - offsetLeft - ((tooltipDiv.offsetWidth + sidemargin) / 2) + "px";
                 divLeft = temp.m_left * 1 + (wd / 2) - PageLeft - offsetLeft - ((tooltipDiv.offsetWidth + sidemargin) / 2);
             }
             if (!IsBoolean(isTouchEnabled)) {
                 $(tooltipDiv).hover(function() {
                 	temp.m_tooltipremove = false;
                 }, function() {
                 	temp.m_tooltipremove = true;
                     $(tooltipDiv).remove();
                 });
             }
             var rightEdge = $(labelObj).width() + $(labelObj).offset().left;
             /*DAS-180*/
             if(temp.m_labeltextrotation == "vertical") {
            	 /*check if label right side of screen , then change tooltip position to left */
            	 if (rightEdge * 1 > temp.m_dashboard.m_AbsoluteLayout.m_width*1 + scrollLeft) {
 					/*divLeft * 1 + 10 * 1 + $(tooltipDiv).width() * 1;*/
 					temp.m_tooltipPosition="left-middle";   
 				}
            	 else{
            		 temp.m_tooltipPosition="right-middle";
            	 }
            	 }
             
             if (temp.m_tooltipPosition !== "auto") {
                 temp.m_tooltipPosition = temp.m_tooltipPosition.trim();
                 switch (temp.m_tooltipPosition) {
                     case "bottom":
                         $(tooltipDiv).css("left", lt);
                         tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                         break;
                     case "bottom-left":
                    	 var bordertol = (temp.m_tooltipborderwidth == 1) ? 1 : 0;
                         divLeft = temp.m_left * 1 - PageLeft - sidemargin - (pointerW/2) + (wd / 2) - tolerance - bordertol;
                         $(tooltipDiv).css("left", divLeft);
                         tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                         break;
                     case "bottom-right":
                    	 var bordertol = (temp.m_tooltipborderwidth == 1) ? 1 : 0;
                         divLeft = divLeft - ((tooltipDiv.offsetWidth + pointerH) / 2) + sidemargin + (pointerH/2) + bordertol;
                         $(tooltipDiv).css("left", divLeft);
                         tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                         break;
                     case "top":
                         divTop = temp.m_top * 1 - PageTop * 1 + scrollTop * 1 - (tooltipDiv.offsetHeight + sidemargin) + deeptop;
                         $(tooltipDiv).css({
                             "left": lt,
                             "top": divTop
                         });
                         tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                         break;
                     case "top-left":
                    	 var bordertol = (temp.m_tooltipborderwidth == 1) ? 1 : 0;
                         divTop = temp.m_top * 1 - PageTop * 1 + scrollTop * 1 - (tooltipDiv.offsetHeight + sidemargin) + deeptop;
                         divLeft = temp.m_left * 1 - PageLeft - sidemargin - (pointerW/2) + (wd / 2) - tolerance - bordertol;
                         $(tooltipDiv).css({
                             "left": divLeft,
                             "top": divTop
                         });
                         tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                         break;
                     case "top-right":
                    	 var bordertol = (temp.m_tooltipborderwidth == 1) ? 1 : 0;
                         divTop = temp.m_top * 1 - PageTop * 1 + scrollTop * 1 - (tooltipDiv.offsetHeight + sidemargin) + deeptop;// + (temp.m_tooltipborderwidth * 2)
                         divLeft = divLeft - ((tooltipDiv.offsetWidth + pointerH) / 2) + sidemargin + (pointerH/2) + bordertol;
                         $(tooltipDiv).css({
                             "left": divLeft,
                             "top": divTop
                         });
                         tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                         break;
                     case "right-top":
                     case "right-middle":
                         divLeft = temp.m_left * 1 - PageLeft - 50 + (wd / 2);
                         //if (divLeft < 0 && wd / 2 <= 50) {
                         divLeft = temp.m_left * 1 + wd - deepleft;
                         divTop = (temp.m_tooltipPosition.indexOf("top") > 0) ? divTop - (ht / 2) - (pointerH/2) - sidemargin : temp.m_top - PageTop * 1 + scrollTop * 1 + (ht / 2) - ((tooltipDiv.offsetHeight + (temp.m_tooltipborderwidth * 2) + sidemargin) / 2);
                         divTop = (divTop < 0) ? temp.m_top - 20 : divTop;
                         $(tooltipDiv).css({
                             "left": divLeft,
                             "top": divTop
                         });
                         /*} else if (divLeft < -8) {
                             divLeft = 0;
                             $(tooltipDiv).css("left", divLeft);
                         } else {
                             $(tooltipDiv).css("left", divLeft);
                         }*/
                         if (temp.m_tooltipPosition == "right-top") {
                             tooltipDiv.setAttribute("placement", "left-top");
                         } else {
                             tooltipDiv.setAttribute("placement", "left-middle");
                         }
                         //tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                         break;
                     case "right-bottom":
                         divTop = temp.m_top * 1 - PageTop * 1 + scrollTop * 1 - (tooltipDiv.offsetHeight + (temp.m_tooltipborderwidth * 2) + sidemargin) + deeptop;
                         divLeft = temp.m_left * 1 - PageLeft - 50 + (wd / 2);
                         //if (divLeft < 0 && wd / 2 <= 50) {
                         divLeft = temp.m_left * 1 + wd - deepleft;
                         //divTop = (temp.m_tooltipPosition.indexOf("top") > 0) ? divTop + 40 + (ht / 2) : temp.m_top - PageTop * 1 + scrollTop * 1 - (tooltipDiv.offsetHeight / 2);
                         divTop = divTop + 40 + 10 + (ht / 2) - 8;
                         divTop = (divTop < 0) ? temp.m_top * 1 - 18 : divTop;
                         $(tooltipDiv).css({
                             "left": divLeft,
                             "top": divTop
                         });
                         /*} else if (divLeft < -8) {
                             divLeft = 0;
                             $(tooltipDiv).css("left", divLeft);
                         } else {
                             $(tooltipDiv).css("left", divLeft);
                         }*/
                         tooltipDiv.setAttribute("placement", "left-bottom");
                         break;
                     case "left-top":
                     case "left-middle":
                         divLeft = divLeft - ((tooltipDiv.offsetWidth + 20) / 2) + 50;
                         //if (divLeft + (tooltipDiv.offsetWidth + sidemargin) > temp.m_dashboard.m_AbsoluteLayout.m_width * 1 + scrollLeft) {
                         divLeft = divLeft - (wd / 2) - 40 - 2 - 18 + deepleft;
                         divTop = (temp.m_tooltipPosition.indexOf("top") > 0) ? divTop - (ht / 2) - (pointerH/2) - sidemargin : temp.m_top - PageTop * 1 + scrollTop * 1 + (ht / 2) - ((tooltipDiv.offsetHeight + (temp.m_tooltipborderwidth * 2) + sidemargin) / 2);
                         divTop = (divTop < 0) ? temp.m_top * 1 - 20 : divTop;
                         $(tooltipDiv).css({
                             "left": divLeft,
                             "top": divTop
                         });
                         /*} else {
                             $(tooltipDiv).css("left", divLeft);
                         }*/
                         if (temp.m_tooltipPosition == "left-top") {
                             tooltipDiv.setAttribute("placement", "right-top");
                         } else {
                             tooltipDiv.setAttribute("placement", "right-middle");
                         }
                         //tooltipDiv.setAttribute("placement", temp.m_tooltipPosition);
                         break;
                     case "left-bottom":
                    	 divTop = temp.m_top * 1 - PageTop * 1 + scrollTop * 1 - (tooltipDiv.offsetHeight + (temp.m_tooltipborderwidth * 2) + sidemargin) + deeptop;
                         divLeft = divLeft - ((tooltipDiv.offsetWidth + 20) / 2) + 50;
                         //if (divLeft + (tooltipDiv.offsetWidth + sidemargin) > temp.m_dashboard.m_AbsoluteLayout.m_width * 1 + scrollLeft) {
                         divLeft = divLeft - (wd / 2) - 40 - 2 - 18 + deepleft;
                         //divTop = (temp.m_tooltipPosition.indexOf("top") > 0) ? divTop + 40 + 10 + (ht / 2) : divTop - (ht / 2) - ((tooltipDiv.offsetHeight + 18) / 2) - 8;
                         divTop = divTop + 40 + 10 + (ht / 2) - 8;
                         divTop = (divTop < 0) ? temp.m_top * 1 - 18 : divTop;
                         $(tooltipDiv).css({
                             "left": divLeft,
                             "top": divTop
                         });
                         /*} else {
                             $(tooltipDiv).css("left", divLeft);
                         }*/
                         tooltipDiv.setAttribute("placement", "right-bottom");
                         break;
                     default:
                         temp.removeToolTipDiv();
                         alertPopUpModal({
                             type: "warning",
                             message: "Please choose the correct tooltip position",
                             timeout: '3000'
                         });
                         console.log("Please choose the correct tooltip position");
                         break;
                 }

             } else {
                 var pos_top = "bottom";
                 var pos_left = "";
                 var bordertol = (temp.m_tooltipborderwidth == 1) ? 1 : 0;

                 /** Adjust if going out of boundary **/
                 var tp = e.pageY - e.offsetY + PageTop;
                 if (tp + ht + 10 * 1 + (tooltipDiv.offsetHeight * 1) + 20 - deeptop > window.pageYOffset + window.innerHeight) {
                     divTop = temp.m_top * 1 - PageTop * 1 + scrollTop * 1 - ((tooltipDiv.offsetHeight * 1) + sidemargin) + deeptop;
                     $(tooltipDiv).css("top", divTop);
                     pos_top = "top";
                 }
                 if ((divLeft + (tooltipDiv.offsetWidth + sidemargin)) < temp.m_dashboard.m_AbsoluteLayout.m_width * 1 + scrollLeft) {
                     $(tooltipDiv).css("left", lt);
                 } else {
                     divLeft = divLeft - ((tooltipDiv.offsetWidth + 20) / 2) + 50; // + 18;
                     //40 is for adding right value of the pointer
                     if (divLeft + (tooltipDiv.offsetWidth + sidemargin) > temp.m_dashboard.m_AbsoluteLayout.m_width * 1 + scrollLeft) {
                         //divLeft = divLeft - ((divLeft + ($(tooltipDiv).width() + 66)) - temp.m_dashboard.m_AbsoluteLayout.m_width) - wd - 20;
                         divLeft = divLeft - (wd / 2) - sidemargin - (temp.m_tooltipborderwidth * 2) - 20 + deepleft;
                         //40 is for removing  right value of the pointer value, 2 for border width, 18 for pointer width
                         //divTop = (pos_top == "top") ? divTop + 40 + (ht / 2) : temp.m_top - PageTop * 1 + scrollTop * 1 - (tooltipDiv.offsetHeight / 2);
                         divTop = (pos_top == "top") ? divTop + sidemargin + (ht / 2) : temp.m_top - PageTop * 1 + scrollTop * 1 + (ht / 2) - ((tooltipDiv.offsetHeight + (temp.m_tooltipborderwidth * 2) + sidemargin)/ 2) + tolerance;
                         pos_left = (divTop < 0) ? "top" : "middle";
                         divTop = (pos_left == "top") ? temp.m_top - PageTop * 1 + scrollTop * 1 - sidemargin - (pointerH/2) + (ht / 2) : divTop - tolerance;
                         divTop = (divTop < -20) ? temp.m_top * 1 - (sidemargin/2) : divTop;
                         pos_left = (pos_top == "top") ? "bottom" : ((pos_left == "middle") ? pos_left : "top");
                         pos_top = "right";
                         if(pos_left == "bottom"){
                          	divTop = divTop + (tolerance * 2);
                          }
                         divTop = (pos_left == "bottom") ? (divTop + tolerance) : divTop;
                         divTop = (pos_left == "top" && temp.m_tooltipborderwidth == 1) ? divTop - tolerance :((pos_left == "middle" && temp.m_tooltipborderwidth == 1) ? divTop + 1 : divTop);
                         $(tooltipDiv).css({
                             "left": divLeft,
                             "top": divTop
                         });
                     } else {
                     	 divLeft = divLeft + bordertol;
                         $(tooltipDiv).css("left", divLeft);
                         pos_left = "right";
                     }
                 }

                 if ((temp.m_left - PageLeft + (wd / 2) + 10 * 1 - (($(tooltipDiv).width() + 66) / 2) < 0) && (temp.m_objecttype !== "gauge" || temp.m_objecttype !== "semigauge")) {
                     divLeft = temp.m_left * 1 - PageLeft - 50 + (wd / 2);
                     if (divLeft < 0 && wd / 2 <= 50) {
                         divLeft = temp.m_left * 1 + wd - deepleft;
                         divTop = (pos_top == "top") ? divTop + sidemargin + (ht / 2) : temp.m_top * 1 - PageTop * 1 + scrollTop * 1 + (ht / 2) - ((tooltipDiv.offsetHeight + (temp.m_tooltipborderwidth * 2) + sidemargin)/ 2) + tolerance;
                         pos_left = (divTop < 0) ? "top" : "middle";
                         divTop = (pos_left == "top") ? temp.m_top * 1 - PageTop * 1 + scrollTop * 1 - sidemargin - (pointerH/2) + (ht / 2) : divTop - tolerance;
                         divTop = (divTop < -20) ? temp.m_top * 1 - (sidemargin/2) : divTop;
                         pos_left = (pos_top == "top") ? "bottom" : ((pos_left == "middle") ? pos_left : "top");
                         pos_top = "left";
                         if(pos_left == "bottom"){
                         	divTop = divTop + (tolerance * 2);
                         }
                         divTop = (pos_left == "bottom") ? (divTop + tolerance) : divTop;
                         divTop = (pos_left == "top" && temp.m_tooltipborderwidth == 1) ? divTop - tolerance :((pos_left == "middle" && temp.m_tooltipborderwidth == 1) ? divTop + 1 : divTop);
                         $(tooltipDiv).css({
                             "left": divLeft,
                             "top": divTop
                         });
                     } else if (divLeft < -8) {
                         divLeft = 0;
                         $(tooltipDiv).css("left", divLeft);
                         pos_left = "left";
                     } else {
                    	 divLeft = divLeft - (pointerH/2) - bordertol;
                         $(tooltipDiv).css("left", divLeft);
                         pos_left = "left";
                     }
                 }
                 var position = (pos_left == "") ? pos_top : pos_top + "-" + pos_left;
                 tooltipDiv.setAttribute("placement", position);
             }
         }
     };
     var mouseoutFn = function(e) {
    	 //setTimeout(function(){
     		temp.removeToolTipDiv();
     	//}, 1);
     };
     if(!IsBoolean(temp.m_designMode) && temp.m_tooltip != "" && temp.m_tooltip.trim() != " "){
    	 $(labelObj).mouseenter(function (e) {
    			mousemoveFn.bind(this)(e);
    	 })
    		.mouseout(function (e) {
    			mouseoutFn.bind(this)(e);
    	 })
     }

	$(container).append(labelObj);
};
Label.prototype.getDataPointAndUpdateGlobalVariable = function () {
	//	if(this.m_fieldvalue!=""){
	var fieldNameValueMap = {};
	var fieldname = (this.m_fieldname == "" || this.m_fieldname == undefined) ? "Value" : this.m_fieldname;
	fieldNameValueMap[fieldname] = this.m_fieldvalue;
	this.updateDataPoints(fieldNameValueMap);
	//	}
};
Label.prototype.getFormattedText = function(value) {
    // This case added for old Dashboards 
	if (!this.isFormattedValue()) {
		return value;
	} else {
	    if (!isNaN(getNumericComparableValue(value))) {
	        // added check for value is number or not otherwise return same string value
	        //var isCommaSeparated = (("" + value).indexOf(",") > 0) ? true : false;
	        var signPosition = (this.m_signposition != "") ? this.m_signposition : "suffix";
	        var precision = this.m_precision;
	        var unit = this.m_unit;
	        var secondUnit = this.m_secondaryunit;
	        var formatter = this.m_formater;
	        var secondFormatter = this.m_secondaryformater;
	        var valueToBeFormatted = (precision === "default") ?
	            (getNumericComparableValue(value) * 1) :
	            (getNumericComparableValue(value) * 1).toFixed(precision);
	        if (unit != "") {
	            var formatterSymbol = this.m_util.getFormatterSymbol(formatter, unit);
	            var secondFormatterSymbol = this.m_util.getFormatterSymbol(secondFormatter, secondUnit);
	            /* To Add Number formatter */
	            if (secondFormatterSymbol == "auto") {
	                value = getNumericComparableValue(value);
	                var symbol = getNumberFormattedSymbol(value * 1, unit);
	                var val = getNumberFormattedNumericValue(value * 1, precision, unit);
	                var text = this.m_util.updateTextWithFormatter(val, "", precision);
	                valueToBeFormatted = this.m_util.addFormatter(text, symbol, "suffix");
	            } else {
	                var unitSymbol = secondFormatterSymbol;
	                valueToBeFormatted = this.m_util.updateTextWithFormatter(valueToBeFormatted, unitSymbol, precision);
	                if (secondFormatterSymbol != "none" && secondFormatterSymbol != "" && secondFormatterSymbol != "") {
	                    valueToBeFormatted = this.m_util.addFormatter(valueToBeFormatted, secondFormatterSymbol, "suffix");
	                }
	            }
	            /* To add Currency formatter */
	            valueToBeFormatted = (valueToBeFormatted == "NaN" || valueToBeFormatted === "") ? "" : this.m_util.addFormatter(getFormattedNumberWithCommas(valueToBeFormatted, this.m_numberformatter) , formatterSymbol, signPosition);
	            return valueToBeFormatted;
	        } else {
	            return (valueToBeFormatted == "NaN") ? value : valueToBeFormatted;
	        }
	    } else {
	    	return value;
	    }
	}
};
Label.prototype.isFormattedValue = function() {
	if (this.m_numberformatter == "none" && this.m_secondaryunit == "none" && this.m_unit == "none") {
		return false;
	} else {
		return true;
	}
};
//# sourceURL=Label.js