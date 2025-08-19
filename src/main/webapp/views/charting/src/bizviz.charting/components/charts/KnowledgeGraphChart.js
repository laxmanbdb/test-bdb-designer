/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: KnowledgeGraphChart.js
 * @description KnowledgeGraphChart
 **/
function KnowledgeGraphChart(m_chartContainer, m_zIndex) {
	this.base = Chart;
	this.base();
	this.m_chartContainer = m_chartContainer;
	this.m_zIndex = m_zIndex;
	this.m_x = 680;
	this.m_y = 320;
	
	this.m_axistoitemmargin = 15;
	this.m_marginbetweenitem = 5;
	this.m_filtertextcolor = "#000000";
	this.m_maxnodes = 5;
	this.m_hierarchiallayuot = "false";
	this.m_hierarchydirection = "UD";
	this.m_fixed = "false";
	this.m_nodeshape = "dot"; 
	this.m_nodecolor = "#EEEEEE";
	this.m_nodesize = "50";
    this.m_nodebordercolor = "#EEEEEE";
    this.m_nodehovercolor = "#EEEEEE"
	this.m_nodeopacity = "1";
	this.m_nodefontcolor = "#000000";
	this.m_nodefontsize = "12";
	this.m_nodefontstyle = "normal";
	this.m_nodefontweight = "normal";
	this.m_nodefontfamily = "BizvizFont";
	this.m_nodetextalign = "left";
	this.m_edgecolorinherit = "default";
	this.m_edgecolor = "#000000";
	this.m_edgefontcolor = "#00000get0";
	this.m_edgefontsize = "12";
	this.m_edgefontstyle = "normal";
	this.m_edgefontweight = "normal";
	this.m_edgefontfamily = "BizvizFont";
	this.m_edgelabelalign = "horizontal";	
	this.m_edgelabelpadding = "0";
	this.m_showarrows = "true";
	this.m_dashededge = "false";
	this.m_usecustomshapes = "false";
    this.m_usecustomcolors = "false";
    this.m_shapeindicatortype = "type";
	this.m_colorindicatortype = "type";
    this.m_customnodetypecolors = "#E08283,#38d3a9,#797979";
    this.m_customnoderangecolors = "#E08283,#38d3a9,#797979";
	this.m_customnodetypeshapes = "dot,box,ellipsis";
	this.m_customnoderangeshapes = "dot,box,ellipsis";
	this.m_customnodelevelshapes = "dot,box,ellipsis";
	this.m_customnodelevelcolors = "#E08283,#38d3a9,#797979";
	this.m_customshaperange = "";
	this.m_customcolorrange = "";
	this.m_nodetypes = "Type1,Type2,Type3";
	this.m_colortypes = "Type1,Type2,Type3";
	this.m_shapelevel = "Level1,Level2,Level3";
	this.m_colorLevel = "Level1,Level2,Level3";
	this.m_filterbgcolor = "#FFFFFF";
	this.m_filterfontcolor = "#000000";
	this.m_filterlabelcolor = "#000000";
	this.filterdatavalue = "";//DAS-942 
	this.nodeFilterValue = "Node Name";
};

/** @description Making prototype of chart class to inherit its properties and methods into KnowledgeGraph chart **/
KnowledgeGraphChart.prototype = new Chart();

/** @description This method will parse the chart JSON and create a container **/
KnowledgeGraphChart.prototype.setProperty = function (chartJson) {
	this.ParseJsonAttributes(chartJson.Object, this);
	this.initCanvas();
};
/** @description Iterate through chart JSON and set class variable values with JSON values **/
KnowledgeGraphChart.prototype.ParseJsonAttributes = function (jsonObject,
	nodeObject) {
	for (var key in jsonObject) {
		if (key == "Chart") {
			for (var chartKey in jsonObject[key]) {
				switch (chartKey) {
				case "Title":
					for (var titleKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(titleKey);
						nodeObject.m_title[propertyName] = jsonObject[key][chartKey][titleKey];
					}
					break;
				case "SubTitle":
					for (var subTitleKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(subTitleKey);
						nodeObject.m_subTitle[propertyName] = jsonObject[key][chartKey][subTitleKey];
					}
					break;
				case "TaskDetails":
					for (var taskDetailsKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(taskDetailsKey);
						nodeObject[propertyName] = jsonObject[key][chartKey][taskDetailsKey];
					}

					break;
				case "MileStoneDetails":
					for (var mileStoneDetailsKey in jsonObject[key][chartKey]) {
						var propertyName = this.getNodeAttributeName(mileStoneDetailsKey);
						nodeObject[propertyName] = jsonObject[key][chartKey][mileStoneDetailsKey];
					}
					break;

				default:
					var propertyName = this.getNodeAttributeName(chartKey);
					nodeObject[propertyName] = jsonObject[key][chartKey];
					break;
				}
			}
		} else {
			var propertyName = this.getNodeAttributeName(key);
			nodeObject[propertyName] = jsonObject[key];
		}
	}
};

/** @description Getter Method of DataProvider **/
KnowledgeGraphChart.prototype.getDataProvider = function () {
	return this.m_dataProvider;
};
/** @description remove already present div of component and create new div & canvas, associate the properties and events **/
KnowledgeGraphChart.prototype.initCanvas = function () {
	var temp = this;
	$("#draggableDiv" + temp.m_objectid).remove();
	this.initializeDraggableDivAndCanvas();
};

/** @description Creating Draggable Div and Canvas **/
KnowledgeGraphChart.prototype.initializeDraggableDivAndCanvas = function (dashboardName, zindex) {
	this.setDashboardNameAndObjectId();
	this.m_draggableDiv = this.createDraggableDiv(this.m_chartContainer, this.m_zIndex);
	this.createDraggableCanvas(this.m_draggableDiv);
//	if(this.m_designMode){
//		var innerDiv = this.createInnerDiv(this.m_draggableDiv);
//		this.createVisTimeline(innerDiv);
//	}else{
//		this.createVisTimeline(this.m_draggableDiv);
//	}
	this.setCanvasContext();
	this.initMouseClickEvent();
};
/** @description for adding a div when project timline is not moving in canvas **/
KnowledgeGraphChart.prototype.createInnerDiv = function (container) {
	var div = document.createElement("div");
	div.style.width = "100%";
	div.style.height = "100%";
	div.style.zIndex = "" + 3;
	div.style.top = 0 + "px";
	div.style.position = "absolute";
	div.style.background = "transparent";
	$(container).append(div);
	var innerDiv = document.createElement("div");
	innerDiv.setAttribute("id", "innerDiv"  + this.m_objectid);
	innerDiv.style.height = "100%";
	innerDiv.style.width = "100%";
	innerDiv.style.top = 0 + "px";
	innerDiv.style.position = "absolute";
	innerDiv.style.zIndex = "" + 2;
	$(container).append(innerDiv);
	return innerDiv;
};
/** @description Setting Category,Series,Calculated fields into seriesJSON array **/
KnowledgeGraphChart.prototype.setFields = function (fieldsJson) {
	this.m_fieldsJson = fieldsJson;
	var sourceJson = [];
	var targetJson = [];
	var edgeJson = [];
	var typeJson = [];
	var valueJson = [];
	var nodeSizeJson = [];
	for (var i = 0, length = fieldsJson.length; i < length; i++) {
		var fieldType = this.getProperAttributeNameValue(fieldsJson[i], "Type");
		switch (fieldType) {
		case "Source":
			sourceJson.push(fieldsJson[i]);
			break;
		case "Target":
			targetJson.push(fieldsJson[i]);
			break;
		case "Edge":
			edgeJson.push(fieldsJson[i]);
			break;
		case "Nodevalue":
			valueJson.push(fieldsJson[i]);
			break;
		case "NodeSize":
			nodeSizeJson.push(fieldsJson[i]);
			break;
		case "Nodetype":
			typeJson.push(fieldsJson[i]);
			break;
		}
	}
	this.setSource(sourceJson);
	this.setTarget(targetJson);
	this.setEdge(edgeJson);
	this.setType(typeJson);
	this.setValue(valueJson);
	this.setNodeSize(nodeSizeJson);
};
/** @description Setter Method of Category iterate for all category. **/
KnowledgeGraphChart.prototype.setSource = function (sourceJson) {
	this.m_sourceNames = [];
	this.m_sourceDisplayNames = [];
	this.m_allSourceNames = [];
	this.m_allSourceDisplayNames = [];
	this.m_sourceVisibleArr = [];
	var count = 0;

	for (var i = 0; i < sourceJson.length; i++) {
		this.m_allSourceNames[i] = this.getProperAttributeNameValue(sourceJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(sourceJson[i], "DisplayName"));
		this.m_allSourceDisplayNames[i] = m_formattedDisplayName;
		this.m_sourceVisibleArr[this.m_allSourceDisplayNames[i]] = this.getProperAttributeNameValue(sourceJson[i], "visible");
		if (IsBoolean(this.m_sourceVisibleArr[this.m_allSourceDisplayNames[i]])) {
			this.m_sourceNames[count] = this.getProperAttributeNameValue(sourceJson[i], "Name");
			this.m_sourceDisplayNames[count] = m_formattedDisplayName;
			count++;
		}
	}
};
/** @description Setter Method of Series iterate for all series. **/
KnowledgeGraphChart.prototype.setTarget = function (targetJson) {
	this.m_targetNames = [];
	this.m_targetDisplayNames = [];
	this.m_allTargetNames = [];
	this.m_allTargetDisplayNames = [];
	this.m_targetVisibleArr = [];
	var count = 0;

	for (var i = 0; i < targetJson.length; i++) {
		this.m_allTargetNames[i] = this.getProperAttributeNameValue(targetJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(targetJson[i], "DisplayName"));
		this.m_allTargetDisplayNames[i] = m_formattedDisplayName;
		this.m_targetVisibleArr[this.m_allTargetDisplayNames[i]] = this.getProperAttributeNameValue(targetJson[i], "visible");
		if (IsBoolean(this.m_targetVisibleArr[this.m_allTargetDisplayNames[i]])) {
			this.m_targetNames[count] = this.getProperAttributeNameValue(targetJson[i], "Name");
			this.m_targetDisplayNames[count] = m_formattedDisplayName;
			count++;
		}
	}
};
/** @description Setter method for set StartValue. **/
KnowledgeGraphChart.prototype.setEdge = function (edgeJson) {
	this.m_edgeNames = [];
	this.m_edgeDisplayNames = [];
	this.m_allEdgeNames = [];
	this.m_allEdgeDisplayNames = [];
	this.m_edgeVisibleArr = [];
	var count = 0;

	for (var i = 0; i < edgeJson.length; i++) {
		this.m_allEdgeNames[i] = this.getProperAttributeNameValue(edgeJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(edgeJson[i], "DisplayName"));
		this.m_allEdgeDisplayNames[i] = m_formattedDisplayName;
		this.m_edgeVisibleArr[this.m_allEdgeDisplayNames[i]] = this.getProperAttributeNameValue(edgeJson[i], "visible");
		if (IsBoolean(this.m_edgeVisibleArr[this.m_allEdgeDisplayNames[i]])) {
			this.m_edgeNames[count] = this.getProperAttributeNameValue(edgeJson[i], "Name");
			this.m_edgeDisplayNames[count] = m_formattedDisplayName;
			count++;
		}
	}
};
/** @description Setter Method of Node Value. **/
KnowledgeGraphChart.prototype.setValue = function (valueJson) {
	this.m_valueNames = [];
	this.m_valueDisplayNames = [];
	this.m_allValueNames = [];
	this.m_allValueDisplayNames = [];
	this.m_valueVisibleArr = [];
	var count = 0;

	for (var i = 0; i < valueJson.length; i++) {
		this.m_allValueNames[i] = this.getProperAttributeNameValue(valueJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(valueJson[i], "DisplayName"));
		this.m_allValueDisplayNames[i] = m_formattedDisplayName;
		this.m_valueVisibleArr[this.m_allValueDisplayNames[i]] = this.getProperAttributeNameValue(valueJson[i], "visible");
		if (IsBoolean(this.m_valueVisibleArr[this.m_allValueDisplayNames[i]])) {
			this.m_valueNames[count] = this.getProperAttributeNameValue(valueJson[i], "Name");
			this.m_valueDisplayNames[count] = m_formattedDisplayName;
			count++;
		}
	}
};
/** @description Setter Method of Node Type. **/
KnowledgeGraphChart.prototype.setType = function (typeJson) {
	this.m_typeNames = [];
	this.m_typeDisplayNames = [];
	this.m_allTypeNames = [];
	this.m_allTypeDisplayNames = [];
	this.m_typeVisibleArr = [];
	var count = 0;

	for (var i = 0; i < typeJson.length; i++) {
		this.m_allTypeNames[i] = this.getProperAttributeNameValue(typeJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(typeJson[i], "DisplayName"));
		this.m_allTypeDisplayNames[i] = m_formattedDisplayName;
		this.m_typeVisibleArr[this.m_allTypeDisplayNames[i]] = this.getProperAttributeNameValue(typeJson[i], "visible");
		if (IsBoolean(this.m_typeVisibleArr[this.m_allTypeDisplayNames[i]])) {
			this.m_typeNames[count] = this.getProperAttributeNameValue(typeJson[i], "Name");
			this.m_typeDisplayNames[count] = m_formattedDisplayName;
			count++;
		}
	}
};
/** @description Setter Method of Node Size. **/
KnowledgeGraphChart.prototype.setNodeSize = function (typeJson) {
	this.m_nodeSizeNames = [];
	this.m_nodeSizeDisplayNames = [];
	this.m_allNodeSizeNames = [];
	this.m_allNodeSizeDisplayNames = [];
	this.m_nodeSizeVisibleArr = [];
	var count = 0;

	for (var i = 0; i < typeJson.length; i++) {
		this.m_allNodeSizeNames[i] = this.getProperAttributeNameValue(typeJson[i], "Name");
		var m_formattedDisplayName = this.formattedDescription(this, this.getProperAttributeNameValue(typeJson[i], "DisplayName"));
		this.m_allNodeSizeDisplayNames[i] = m_formattedDisplayName;
		this.m_nodeSizeVisibleArr[this.m_allNodeSizeDisplayNames[i]] = this.getProperAttributeNameValue(typeJson[i], "visible");
		if (IsBoolean(this.m_nodeSizeVisibleArr[this.m_allNodeSizeDisplayNames[i]])) {
			this.m_nodeSizeNames[count] = this.getProperAttributeNameValue(typeJson[i], "Name");
			this.m_nodeSizeDisplayNames[count] = m_formattedDisplayName;
			count++;
		}
	}
};
/** @description Getter method of  Source Names. **/
KnowledgeGraphChart.prototype.getSourceNames = function () {
	return this.m_sourceNames;
};
/** @description Getter method of  Value Names. **/
KnowledgeGraphChart.prototype.getValueNames = function () {
	return this.m_valueNames;
};
/** @description Getter method of  Target Names. **/
KnowledgeGraphChart.prototype.getTargetNames = function () {
	return this.m_targetNames;
};
/** @description Getter method of  Edge Names. **/
KnowledgeGraphChart.prototype.getEdgeNames = function () {
	return this.m_edgeNames;
};
/** @description Getter method of  Type Names. **/
KnowledgeGraphChart.prototype.getTypeNames = function () {
	return this.m_typeNames;
};
/** @description Getter method of  Type Names. **/
KnowledgeGraphChart.prototype.getNodeSizeNames = function () {
	return this.m_nodeSizeNames;
};
/** @description Getter method of All StartValueNames. **/
KnowledgeGraphChart.prototype.getAllEdgeNames = function () {
   return this.m_allEdgeNames;
};
/** @description Getter method of All Series Names. **/
KnowledgeGraphChart.prototype.getAllTargetNames = function () {
	return this.m_allTargetNames;
};
/** @description Getter method of All Category Names. **/
KnowledgeGraphChart.prototype.getAllSourceNames = function () {
	return this.m_allSourceNames;
};
/** @description Getter method of All Type Names. **/
KnowledgeGraphChart.prototype.getAllTypeNames = function () {
	return this.m_allTypeNames;
};
/** @description Getter method of All Value Names. **/
KnowledgeGraphChart.prototype.getAllValueNames = function () {
	return this.m_allValueNames;
};
/** @description Getter method of All Value Names. **/
KnowledgeGraphChart.prototype.getAllNodeSizeNames = function () {
	return this.m_allNodeSizeNames;
};
/** @description initialization of KnowledgeGraphChart **/
KnowledgeGraphChart.prototype.init = function () {
	this.setSourceData();	
	this.setTargetData();
	this.setEdgeData();
	this.setValueData();
	this.setTypeData();
	this.setNodeSizeData();
	this.setAllFieldsName();
	this.isSeriesDataEmpty();
	//this.setAllFieldsDisplayName();
	//this.setRangeColors();
	this.getDataItems();

	this.m_chartFrame.init(this);
	this.m_tooltip.init(this);
	this.m_title.init(this);
	this.m_subTitle.init(this);
	this.initializeCalculation();
};
KnowledgeGraphChart.prototype.drawMessage = function(text) {	
	$("#textcanvas" + this.m_objectid).remove();
	/*this.ctx.clearRect(this.m_x * 1 + (this.m_width - this.ctx.measureText(text).width) / 2 - 100, this.m_y * 1 + this.m_height / 2 - 100, 250, 250);
	this.ctx.beginPath();
	this.ctx.fillStyle = convertColorToHex(this.m_statuscolor);
	this.ctx.font = this.m_statusfontsize + "px " + selectGlobalFont(this.m_statusfontfamily);
	this.ctx.textAlign = "left";
	var textWidth = this.ctx.measureText(text).width;
	var margin = this.m_width - textWidth;
	this.ctx.fillText(text, this.m_x * 1 + margin / 2, this.m_y * 1 + this.m_height / 2);
	this.ctx.fill();
	this.ctx.closePath();*/
	var textWidth = this.ctx.measureText(text).width;//DAS-942 the error message in knowledge graph is not center aligned
	var canvas = document.createElement("div");
	canvas.setAttribute("id", "textcanvas" + this.m_objectid);
	canvas.width = "250";
	canvas.height = "250";
	//canvas.style.display = "none";
	canvas.style.background = "transparent";
	canvas.style.position = "absolute";
	canvas.style.color = convertColorToHex(this.m_statuscolor);
	canvas.style.fontSize = this.m_statusfontsize + "px ";
	canvas.style.fontFamily = selectGlobalFont(this.m_statusfontfamily);
	canvas.style.left = this.m_width/2 * 1 + "px";
	canvas.style.top = this.m_height/2 * 1 + "px";
	canvas.style.left = ((this.m_width - textWidth) / 2 + 30) + "px";//DAS-942 the error message in knowledge graph is not center aligned
	$("#draggableDiv" + this.m_objectid).append(canvas);
	canvas.innerHTML = text;
};
/** description drawing of chart started by drawing  different parts of chart like Chartframe,Title,Subtitle **/
KnowledgeGraphChart.prototype.drawChart = function() {
    var temp = this;
    this.drawChartFrame();
    this.drawTitle();
    this.drawSubTitle();
    var map = this.IsDrawingPossible();
    if (IsBoolean(map.permission)) {
		/**DAS-1158 */
		if(this.m_sourceData[0].length>0){
        this.createFilterContainer();
        var mainDiv = this.drawKnowledgeGraph();
        this.drawGraph(mainDiv);		
         this.createFilterContainer();	//DAS-942 Maximize chart without refreshing data.
        }else{
			$("#filterDiv" + temp.m_objectid).remove(); 
			$("#chartDiv" + temp.m_objectid).remove();
			$("#reseticon" + temp.m_objectid).remove();
			this.drawMessage(this.m_status.noData);
		}
    } else {
        this.drawMessage(map.message);
    }
};
KnowledgeGraphChart.prototype.getIconCode = function(name) {
    var temp = this;
    var icondiv = "<div class=" + name + " style='position:absolute;height:10px;width:10px;'></div>";
    $("#draggableDiv" + temp.m_objectid).append(icondiv);
    var style = getComputedStyle(document.querySelector("." + name), '::before').content;
    var char = style.charCodeAt(1).toString(16);
    var code = String.fromCodePoint(parseInt(char, 16));
    $("." + name).remove();
    return code;
};
KnowledgeGraphChart.prototype.drawGraph = function() {
    var temp = this;
    $("#reseticon" + temp.m_objectid).remove();
    var container = document.getElementById("chartDiv" + temp.m_objectid);
    var nodeData = temp.m_nodeData;
       
   /* commenting since limited nodes are not requied
    /******** Calculate minimum number of child nodes per node 
    var lmdata = Array.from(temp.m_edgeData);
    var uniqueFrom = Array.from(new Set(lmdata.map(obj => obj.from)));
    var threshold = temp.m_maxnodes;
    var splicedObjects = {};
    var chck = [];
    temp.addnodes = [];
    uniqueFrom.forEach(fromValue => {
        var fromObjects = lmdata.filter(obj => obj.from === fromValue);
        if (fromObjects.length > threshold) {
            var spliced = lmdata.splice(lmdata.findIndex(obj => obj.from === fromValue), fromObjects.length - threshold);
            var toValues = lmdata.reduce((acc, obj) => {
                acc.push(obj.to);
                return acc;
            }, []);
            spliced.map(function(a) {
                if (toValues.indexOf(a.to) < 0) {
                    var index = nodeData.indexOf(nodeData.find(ele => ele.id == a.to));
                    if (index > -1) {
                        (temp.addnodes).push(nodeData.splice(index, 1)[0]);
                    }
                }
            });
            splicedObjects[fromValue] = spliced;
        }
    }); 

    temp.limitedvisedges = lmdata;
    temp.addvisedges = splicedObjects;

    temp.visnodes = new vis.DataSet(temp.m_nodeData);
    temp.visedges = new vis.DataSet(temp.limitedvisedges); */
    
    var nodeData = temp.m_nodeData.map(function(_nodeElement) {
        return Object.assign({}, _nodeElement);
    });
    var edgeData = temp.m_edgeData.map(function(_edgeElement) {
        return Object.assign({}, _edgeElement);
    });

     temp.visnodes = new vis.DataSet(nodeData);
     temp.visedges = new vis.DataSet(edgeData);

    temp.visdata = {
        nodes: temp.visnodes,
        edges: temp.visedges
    };
    var options = this.getOptions();
    /********        Draw Netowrk Graph           **********/
    var network = new vis.Network(container, temp.visdata, options);
    temp.m_network = network;

    temp.m_allNodes = (temp.visnodes).get({
        returnType: "Object"
    });
    temp.highlightActive = false;
   // var allNodes = temp.m_allNodes;
/**        Highlight clicked node and blur out other nodes          **/
    function clickHighlighter(params) {
        var allNodes = (temp.m_network).body.data.nodes.get({
            returnType: "Object"
        });
        var allEdges = (temp.m_network).body.data.edges.get();

        if (params.nodes.length > 0 && !IsBoolean(temp.highlightActive)) {
            temp.highlightActive = true;
            var i, j;
            var selectedNode = params.nodes[0];
            var degrees = 2;
            var nodesDataset = temp.visnodes;
            var network = temp.m_network;

            allEdges.forEach(function(edge) {
                edge.hidden = true;
            })
            // var allConnectedNodes = network.getConnectedNodes(selectedNode);
            var parentNodes = [];

            function getParentNodes(nodeId) {
                allEdges.forEach(function(edge) {
                    if (edge.to === nodeId) {
                        var parentNode = edge.from;
                        parentNodes.push(parentNode);
                        edge.hidden = false;
                        getParentNodes(parentNode);
                    }
                });
                return parentNodes;
            }
            var nodelen = allEdges.find(function(ele) {
                return ele.from == selectedNode
            });
            if (nodelen != undefined) {
                allEdges.forEach(function(edge) {
                    if (edge.from === selectedNode || edge.to === selectedNode) {
                        edge.hidden = false;
                    }
                });
            } else {
                var parentNodes = getParentNodes(selectedNode);
            }
            temp.updateDataPoints(allNodes[selectedNode]);
        } else if (temp.highlightActive === true) {
            allEdges.forEach(function(edge) {
                edge.hidden = false;
            })
            temp.highlightActive = false;
        }
        ((temp.m_network).body.data.edges).update(allEdges);
        (temp.m_network).unselectAll();
    };

    network.on('dragEnd', function() {
      //  network.unselectAll();
    }).on("zoom", function() {
        temp.drawResetButton();
  /*  }).on("oncontext", function(params) {
        $(".contextdiv").remove();
        var nodeId = params.nodes[0]; // Get the ID of the right-clicked node
        if (nodeId !== undefined) {
            var div = "<div class=\"contextdiv\" style=\"font-style:" + this.m_nodefontstyle + ";color:#000000;font-weight:" + this.m_nodefontweight + ";font-family:" + selectGlobalFont(this.m_nodefontfamily) + "\">Expand All</div>";
            if (!temp.m_designMode) {
                $("body").append(div);
            }
            $(".contextdiv").css({
                "display": "block",
                "position": "absolute",
                "left": params.event.x + "px",
                "top": params.event.y + "px",
                "background": "#ffffff",
                "width": "auto",
                "padding": "5px",
                "border-radius": "5px",
                "margin": "5px",
                "font-family": "BizvizFont"
            }).click(function() {
                $(".contextdiv").remove();
                console.log(nodeId);
                var addData = temp.addvisedges[nodeId];
                const toValueIds = addData.reduce((acc, obj) => {
                    acc.push(obj.to);
                    return acc;
                }, []);
                var nodefilterData = (temp.addnodes).filter(obj => toValueIds.includes(obj.id));
                temp.visedges.add(addData);

                temp.visnodes.add(nodefilterData);
                data = {
                    nodes: temp.visnodes,
                    edges: temp.visedges
                };

                network.setData(data);
                network.setOptions(options);
            });
        } */
    }).on("click", clickHighlighter).on("hoverNode", function(e){  
    	pageX = e.event.pageX;
    	pageY = e.event.pageY;
    	var node = temp.m_network.body.data.nodes.get(e.node);
    	var data = [];
    	if ('type' in node) {
    	    data.push(['Type', node.type]);
    	}
    	if ('datavalue' in node) {
    		var text = node.datavalue;
    		if (text % 1 != 0 && temp.m_tooltipprecision < 1) {
    			text = text.toFixed(0);
    		} else {
    			if (temp.m_tooltipprecision !== "default")
    				text = text.toFixed(temp.m_tooltipprecision);
    		}
    		data.push(['Value', text]);
    	}
    	if (node.shape != undefined) {
    	    var shape = node.shape;
    	} else {
    	    var shape = temp.m_nodeshape;
    	}
    	if (node.color != undefined) {
    	    var color = node.color;
    	} else {
    	    var color = temp.m_nodecolor;
    	}
    	shape = (shape == "dot" || shape == "circle") ? "point" : shape == "diamond" ? "quad" : shape == "triangledown" ? "invertedtriangle" : shape;
    	shape = shape == "icon" ? node.iconName : shape == "image" ? "bd-image" : shape;
    	var toolTipData = {
    	    cat: [
    	        [{
    	                shape: shape,
    	                color: color
    	            },
    	            node.label
    	        ]
    	    ],
    	    // cat: node.label,
    	    data: data,
    	    highlightIndex: 0
    	}
    	temp.m_tooltip.drawKnowledgeToolTip(toolTipData);
    }).on("blurNode",function(){
    	temp.hideToolTip();
    });
};
KnowledgeGraphChart.prototype.resetHiglightedNodes = function() {
	var temp = this;
	/*if(IsBoolean(temp.highlightActive)){
		var allNodes = (temp.m_network).body.data.nodes.get({
            returnType: "Object"
        });
		for (var nodeId in allNodes) {
	    	//var allConnectedNodes = network.getConnectedNodes(selectedNode);
	    	//allNodes[nodeId].color = "#124ca3";
	    	if (allNodes[nodeId].hiddenColor !== undefined) {
	            allNodes[nodeId].color = allNodes[nodeId].hiddenColor;
	            delete allNodes[nodeId].hiddenColor;
	        } else if(allNodes[nodeId].color.background == "rgba(200,200,200,0.5)" || (allNodes[nodeId].color.background == undefined && typeof(allNodes[nodeId].color) == 'object')){
	        	delete allNodes[nodeId].color;
	        }              
	        if (allNodes[nodeId].hiddenLabel !== undefined) {
	            allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
	            delete allNodes[nodeId].hiddenLabel;
	        }
	    }
	    temp.highlightActive = false;
	    var updateArray = [];
        for (nodeId in allNodes) {
            if (allNodes.hasOwnProperty(nodeId)) {
                updateArray.push(allNodes[nodeId]);
            }
        }
        ((temp.m_network).body.data.nodes).update(updateArray);
        temp.filterednodes = updateArray;
	}	*/
	if (IsBoolean(temp.highlightActive)) {
		var allEdges = (temp.m_network).body.data.edges.get();
		allEdges.forEach(function(edge) {
			edge.hidden = false;
		});
		((temp.m_network).body.data.edges).update(allEdges);
		temp.highlightActive = false;
	}	
};

KnowledgeGraphChart.prototype.getFilterOptions = function() {
    var temp = this;
    var datarr = temp.m_dataProvider;

//    var uniqueKeysArray = datarr.reduce(function(acc, obj) {
//        var keys = Object.keys(obj);
//        keys.forEach(function(key) {
//            if (!acc.includes(key)) {
//                acc.push(key);
//            }
//        });
//        return acc;
//    }, []);
//    var filteredkeys = uniqueKeysArray.filter(function(number) {
//    	  return number != temp.m_allSourceNames[0] &&  number != temp.m_allTargetNames[0] && number != temp.m_allEdgeNames[0];// Keep the number if it is not divisible by 2 (i.e., odd)
//    });
    var filteredkeys = [];
    filteredkeys.unshift("Node Name","Edge Name");
    //temp.nodeFilterValue = "Node Name";
    return filteredkeys;
};
KnowledgeGraphChart.prototype.filterData = function(fname) {
    var temp = this;
    var network = temp.m_network;
    var data = (temp.m_network).body.data;
    if(temp.nodeFilterValue == "Node Name"){ 
    	var filteredEdges = [];
    	var filteredNodes = data.nodes.get({
    	    filter: function(node) {
    	        //return (node.label || node.hiddenLabel).toUpperCase() == fname.toUpperCase();
    	        return (node.label.toUpperCase()).indexOf(fname.toUpperCase()) >= 0;
    	    },
    	});

    	function collecthierachychildren(sourceNodeId) {
    	    var edges = network.body.data.edges.get();
    	    var outgoingEdgesAndNodes = edges.reduce(function(result, edge) {
    	        if (edge.from === sourceNodeId) {
    	            result.outgoingEdges.push(edge);
    	            result.neighboringNodeIds.push(edge.to);
    	        }
    	        return result;
    	    }, {outgoingEdges: [],neighboringNodeIds: [] });

    	    var neighboringNodeObjects = outgoingEdgesAndNodes.neighboringNodeIds.map(function(nodeId) {
    	        return network.body.nodes[nodeId];
    	    });

    	    var childNodes = network.body.data.nodes.get(outgoingEdgesAndNodes.neighboringNodeIds);
    	    filteredNodes = filteredNodes.concat(childNodes).filter(function(value, index, self) {
    	        return self.indexOf(value) === index;
    	    });
    	    filteredEdges = filteredEdges.concat((outgoingEdgesAndNodes.outgoingEdges).filter(function(item) {
    	    	  return !filteredEdges.some(function(existingItem) {
    	    	    return existingItem.id === item.id;
    	    	  });
    	    }));
    	    //filteredEdges = filteredEdges.concat(network.body.data.edges.get(outgoingEdgesAndNodes.outgoingEdges));
    	    if (outgoingEdgesAndNodes.neighboringNodeIds.length > 0) {
    	        outgoingEdgesAndNodes.neighboringNodeIds.map(function(nodeId) {
    	            collecthierachychildren(nodeId);
    	        })
    	    }
    	}
    	var getFilteredNodes = filteredNodes;
    	getFilteredNodes.map(function(elem){
    	   collecthierachychildren(elem.id);
    	});
    	var filteredData = {
    	    nodes: new vis.DataSet(filteredNodes),
    	    edges: new vis.DataSet(filteredEdges)
    	};
    } else if (temp.nodeFilterValue == "Edge Name"){
    	var filteredNodes = [];
    	var filteredEdges = data.edges.get({
            filter: function(edge) {
//                return (edge.label).toUpperCase() == fname.toUpperCase();
            	return (edge.label).toUpperCase().indexOf(fname.toUpperCase()) >= 0;
            },
        });    
    	var filteredEdgeIds = filteredEdges.map(edge => edge.id);
    	var uniqueNodes = filteredEdgeIds.reduce(function(result, edgeId) {
    		  var connectedNodes = network.getConnectedNodes(edgeId);
    		  return result.concat(connectedNodes);
    		}, []).filter(function(node, index, array) {
    		  return array.indexOf(node) === index;
    	});
    	data.nodes.get({
            filter: function(node) {
                if (uniqueNodes.includes(node.id)) {
                    filteredNodes.push(node);
                }
            }
        });
    	var filteredData = {
                nodes: new vis.DataSet(filteredNodes),
                edges: new vis.DataSet(filteredEdges)
        };
    } else {
        //
    }   
    this.filterdatavalue = fname;//DAS-942 Maximize chart without refreshing data.
	if(filteredNodes.length == 0 && filteredEdges.length == 0){
		$("#chartDiv" + temp.m_objectid).css("display", "none");
		this.m_isfilteravailable = false;
		//$("#draggableCanvas" + temp.m_objectid).css("display", "block");
		this.drawMessage(temp.nodeFilterValue + " Not Available");
    } else {
    	(temp.m_network).setData(filteredData);
    }
};
KnowledgeGraphChart.prototype.createFilterContainer = function() {
    var temp = this;
    if (!temp.m_designMode) {
    	this.m_titleHeight = (IsBoolean(this.m_title.m_showtitle) || IsBoolean(this.m_showgradient) || IsBoolean(this.m_showmaximizebutton)) ? this.m_title.m_titleBarHeight : 0;
        this.m_subTitleHeight = (IsBoolean(this.m_subTitle.m_showsubtitle) && this.m_subTitle.getDescription() != "") ? (this.m_subTitle.m_formattedDescription.length * this.m_subTitle.getFontSize() * 1.5) : 0;
        $("#filterDiv" + temp.m_objectid).remove();   

        var filterDiv = document.createElement('div');
        filterDiv.setAttribute("id", 'filterDiv' + temp.m_objectid);
        $("#draggableDiv" + temp.m_objectid).append(filterDiv);
        var filterDivMargin = 50;
        var subtitleFontMargin = (IsBoolean(this.m_subTitle.m_showsubtitle) && this.m_subTitle.getDescription() != "") ? 4 : 0; /**Added 4 to resolve subtitle font size less then 17 underline does not visible because header overlap the underline.*/
        var topMargin = 1 * (this.m_y) + 1 * (this.m_titleHeight) + 1 * (this.m_subTitleHeight) + 1 * (subtitleFontMargin);
        $("#filterDiv" + temp.m_objectid).css({
            "width": temp.m_width + "px",
            "height": filterDivMargin + "px",
           // "left": temp.m_title.startY + "px",
            "top": topMargin + "px",
            "overflow": "hidden",
            "position": "absolute",
            "background": "transparent",
            "font-family": "BizvizFont",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });
        var ftext = document.createElement("div");
        ftext.innerHTML = "Filter Value ";
        ftext.setAttribute("style", "color:" + temp.m_filterlabelcolor);
        var input = document.createElement("input");
        input.setAttribute("id", "filterinput" + temp.m_objectid);
        input.setAttribute("class", "filterelements" + temp.m_objectid);
        
        var fvtext = document.createElement("div");
        fvtext.innerHTML = "Filter By";
        fvtext.setAttribute("style", "color:" + temp.m_filterlabelcolor);
        var select = document.createElement("select");
        select.setAttribute("id", "filterselect" + temp.m_objectid);
        select.setAttribute("class", "filterelements" + temp.m_objectid);
        var fValues = temp.getFilterOptions();
        var options_str = "";
        fValues.forEach( function(name) {
        	options_str += '<option value="' + name + '">' + name + '</option>';
        });
        select.innerHTML = options_str;
        select.addEventListener("change", function(e) {
           input.value = "";
           temp.nodeFilterValue = e.target.value;
        });   
        select.value = temp.nodeFilterValue;
        $(filterDiv).append(fvtext, select, ftext, input);
        input.addEventListener("focus", function() {
        	 // this.style.borderColor = temp.m_nodecolor;
        	//  this.style.boxShadow = "0 0 5px rgba(255, 0, 0, 0.5)";
        	this.style.outline = "none";
        });
        var filterElementsWidth = (this.m_width * 1 - 20 - ftext.clientWidth - fvtext.clientWidth)/ 3 * 1 + "px";
        $(".filterelements" + temp.m_objectid).css({
            "height": "30px",
            "width": filterElementsWidth,
            "padding": "0px 5px",
            "background": temp.m_filterbgcolor,
            "-webkit-appearance": "none",
            "border": "1px solid #E0DFDF",
            "border-radius": "5px",
            "margin": "0px 10px",
            "color": temp.m_filterfontcolor
        });      
        input.addEventListener("click", function(e) {
        	temp.resetHiglightedNodes();
        });
        input.addEventListener("change", function(e) {
        	e.preventDefault();        	
        	var selectedName = input.value;
            temp.filterData(selectedName);
            temp.fresetFlag = "true";
            temp.drawResetButton();
           // input.value = "";
        });
        //DAS-942 Maximize chart without refreshing data.
		if (this.filterdatavalue) {
			input.value = this.filterdatavalue;
			temp.filterData(this.filterdatavalue);
			temp.fresetFlag = "true";
			temp.drawResetButton();
		}
        $('#draggableCanvas' + temp.m_objectid).css("position", "absolute");
    }    
};
KnowledgeGraphChart.prototype.getMarginForFilter = function () {
	return $("#filterDiv" + this.m_objectid).height() + 10;
};
KnowledgeGraphChart.prototype.drawKnowledgeGraph = function () {
	var temp = this;
	var width = this.m_width * 1;
	var scrollMargin = 1;
	var topMargin = (this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1);
	topMargin = !IsBoolean(temp.m_designMode) ? topMargin + this.getMarginForFilter() * 1 : topMargin;
	var height = this.m_height - topMargin - scrollMargin;

	$("#chartDiv" + temp.m_objectid).remove();
	$("#textcanvas" + temp.m_objectid).remove();
	var mainDiv = document.createElement("div");
	mainDiv.id = "chartDiv" + temp.m_objectid;
	
	mainDiv.style.height = height + "px";
	mainDiv.style.width = "inherit";
	mainDiv.style.verticalAlign = "middle";
	//mainDiv.style.background = hex2rgb("#ffffff",this.m_bgalpha);
	mainDiv.style.display = "table-cell";
	mainDiv.style.textAlign = "center";
	mainDiv.style.top = topMargin + "px";
	mainDiv.style.position = "absolute";
	mainDiv.style.overflowY = "auto";
	mainDiv.style.overflowX = "auto";

	$("#draggableDiv" + temp.m_objectid).css("overflow-x", "hidden");
	$("#draggableDiv" + temp.m_objectid).css("overflow-y", "hidden");
	$("#draggableDiv" + temp.m_objectid).css("background", hex2rgb("#ffffff", this.m_bgalpha));
	$("#draggableDiv" + temp.m_objectid).append(mainDiv);
	if(IsBoolean(this.m_designMode)){
		var transDiv = document.createElement("div");
		transDiv.style.height = height + "px";
		transDiv.style.background = "transparent";
		transDiv.style.width = "inherit";
		transDiv.style.top = topMargin + "px";
		transDiv.style.position = "absolute";
		$("#draggableDiv" + temp.m_objectid).append(transDiv);
	}
	return mainDiv;
};
/** @description Setter Method to set ValidConfiguration. **/
KnowledgeGraphChart.prototype.IsDrawingPossible = function () {
	var map = {};
	if (!IsBoolean(this.isEmptyCategory)) {
		if (!(IsBoolean(this.m_isEmptyStartValue)) || !IsBoolean(this.m_isEmptyEndValue)) {
			map = { "permission" : "true", message : this.m_status.success };
		} else {
			map = { "permission" : "false", message : this.m_status.noDate };
		}
	} else{
		map = { "permission" : "false", message : this.m_status.noCategory };
	}
	return map;
};
/** @description Setter method for set the Source data. **/
KnowledgeGraphChart.prototype.setSourceData = function () {
	this.m_sourceData = [];
	this.isEmptySource = true;
	if (this.getSourceNames().length > 0) {
		this.isEmptySource = false;
		for (var i = 0; i < this.getSourceNames().length; i++) {
			this.m_sourceData[i] = this.getDataFromJSON(this.getSourceNames()[i]);
		}
	}
	this.m_seriesData = this.m_sourceData;
};
/** @description Setter method for set the Target Data. **/
KnowledgeGraphChart.prototype.setTargetData = function () {
	this.m_targetData = [];
	this.isEmptyTarget = true;
	if (this.getTargetNames().length > 0) {
		this.isEmptySource = false;
		for (var i = 0; i < this.getTargetNames().length; i++) {
			this.m_targetData[i] = this.getDataFromJSON(this.getTargetNames()[i]);
		}
	}
};
/** @description Setter method for set the Edge Data. **/
KnowledgeGraphChart.prototype.setEdgeData = function () {
	this.m_edgeData = [];
	this.isEmptyEdge = true;
	if (this.getSourceNames().length > 0) {
		this.isEmptySource = false;
		for (var i = 0; i < this.getEdgeNames().length; i++) {
			this.m_edgeData[i] = this.getDataFromJSON(this.getEdgeNames()[i]);
		}
	}
};
/** @description Setter method for set the Value Data. **/
KnowledgeGraphChart.prototype.setValueData = function () {
	this.m_valueData = [];
	this.isEmptyValue = true;
	if (this.getValueNames() != undefined && this.getValueNames().length > 0) {
		this.isEmptyValue = false;
		for (var i = 0; i < this.getValueNames().length; i++) {
			this.m_valueData[i] = this.getDataFromJSON(this.getValueNames()[i]);
		}
	}
};
/** @description Setter method for set the Type Data. **/
KnowledgeGraphChart.prototype.setTypeData = function () {
	this.m_typeData = [];
	this.isEmptyType = true;
	if (this.getTypeNames() != undefined && this.getTypeNames().length > 0) {
		this.isEmptyType = false;
		for (var i = 0; i < this.getTypeNames().length; i++) {
			this.m_typeData[i] = this.getDataFromJSON(this.getTypeNames()[i]);
		}
	}
};
/** @description Setter method for set the node Size Data. **/
KnowledgeGraphChart.prototype.setNodeSizeData = function () {
	this.m_nodeSizeData = [];
	this.isEmptynodeSize = true;
	if (this.getNodeSizeNames() != undefined && this.getNodeSizeNames().length > 0) {
		this.isEmptyNodeSize = false;
		for (var i = 0; i < this.getNodeSizeNames().length; i++) {
			this.m_nodeSizeData[i] = this.getDataFromJSON(this.getNodeSizeNames()[i]);
		}
	}
};
/** @description Getter method of SourceData. **/
KnowledgeGraphChart.prototype.getSourceData = function () {
	return this.m_sourceData;
};
/** @description Getter method of TargetData. * */
KnowledgeGraphChart.prototype.getTargetData = function () {
	return this.m_targetData;
};
/** @description Getter method of EdgeValues. **/
KnowledgeGraphChart.prototype.getEdgeData = function () {
	return this.m_edgeData;
};
/** @description Getter method of TypeValues. **/
KnowledgeGraphChart.prototype.getTypeData = function () {
	return this.m_typeData;
};
/** @description Getter method of Values. **/
KnowledgeGraphChart.prototype.getValueData = function () {
	return this.m_valueData;
};
/** @description Getter method of Values. **/
KnowledgeGraphChart.prototype.getnodeSizeData = function () {
	return this.m_nodeSizeData;
};
/** @description Setter Method for AllFieldsName **/
KnowledgeGraphChart.prototype.setAllFieldsName = function () {
	this.m_allfieldsName = [];
	for (var i = 0; i < this.getAllSourceNames().length; i++) {
		this.m_allfieldsName.push(this.getAllSourceNames()[i]);
	}
	for (var i = 0; i < this.getAllTargetNames().length; i++) {
		this.m_allfieldsName.push(this.getAllTargetNames()[i]);
	}
	for (var i = 0; i < this.getAllEdgeNames().length; i++) {
		this.m_allfieldsName.push(this.getAllEdgeNames()[i]);
	}
};

/** @description Setter Method of AllFieldsDisplayName **/
KnowledgeGraphChart.prototype.setAllFieldsDisplayName = function () {
	this.m_allfieldsDisplayName = [];
	for (var i = 0; i < this.getCategoryDisplayNames().length; i++) {
		this.m_allfieldsDisplayName.push(this.getCategoryDisplayNames()[i]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getStartValueNames()[j]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getEndValueNames()[j]);
	}
	for (var j = 0; j < this.getSeriesDisplayNames().length; j++) {
		this.m_allfieldsDisplayName.push(this.getSeriesDisplayNames()[j]);
	}
};
/** @description Getter Method of AllFieldsName **/
KnowledgeGraphChart.prototype.getAllFieldsName = function () {
	return this.m_allfieldsName;
};
/** @description Getter Method of AllFieldsDisplayName **/
KnowledgeGraphChart.prototype.getAllFieldsDisplayName = function () {
	return this.m_allfieldsDisplayName;
};

/** @description Calculation initialization **/
KnowledgeGraphChart.prototype.initializeCalculation = function () {
	this.setChartDrawingArea();
};
/** @description calcluating mark text margin and than start point from where chart x,y will draw **/
KnowledgeGraphChart.prototype.setStartX = function () {
	this.m_startX = this.m_x * 1 ;
};
/** @description  Setter method of KnowledgeGraphChart for set EndX position.**/
KnowledgeGraphChart.prototype.setEndX = function () {
	this.m_endX = this.m_startX * 1 + this.m_width * 1;
};
/** @description  Setter method of KnowledgeGraphChart for set StartY position.**/
KnowledgeGraphChart.prototype.setStartY = function () {
	this.m_startY = this.m_y * 1 + (this.m_height);
};
/** @description  Setter method of KnowledgeGraphChart for set EndY position.**/
KnowledgeGraphChart.prototype.setEndY = function () {
	this.m_endY = (this.m_y * 1 + this.getMarginForTitle() * 1 + this.getMarginForSubTitle() * 1 );
};
/** @description Getter method of KnowledgeGraphChart for Marginfortitle. **/
KnowledgeGraphChart.prototype.getMarginForTitle = function () {
	return ((!IsBoolean(this.getShowGradient())) && (!IsBoolean(this.m_showmaximizebutton)) && (!IsBoolean(this.getTitle().m_showtitle))) ? 0 : (this.getTitleBarHeight() * 1 + 15);
};
/** @description Setter method of KnowledgeGraphChart for custom range colors. **/
KnowledgeGraphChart.prototype.setRangeColors = function () {
	var temp = this;
	//m_nodeDataValue
	var ranges = this.m_ranges.split(',');
	for(var i = 0; i < Object.keys(this.m_nodeDataValue).length; i++){
		var compVal = Object.entries(this.m_nodeDataValue)[i][1];
		for(var j = 0; j < ranges.length; j++){			
			if(compVal >= ranges[j][0] || compVal <= ranges[j][0]){
				compVal = this.m_customnodeshapes.split(',')[j];
			}
		}
	}
};
/** @description Setter method of KnowledgeGraphChart for custom range colors. **/
KnowledgeGraphChart.prototype.createTypeData = function() {
    var temp = this;
    if (IsBoolean(temp.m_usecustomshapes) && this.m_shapeindicatortype == "type") {
        var types = temp.m_nodetypes.split(",");
        var shapes = temp.m_customnodetypeshapes.split(",");
        var typeshapes = types.reduce((result, type, index) => {
            result[type] = shapes[index];
            return result;
        }, {});
        temp.m_groupshapes = typeshapes;
    }
    if (IsBoolean(temp.m_usecustomcolors) && this.m_colorindicatortype == "type") {
        var types = temp.m_colortypes.split(",");
        var shapes = temp.m_customnodetypecolors.split(",");
        var typecolors = types.reduce((result, type, index) => {
            result[type] = shapes[index];
            return result;
        }, {});
        temp.m_groupcolors = typecolors;
    }
};
/** @description Get data object for KnowledgeGraphChart. **/
KnowledgeGraphChart.prototype.getDataItems = function () {
	var temp = this;
	var data = this.m_dataProvider;
	var dataObj = [];
	var sData = this.getSourceData();
	var tData = this.getTargetData();
	var sUnique = sData[0].filter(function(value, index, array){
	    return array.indexOf(value) === index;
	});
	var tUnique = tData[0].filter(function(value, index, array){
	    return array.indexOf(value) === index;
	});
	var Parent = temp.getSourceNames()[0];
	var Child = temp.getTargetNames()[0];
	var Edge = temp.getEdgeNames()[0];
	var Group = temp.getTypeNames()[0];
	var dataValue = temp.getValueNames()[0];
	var nodeSize = temp.getNodeSizeNames()[0];
	if(Group != undefined){
		temp.createTypeData();
	}
	if(dataValue != undefined){
		var obj = {};

		data.forEach(function(item) {
			if(!isNaN(Number(item[dataValue]))){
				if(obj[item[Parent]] == undefined){
					obj[item[Parent]] = 0;				
					obj[item[Parent]] += item[dataValue]*1;
				} else{
					obj[item[Parent]] += item[dataValue]*1;
				}
				if(obj[item[Child]] == undefined){
					obj[item[Child]] = 0;
					obj[item[Child]] += item[dataValue]*1;
				} else{
					obj[item[Child]] += item[dataValue]*1;
				}
			}
		});
		if(IsBoolean(temp.m_usecustomshapes) && this.m_shapeindicatortype == "value"){
			var ranges = (temp.m_customshaperange).split(",");
			var shapes = (temp.m_customnoderangeshapes).split(",");
			
			var rangeShapes = Object.keys(obj).reduce(function(acc, key) {
				  var value = obj[key];
				  var index = ranges.findIndex(function(range) {
				    var bounds = range.split("~");
				    var lowerBound = parseInt(bounds[0]);
				    var upperBound = parseInt(bounds[1]);
				    return value >= lowerBound && value <= upperBound;
				  });
				  if (index !== -1) {
				    acc[key] = shapes[index];
				  }
				  return acc;
			}, {});
			temp.m_rangeShapes = rangeShapes;
		} 
		if(IsBoolean(temp.m_usecustomcolors) && this.m_colorindicatortype == "value"){
			var ranges = (temp.m_customcolorrange).split(",");
			var colors = (temp.m_customnoderangecolors).split(",");
			
			var rangeColors = Object.keys(obj).reduce(function(acc, key) {
				  var value = obj[key];
				  var index = ranges.findIndex(function(range) {
				    var bounds = range.split("~");
				    var lowerBound = parseInt(bounds[0]);
				    var upperBound = parseInt(bounds[1]);
				    return value >= lowerBound && value <= upperBound;
				  });
				  if (index !== -1) {
				    acc[key] = colors[index];
				  }
				  return acc;
			}, {});
			temp.m_rangeColors = rangeColors;
		} else{
			//
		}		
	}     	
	var entityData = sUnique.concat(tUnique);
	var eid = {};
	var id = 0;
	data.map(function(val,index,arr){
		dataObj[index] = {};
		dataObj[index]["source"] = val[Parent];
		dataObj[index]["target"] = val[Child];
		dataObj[index]["edge"] = val[Edge];
		dataObj[index]["group"] = val[Group];
		dataObj[index]["nodeSize"] = val[nodeSize];
		if(eid[val[Parent]] != undefined){
			dataObj[index]["srcid"] = eid[val[Parent]].id;			
		} else {
			id++;
			dataObj[index]["srcid"] = id;
			eid[val[Parent]] = {};
			eid[val[Parent]].id = id;
			eid[val[Parent]].value = val[nodeSize];
			if(obj != undefined){
				eid[val[Parent]].datavalue = obj[val[Parent]];	
			}			
		}
		if(eid[val[Child]] != undefined){
			dataObj[index]["trgid"] = eid[val[Child]].id;
			eid[val[Child]].group = val[Group];
		} else {
			id++;
			dataObj[index]["trgid"] = id;
			eid[val[Child]] = {};
			eid[val[Child]].id = id;
			eid[val[Child]].group = val[Group];
			eid[val[Child]].value = val[nodeSize];
			if(obj != undefined){
				eid[val[Child]].datavalue = obj[val[Child]];	
			}			
		}	
	});
	this.createEdgeData(dataObj);
	this.createleveldata();
	this.createNodeData(eid);	
};
KnowledgeGraphChart.prototype.createleveldata = function() {
	var temp = this;
	var edge = temp.m_edgeData;
	var levels = {};
	var visited = {};
	function generateLevels(node, currentLevel) {
	    if (visited[node]) return;

	    levels[node] = currentLevel;
	    visited[node] = true;

	    edge.reduce((acc, link) => {
	        if (link.from === node) {
	            generateLevels(link.to, currentLevel + 1);
	        }
	        return acc;
	    }, null);
	};
	edge.reduce((acc, link) => {
	    generateLevels(link.from, 0);
	    return acc;
	}, null);
	this.m_levels = levels;
}
KnowledgeGraphChart.prototype.createNodeData = function(entities) {
    var temp = this;
    var entities = entities;
    this.m_nodeData = [];
    var valueData = this.m_nodeDataValue;
    var i = 0;
    for (var property in entities) {
        this.m_nodeData[i] = {};
        this.m_nodeData[i]["id"] = entities[property].id;
//        this.m_nodeData[i]["group"] = entities[property].group != undefined ? (IsBoolean(temp.m_usecustomshapes) || IsBoolean(temp.m_usecustomcolors)) ? entities[property].group : "defaultGroup" : "defaultGroup";
        this.m_nodeData[i]["label"] = property;
        if (entities[property].datavalue != undefined) {
            this.m_nodeData[i]["datavalue"] = entities[property].datavalue;
        }
        if (entities[property].group != undefined && entities[property].group != "defaultGroup") {
            this.m_nodeData[i]["type"] = entities[property].group;
        }
        if (entities[property].value != undefined) {
            this.m_nodeData[i]["size"] = entities[property].value;
        }
        /* configure color & shape of the node(bdIcon/default/SVG) based on type of the node */
        if (this.m_nodeData[i]["type"]) {
            if (this.m_groupshapes != undefined) {
                if (this.m_shapeindicatortype == "type" && this.m_groupshapes[this.m_nodeData[i]["type"]] != undefined) {
                	var typShape = this.m_groupshapes[this.m_nodeData[i]["type"]];
                	if (typShape.indexOf("<svg") > -1) {
                		var image = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(typShape);
                        this.m_nodeData[i]["shape"] = "image";
                        this.m_nodeData[i]["image"] = image;
                	} else if (typShape.indexOf("bd-") > -1) {
                        var iconCode = temp.getIconCode(typShape);
                        var iconsize = (entities[property].value != undefined) ? (entities[property].value * 3) : (temp.m_nodesize * 3);
                        this.m_nodeData[i]["shape"] = "icon";
                        this.m_nodeData[i]["iconName"] = typShape;
                        this.m_nodeData[i]["icon"] = {
                            face: "'bdbizviz'",
                            code: iconCode,
                            size: iconsize
                        };
                    } else {
                        this.m_nodeData[i]["shape"] = typShape;
                    }
                }
            }
            if (this.m_groupcolors != undefined) {
                if (this.m_groupcolors[this.m_nodeData[i]["type"]] != undefined && this.m_colorindicatortype == "type") {
                    this.m_nodeData[i]["color"] = this.m_groupcolors[this.m_nodeData[i]["type"]];
                }
            }
        } 
        /* configure color & shape of the node(bdIcon/default/SVG) based on nodevalue */
        if (temp.getValueNames()[0] != undefined) {
            if (IsBoolean(temp.m_usecustomcolors) && temp.m_colorindicatortype == "value" && temp.m_rangeColors[property] != undefined) {
                this.m_nodeData[i]["color"] = temp.m_rangeColors[property];
            }
            if (IsBoolean(temp.m_usecustomshapes) && temp.m_shapeindicatortype == "value" && temp.m_rangeShapes[property] != undefined) {
                var rangeShape = temp.m_rangeShapes[property];
                if (rangeShape.indexOf("<svg") > -1) {
                    var image = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(rangeShape);
                    this.m_nodeData[i]["shape"] = "image";
                    this.m_nodeData[i]["image"] = image;
                } else if (rangeShape.indexOf("bd-") > -1) {
                    var iconCode = temp.getIconCode(rangeShape);
                    var iconsize = (entities[property].value != undefined) ? (entities[property].value * 3) : (temp.m_nodesize * 3);
                    this.m_nodeData[i]["shape"] = "icon";
                    this.m_nodeData[i]["iconName"] = rangeShape;
                    this.m_nodeData[i]["icon"] = {
                        face: "'bdbizviz'",
                        code: iconCode,
                        size: iconsize
                    };
                } else {
                    this.m_nodeData[i]["shape"] = rangeShape;
                }
            }
        }
        /* configure color & shape of the node(bdIcon/default/SVG) based on levels */
        if (IsBoolean(temp.m_usecustomcolors) && temp.m_colorindicatortype == "level") {
            var colors = (temp.m_customnodelevelcolors).split(",");
            if (colors[temp.m_levels[temp.m_nodeData[i].id]] != undefined) {
                this.m_nodeData[i]["color"] = colors[temp.m_levels[temp.m_nodeData[i].id]];
            }
        }
        if (IsBoolean(temp.m_usecustomshapes) && temp.m_shapeindicatortype == "level") {
            var shapes = (temp.m_customnodelevelshapes).split(",");
            var levelShape = shapes[temp.m_levels[temp.m_nodeData[i].id]];
            if (levelShape != undefined) {
                if (levelShape.indexOf("<svg") > -1) {
                    var image = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(levelShape);
                    this.m_nodeData[i]["shape"] = "image";
                    this.m_nodeData[i]["image"] = image;
                } else if (levelShape.indexOf("bd-") > -1) {
                    var iconCode = temp.getIconCode(levelShape);
                    var iconsize = (entities[property].value != undefined) ? (entities[property].value * 3) : (temp.m_nodesize * 3);
                    this.m_nodeData[i]["shape"] = "icon";
                    this.m_nodeData[i]["iconName"] = levelShape;
                    this.m_nodeData[i]["icon"] = {
                        face: "'bdbizviz'",
                        code: iconCode,
                        size: iconsize
                    };
                } else {
                    this.m_nodeData[i]["shape"] = levelShape;
                }
            }
        }
        /*vis.js icon color can be configured only inside icon object*/
        if (this.m_nodeData[i].shape == "icon") {
            this.m_nodeData[i].icon.color = this.m_nodeData[i].color ? this.m_nodeData[i].color : this.m_nodecolor;
        }
        i++;
    }
};
KnowledgeGraphChart.prototype.createEdgeData = function(data) {
    this.m_edgeData = [];
    var edges = data;
    for (var j = 0; j < edges.length; j++) {
        this.m_edgeData[j] = {};
        this.m_edgeData[j]["from"] = edges[j].srcid;
        this.m_edgeData[j]["to"] = edges[j].trgid;
        this.m_edgeData[j]["label"] = edges[j].edge;
    }
};
KnowledgeGraphChart.prototype.generateId = function(data) {
    var id = 0;
    var eid = [];
    data.map(function(val, i, arr) {
        eid[i] = {};
        eid["name"] = val;
        eid[i]["id"] = id++;
    });
    return eid;
};
KnowledgeGraphChart.prototype.getNodeOptions = function() {
    var temp = this;
    var options = {
        opacity: temp.m_nodeopacity,
        size: Number(temp.m_nodesize),
//        widthConstraint: 50,
        font: {
            //   multi: 'html',
            color: this.m_nodefontcolor,
            size: Number(this.m_nodefontsize),
            face: this.m_nodefontfamily,
        },
        color: {
            //border: this.m_nodebordercolor,
            background: this.m_nodecolor,
            highlight: {
                border: this.m_nodebordercolor,
                background: this.m_nodehovercolor
            },
            hover: {
                border: this.m_nodebordercolor,
                background: this.m_nodehovercolor
            }
        }
    }
    if(temp.m_nodeshape == "circle" || temp.m_nodeshape == "box" || temp.m_nodeshape == "ellipse" || temp.m_nodeshape == "database"){
    	options.widthConstraint = Number(temp.m_nodesize);
    }
    return options;
};
/** @description Getter Method of options for vis network. **/
KnowledgeGraphChart.prototype.getOptions = function() {
    /** @help  https://visjs.github.io/vis-network/docs/network/ **/
    var temp = this;
    var dragview = IsBoolean(this.m_designMode) ? false : true;
    var zoomview = IsBoolean(this.m_designMode) ? false : true;
    var physics = IsBoolean(temp.m_hierarchiallayuot) ? false : true;
    var hierarchial = IsBoolean(temp.m_hierarchiallayuot) ? true : false;
    var options = {
    	width: '100%',
    	height: '100%',
        nodes: {
            shape: temp.m_nodeshape,  
            opacity: Number(temp.m_nodeopacity),
            size: Number(temp.m_nodesize),
            margin: 10,
            font: {
             //   multi: 'html',
                color: this.m_nodefontcolor,
                size: Number(this.m_nodefontsize),
                face: this.m_nodefontfamily,
                vadjust: -10
            },
            color: {
               // border: this.m_nodebordercolor,
                background: this.m_nodecolor,
                highlight: {
                    border: this.m_nodebordercolor,
                    background: this.m_nodecolor
                },
                hover: {
                    border: this.m_nodebordercolor,
                    background: this.m_nodehovercolor
                }
            }           
          //  fixed: temp.m_fixed
        },
        layout: {
            improvedLayout: false,
            hierarchical: {
                enabled: hierarchial,
                direction: temp.m_hierarchydirection,
                sortMethod: 'directed',
                parentCentralization: false,
                edgeMinimization: true,
                levelSeparation: 500,
                nodeSpacing: 100
             }
        },
        groups:{
        //	useDefaultGroups: true,
        	color: {
                border: this.m_nodebordercolor,
//                background: this.m_nodecolor,
                highlight: {
                    border: this.m_nodebordercolor,
                    background: temp.m_nodehovercolor
                },
                hover: {
                    border: this.m_nodebordercolor,
                    background: temp.m_nodehovercolor
                }
            }
        },
        physics: {
        	enabled: physics,
            barnesHut: {
              gravitationalConstant: -800,
              springConstant: 0.001,
             // springLength: 10,
            },
            maxVelocity: 146,
            solver: "forceAtlas2Based",
            timestep: 0.35,
            stabilization: { iterations: 150 },
         },
        edges: {
            arrows: {
                to: {
                    enabled: temp.m_showarrows,
                    type: "arrow"
                },
            },
           color: {
               //opacity: 1.0
            },
            dashes:temp.m_dashededge,
            font: {
                color: this.m_edgefontcolor,
                size: Number(this.m_edgefontsize), // px
                face: this.m_edgefontfamily,
                //background: 'none',
                strokeWidth: 0, // px
                // strokeColor: '#ffffff',
                align: this.m_edgelabelalign,
                multi: false,
                vadjust: Number(this.m_edgelabelpadding)
            }
        },
        interaction: {
        	hideEdgesOnDrag: true,
            zoomView: zoomview,
            dragView: dragview,
            hover: true
        }
    };
    if(temp.m_nodeshape == "circle" || temp.m_nodeshape == "box" || temp.m_nodeshape == "ellipse" || temp.m_nodeshape == "database"){
    	options.nodes.widthConstraint = Number(temp.m_nodesize);
    }
    if(temp.m_edgecolorinherit == "default"){
    	options.edges.color.inherit = false;
    	options.edges.color.color = temp.m_edgecolor;
    	options.edges.color.hover = temp.m_nodehovercolor;
    	options.edges.color.highlight = temp.m_nodehovercolor;
    } else {
    	options.edges.color.inherit = temp.m_edgecolorinherit;
    }
    if(!IsBoolean(temp.m_usecustomcolors)){
    	options.nodes.color.border = temp.m_nodebordercolor;
    }
    return options;
};
KnowledgeGraphChart.prototype.drawResetButton = function() {
    var temp = this;
    $("#reseticon" + temp.m_objectid).remove();
    var x = (IsBoolean(this.m_showmaximizebutton) || (IsBoolean(this.m_showlegends) && IsBoolean(this.m_fixedlegend))) ? ((IsBoolean(this.m_showsettingmenubutton)) ? this.m_width - this.fontScaling(25) - 60 : this.m_width - this.fontScaling(25) - 30) : ((IsBoolean(this.m_showsettingmenubutton)) ? this.m_width - this.fontScaling(25) - 30 : this.m_width - this.fontScaling(25));
    var y = this.m_title.startY - this.fontScaling(10);
    var fontSize = this.fontScaling(16);
    var imageMenu = this.drawFontIcons("reseticon", "", x, y, "bd-refresh", fontSize);
    imageMenu.setAttribute("id", "reseticon" + temp.m_objectid);
    $(imageMenu).on("click", function() {
		temp.filterdatavalue = "";//DAS-942 Maximize chart without refreshing data.
        $("#resetTooltipDiv").remove();
        //temp.resetHiglightedNodes();
        if (IsBoolean(temp.fresetFlag)) {
        	$("#textcanvas" + temp.m_objectid).remove();
        	//temp.drawMessage("");
        	$("#chartDiv" + temp.m_objectid).css("display", "block");
    		//$("#draggableCanvas" + temp.m_objectid).css("display", "none");
        	$("#filterinput" + temp.m_objectid)[0].value = "";
        	var nodeData = temp.m_nodeData.map(function(_nodeElement) {
        	    return Object.assign({}, _nodeElement);
        	});
        	var edgeData = temp.m_edgeData.map(function(_edgeElement) {
        	    return Object.assign({}, _edgeElement);
        	});
            var chartData = {
                nodes: new vis.DataSet(nodeData),
                edges: new vis.DataSet(edgeData)
            };
            (temp.m_network).setData(chartData);
            temp.highlightActive = false;
            temp.fresetFlag = "false";
        }
        temp.m_network.fit();
        $("#reseticon" + temp.m_objectid).remove();
    });

    var zindex = 10000;
    var tooltip = "Reset";
    var fontfamily = selectGlobalFont(this.m_title.m_fontfamily);
    var fontsize = 12 + "px";
    var right = (IsBoolean(this.m_showmaximizebutton) || (IsBoolean(this.m_showlegends) && IsBoolean(this.m_fixedlegend))) ? this.fontScaling(50) - 30 + "px" : this.fontScaling(30) - 25 + "px";
    var cls = (IsBoolean(this.m_showmaximizebutton) || (IsBoolean(this.m_showlegends) && IsBoolean(this.m_fixedlegend))) ? "settingIcon" : "minMax";

    var top = (this.m_title.startY + 10) + "px";
    if (!IsBoolean(isTouchEnabled)) {
        if (!temp.m_designMode) {
            $("#reseticon" + temp.m_objectid).hover(function(e) {
                var parentDiv = document.getElementById("draggablesParentDiv" + temp.m_dashboard.m_id);
                var scrollLeft = parentDiv.scrollLeft;
                var scrollTop = parentDiv.scrollTop;
                var offset = $(parentDiv).offset();
                var PageTop = offset.top + $(parentDiv)[0].clientTop - $(parentDiv)[0].scrollTop;
                var PageLeft = offset.left + $(parentDiv)[0].clientLeft - $(parentDiv)[0].scrollLeft;
                var top = e.pageY - e.offsetY + $(this)[0].offsetHeight - PageTop + 1 + "px"; //comment this for overlap
                var left = e.pageX - e.offsetX + ($(this)[0].offsetWidth / 2) - PageLeft + 8 + "px";

                var tooltipDiv = document.createElement("div");
                tooltipDiv.innerHTML = tooltip;
                tooltipDiv.setAttribute("class", cls);
                tooltipDiv.setAttribute("placement", "bottom");
                tooltipDiv.setAttribute("id", "resetTooltipDiv");
                $(tooltipDiv).css({
                    "font-family": fontfamily,
                    "font-size": fontsize,
                    "top": top,
                    "left": left,
                    "z-index": zindex,
                    "border": "1px solid #e0dfdf",
                    "padding": "24px",
                    "position": "absolute",
                    "border-radius": "6px",
                    "background-color": "#ffffff"
                });
                $("#draggablesParentDiv" + temp.m_dashboard.m_id).append(tooltipDiv);
                var lt = e.pageX - e.offsetX + ($(this)[0].offsetWidth) - tooltipDiv.offsetWidth - PageLeft + 28 + "px";
                $(tooltipDiv).css({
                    "left": lt
                });
            }, function() {
                $("#resetTooltipDiv").remove();
            });
        }
    }
};
/** @description will draw the ChartFrame  of the KnowledgeGraphChart. **/
KnowledgeGraphChart.prototype.drawChartFrame = function () {
	this.m_chartFrame.drawFrame();
};
/** @description Will Draw Title on canvas if showTitle set to true **/
KnowledgeGraphChart.prototype.drawTitle = function () {
	this.m_title.draw();
};

/** @description Will Draw SubTitle on canvas if showSubTitle set to true **/
KnowledgeGraphChart.prototype.drawSubTitle = function () {
	this.m_subTitle.draw();
};

KnowledgeGraphChart.prototype.getToolTipData = function (mouseX, mouseY) {	
};
/** @description this methods draws the tooltip content in table - overrided in some sub classes **/
KnowledgeGraphChart.prototype.drawTooltipContent = function (toolTipData) {
	this.m_tooltip.draw(toolTipData, this.m_componenttype);
};
KnowledgeGraphChart.prototype.getDrillDataPoints = function (mouseX, mouseY) {
};
//# sourceURL=KnowledgeGraphChart.js