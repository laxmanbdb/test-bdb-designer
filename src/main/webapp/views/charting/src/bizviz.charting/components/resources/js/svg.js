/*!
 * svg.js - A lightweight library for manipulating and animating SVG.
 * @version 2.2.5
 * http://www.svgjs.com
 *
 * @copyright Wout Fierens <wout@impinc.co.uk>
 * @license MIT
 *
 * BUILT: Sat Jan 23 2016 00:23:13 GMT+0100 (Mitteleuropäische Zeit)
 */;
 (function(root, factory) {
	 if (typeof define === 'function' && define.amd) {
		 define(function(){
			 return factory(root, root.document)
		 })
	 } else if (typeof exports === 'object') {
		 module.exports = root.document ? factory(root, root.document) : function(w){ return factory(w, w.document); }
	 } else {
		 root.SVG = factory(root, root.document)
	 }
 }(typeof window !== "undefined" ? window : this, function(window, document) {

//	 The main wrapping element
	 var SVG = this.SVG = function(element) {
		 if (SVG.supported) {
			 element = new SVG.Doc(element)

			 if (!SVG.parser)
				 SVG.prepare(element)

				 return element;
		 }
	 }

//	 Default namespaces
	 SVG.ns    = 'http://www.w3.org/2000/svg'
		 SVG.xmlns = 'http://www.w3.org/2000/xmlns/'
			 SVG.xlink = 'http://www.w3.org/1999/xlink'
				 SVG.svgjs = 'http://svgjs.com/svgjs'

//					 Svg support test
					 SVG.supported = (function() {
						 return !! document.createElementNS &&
						 !! document.createElementNS(SVG.ns,'svg').createSVGRect
					 })()

//					 Don't bother to continue if SVG is not supported
					 if (!SVG.supported) return false

//					 Element id sequence
					 SVG.did  = 1000

//					 Get next named element id
					 SVG.eid = function(name) {
						 return ('Svgjs' + capitalize(name) + (SVG.did++));
					 }

//	 Method for element creation
	 SVG.create = function(name) {
		 // create element
		 var element = document.createElementNS(this.ns, name)

		 // apply unique id
		 element.setAttribute('id', this.eid(name))

		 return element;
	 }

//	 Method for extending objects
	 SVG.extend = function() {
		 var modules, methods, key, i

		 // Get list of modules
		 modules = [].slice.call(arguments);

		 // Get object with extensions
		 methods = modules.pop()

		 for (i = modules.length - 1; i >= 0; i--)
			 if (modules[i])
				 for (key in methods)
					 modules[i].prototype[key] = methods[key];

		 // Make sure SVG.Set inherits any newly added methods
		 if (SVG.Set && SVG.Set.inherit)
			 SVG.Set.inherit();
	 }

//	 Invent new element
	 SVG.invent = function(config) {
		 // Create element initializer
		 var initializer = (typeof config.create == 'function') ?
				 config.create :
					 function() {
					 this.constructor.call(this, SVG.create(config.create));
				 }

		 // Inherit prototype
		 if (config.inherit)
			 initializer.prototype = new config.inherit;

			 // Extend with methods
			 if (config.extend)
				 SVG.extend(initializer, config.extend)

				 // Attach construct method to parent
				 if (config.construct)
					 SVG.extend(config.parent || SVG.Container, config.construct)

					 return initializer;
	 }

//	 Adopt existing svg elements
	 SVG.adopt = function(node) {
		 // check for presence of node
		 if (!node)
			 return null;

		 // make sure a node isn't already adopted
		 if (node.instance)
			 return node.instance;

		 // initialize variables
		 var element;

		 // adopt with element-specific settings
		 if (node.nodeName == 'svg')
			 element = (node.parentNode instanceof SVGElement) ? new SVG.Nested : new SVG.Doc;
					 else if (node.nodeName == 'linearGradient')
						 element = new SVG.Gradient('linear');
					 else if (node.nodeName == 'radialGradient')
						 element = new SVG.Gradient('radial');
					 else if (SVG[capitalize(node.nodeName)])
						 element = new SVG[capitalize(node.nodeName)];
					 else
						 element = new SVG.Element(node);

		 // ensure references
		 element.type  = node.nodeName;
		 element.node  = node;
		 node.instance = element;

		 // SVG.Class specific preparations
		 if (element instanceof SVG.Doc)
			 element.namespace().defs();

			 // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
			 element.setData(JSON.parse(node.getAttribute('svgjs:data')) || {})

			 return element;
	 }

//	 Initialize parsing element
	 SVG.prepare = function(element) {
		 // Select document body and create invisible svg element
		 var body = document.getElementsByTagName('body')[0],
		 draw = (body ? new SVG.Doc(body) : element.nested()).size(2, 0),
		 path = SVG.create('path');

		 // Insert parsers
		 draw.node.appendChild(path);

		 // Create parser object
		 SVG.parser = {
			 body: body || element.parent(),
			 draw: draw.style('opacity:0;position:fixed;left:100%;top:100%;overflow:hidden'),
			 poly: draw.polyline().node,
			 path: path
		 }
	 };

//	 Storage for regular expressions
	 SVG.regex = {
			 // Parse unit value
			 numberAndUnit:    /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i

				 // Parse hex value
				 , hex:              /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

					 // Parse rgb value
					 , rgb:              /rgb\((\d+),(\d+),(\d+)\)/

						 // Parse reference id
						 , reference:        /#([a-z0-9\-_]+)/i

							 // Parse matrix wrapper
							 , matrix:           /matrix\(|\)/g

								 // Elements of a matrix
								 , matrixElements:   /,*\s+|,/

									 // Whitespace
									 , whitespace:       /\s/g

										 // Test hex value
										 , isHex:            /^#[a-f0-9]{3,6}$/i

											 // Test rgb value
											 , isRgb:            /^rgb\(/

												 // Test css declaration
												 , isCss:            /[^:]+:[^;]+;?/

													 // Test for blank string
													 , isBlank:          /^(\s+)?$/

														 // Test for numeric string
														 , isNumber:         /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i

															 // Test for percent value
															 , isPercent:        /^-?[\d\.]+%$/

																 // Test for image url
																 , isImage:          /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i

																	 // The following regex are used to parse the d attribute of a path

																	 // Replaces all negative exponents
																	 , negExp:           /e\-/gi

																		 // Replaces all comma
																		 , comma:            /,/g

																			 // Replaces all hyphens
																			 , hyphen:           /\-/g

																				 // Replaces and tests for all path letters
																				 , pathLetters:      /[MLHVCSQTAZ]/gi

																					 // yes we need this one, too
																					 , isPathLetter:     /[MLHVCSQTAZ]/i

																						 // split at whitespaces
																						 , whitespaces:      /\s+/

																							 // matches X
																							 , X:                /X/g
	 }

	 SVG.utils = {
			 // Map function
			 map: function(array, block) {
				 var i
				 , il = array.length
				 , result = []

				 for (i = 0; i < il; i++)
					 result.push(block(array[i]))

					 return result
			 }

	 // Degrees to radians
	 , radians: function(d) {
		 return d % 360 * Math.PI / 180
	 }
	 // Radians to degrees
	 , degrees: function(r) {
		 return r * 180 / Math.PI % 360
	 }
	 , filterSVGElements: function(p) {
		 return [].filter.call(p, function(el){ return el instanceof SVGElement })
	 }

	 }

	 SVG.defaults = {
			 // Default attribute values
			 attrs: {
				 // fill and stroke
				 'fill-opacity':     1
				 , 'stroke-opacity':   1
				 , 'stroke-width':     0
				 , 'stroke-linejoin':  'miter'
					 , 'stroke-linecap':   'butt'
						 , fill:               '#000000'
							 , stroke:             '#000000'
								 , opacity:            1
								 // position
								 , x:                  0
								 , y:                  0
								 , cx:                 0
								 , cy:                 0
								 // size
								 , width:              0
								 , height:             0
								 // radius
								 , r:                  0
								 , rx:                 0
								 , ry:                 0
								 // gradient
								 , offset:             0
								 , 'stop-opacity':     1
								 , 'stop-color':       '#000000'
									 // text
									 , 'font-size':        16
									 , 'font-family':      'Helvetica, Arial, sans-serif'
										 , 'text-anchor':      'start'
			 }

	 }
//	 Module for color convertions
	 SVG.Color = function(color) {
		 var match

		 // initialize defaults
		 this.r = 0
		 this.g = 0
		 this.b = 0

		 // parse color
		 if (typeof color === 'string') {
			 if (SVG.regex.isRgb.test(color)) {
				 // get rgb values
				 match = SVG.regex.rgb.exec(color.replace(/\s/g,''))

				 // parse numeric values
				 this.r = parseInt(match[1])
				 this.g = parseInt(match[2])
				 this.b = parseInt(match[3])

			 } else if (SVG.regex.isHex.test(color)) {
				 // get hex values
				 match = SVG.regex.hex.exec(fullHex(color))

				 // parse numeric values
				 this.r = parseInt(match[1], 16)
				 this.g = parseInt(match[2], 16)
				 this.b = parseInt(match[3], 16)

			 }

		 } else if (typeof color === 'object') {
			 this.r = color.r;
			 this.g = color.g;
			 this.b = color.b;

		 }

	 }

	 SVG.extend(SVG.Color, {
		 // Default to hex conversion
		 toString: function() {
			 return this.toHex()
		 }
	 // Build hex value
	 , toHex: function() {
		 return '#'
		 + compToHex(this.r)
		 + compToHex(this.g)
		 + compToHex(this.b)
	 }
	 // Build rgb value
	 , toRgb: function() {
		 return 'rgb(' + [this.r, this.g, this.b].join() + ')'
	 }
	 // Calculate true brightness
	 , brightness: function() {
		 return (this.r / 255 * 0.30)
		 + (this.g / 255 * 0.59)
		 + (this.b / 255 * 0.11)
	 }
	 // Make color morphable
	 , morph: function(color) {
		 this.destination = new SVG.Color(color)

		 return this
	 }
	 // Get morphed color at given position
	 , at: function(pos) {
		 // make sure a destination is defined
		 if (!this.destination) return this

		 // normalise pos
		 pos = pos < 0 ? 0 : pos > 1 ? 1 : pos

				 // generate morphed color
				 return new SVG.Color({
					 r: ~~(this.r + (this.destination.r - this.r) * pos)
					 , g: ~~(this.g + (this.destination.g - this.g) * pos)
					 , b: ~~(this.b + (this.destination.b - this.b) * pos)
				 })
	 }

	 })

//	 Testers

//	 Test if given value is a color string
	 SVG.Color.test = function(color) {
		 color += ''
			 return (SVG.regex.isHex.test(color)
			 || SVG.regex.isRgb.test(color));
	 }

//	 Test if given value is a rgb object
	 SVG.Color.isRgb = function(color) {
		 return (color && typeof color.r == 'number'
			 && typeof color.g == 'number'
				 && typeof color.b == 'number');
	 }

//	 Test if given value is a color
	 SVG.Color.isColor = function(color) {
		 return (SVG.Color.isRgb(color) || SVG.Color.test(color));
	 }
//	 Module for array conversion
	 SVG.Array = function(array, fallback) {
		 array = (array || []).valueOf()

		 // if array is empty and fallback is provided, use fallback
		 if (array.length == 0 && fallback)
			 array = fallback.valueOf();

			 // parse array
			 this.value = this.parse(array);
	 }

	 SVG.extend(SVG.Array, {
		 // Make array morphable
		 morph: function(array) {
			 this.destination = this.parse(array)

			 // normalize length of arrays
			 if (this.value.length != this.destination.length) {
				 var lastValue       = this.value[this.value.length - 1]
				 , lastDestination = this.destination[this.destination.length - 1]

				 while(this.value.length > this.destination.length)
					 this.destination.push(lastDestination)
					 while(this.value.length < this.destination.length)
						 this.value.push(lastValue)
			 }

			 return this
		 }
	 // Clean up any duplicate points
	 , settle: function() {
		 // find all unique values
		 for (var i = 0, il = this.value.length, seen = []; i < il; i++)
			 if (seen.indexOf(this.value[i]) == -1)
				 seen.push(this.value[i])

				 // set new value
				 return this.value = seen
	 }
	 // Get morphed array at given position
	 , at: function(pos) {
		 // make sure a destination is defined
		 if (!this.destination) return this

		 // generate morphed array
		 for (var i = 0, il = this.value.length, array = []; i < il; i++)
			 array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos)

			 return new SVG.Array(array)
	 }
	 // Convert array to string
	 , toString: function() {
		 return this.value.join(' ')
	 }
	 // Real value
	 , valueOf: function() {
		 return this.value
	 }
	 // Parse whitespace separated string
	 , parse: function(array) {
		 array = array.valueOf()

		 // if already is an array, no need to parse it
		 if (Array.isArray(array)) return array

		 return this.split(array)
	 }
	 // Strip unnecessary whitespace
	 , split: function(string) {
		 return string.trim().split(/\s+/)
	 }
	 // Reverse array
	 , reverse: function() {
		 this.value.reverse()

		 return this
	 }

	 })
//	 Poly points array
	 SVG.PointArray = function(array, fallback) {
		 this.constructor.call(this, array, fallback || [[0,0]]);
	 }

//	 Inherit from SVG.Array
	 SVG.PointArray.prototype = new SVG.Array;

	 SVG.extend(SVG.PointArray, {
		 // Convert array to string
		 toString: function() {
			 // convert to a poly point string
			 for (var i = 0, il = this.value.length, array = []; i < il; i++)
				 array.push(this.value[i].join(','))

				 return array.join(' ')
		 }
	 // Convert array to line object
	 , toLine: function() {
		 return {
			 x1: this.value[0][0]
		 , y1: this.value[0][1]
		 , x2: this.value[1][0]
		 , y2: this.value[1][1]
		 }
	 }
	 // Get morphed array at given position
	 , at: function(pos) {
		 // make sure a destination is defined
		 if (!this.destination) return this

		 // generate morphed point string
		 for (var i = 0, il = this.value.length, array = []; i < il; i++)
			 array.push([
			             this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos
			             , this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos
			             ])

			             return new SVG.PointArray(array)
	 }
	 // Parse point string
	 , parse: function(array) {
		 array = array.valueOf()

		 // if already is an array, no need to parse it
		 if (Array.isArray(array)) return array

		 // split points
		 array = this.split(array)

		 // parse points
		 for (var i = 0, il = array.length, p, points = []; i < il; i++) {
			 p = array[i].split(',');
			 points.push([parseFloat(p[0]), parseFloat(p[1])]);
		 }

		 return points
	 }
	 // Move point string
	 , move: function(x, y) {
		 var box = this.bbox()

		 // get relative offset
		 x -= box.x
		 y -= box.y

		 // move every point
		 if (!isNaN(x) && !isNaN(y))
			 for (var i = this.value.length - 1; i >= 0; i--)
				 this.value[i] = [this.value[i][0] + x, this.value[i][1] + y]

		 return this
	 }
	 // Resize poly string
	 , size: function(width, height) {
		 var i, box = this.bbox()

		 // recalculate position of all points according to new size
		 for (i = this.value.length - 1; i >= 0; i--) {
			 this.value[i][0] = ((this.value[i][0] - box.x) * width)  / box.width  + box.x
			 this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y
		 }

		 return this
	 }
	 // Get bounding box of points
	 , bbox: function() {
		 SVG.parser.poly.setAttribute('points', this.toString())

		 return SVG.parser.poly.getBBox()
	 }

	 })
//	 Path points array
	 SVG.PathArray = function(array, fallback) {
		 this.constructor.call(this, array, fallback || [['M', 0, 0]]);
	 }

//	 Inherit from SVG.Array
	 SVG.PathArray.prototype = new SVG.Array;

	 SVG.extend(SVG.PathArray, {
		 // Convert array to string
		 toString: function() {
			 return arrayToString(this.value)
		 }
	 // Move path string
	 , move: function(x, y) {
		 // get bounding box of current situation
		 var box = this.bbox();

		 // get relative offset
		 x -= box.x;
		 y -= box.y;

		 if (!isNaN(x) && !isNaN(y)) {
			 // move every point
			 for (var l, i = this.value.length - 1; i >= 0; i--) {
				 l = this.value[i][0]

				 if (l == 'M' || l == 'L' || l == 'T')  {
					 this.value[i][1] += x;
					 this.value[i][2] += y;

				 } else if (l == 'H')  {
					 this.value[i][1] += x;

				 } else if (l == 'V')  {
					 this.value[i][1] += y;

				 } else if (l == 'C' || l == 'S' || l == 'Q')  {
					 this.value[i][1] += x;
					 this.value[i][2] += y;
					 this.value[i][3] += x;
					 this.value[i][4] += y;

					 if (l == 'C')  {
						 this.value[i][5] += x;
						 this.value[i][6] += y;
					 }

				 } else if (l == 'A')  {
					 this.value[i][6] += x;
					 this.value[i][7] += y;
				 }

			 }
		 }

		 return this;
	 }
	 // Resize path string
	 , size: function(width, height) {
		 // get bounding box of current situation
		 var i, l, box = this.bbox();

		 // recalculate position of all points according to new size
		 for (i = this.value.length - 1; i >= 0; i--) {
			 l = this.value[i][0];

			 if (l == 'M' || l == 'L' || l == 'T')  {
				 this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x;
				 this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y;

			 } else if (l == 'H')  {
				 this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x;

			 } else if (l == 'V')  {
				 this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y;

			 } else if (l == 'C' || l == 'S' || l == 'Q')  {
				 this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x;
				 this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y;
				 this.value[i][3] = ((this.value[i][3] - box.x) * width)  / box.width  + box.x;
				 this.value[i][4] = ((this.value[i][4] - box.y) * height) / box.height + box.y;

				 if (l == 'C')  {
					 this.value[i][5] = ((this.value[i][5] - box.x) * width)  / box.width  + box.x;
					 this.value[i][6] = ((this.value[i][6] - box.y) * height) / box.height + box.y;
				 }

			 } else if (l == 'A')  {
				 // resize radii
				 this.value[i][1] = (this.value[i][1] * width)  / box.width;
				 this.value[i][2] = (this.value[i][2] * height) / box.height;

				 // move position values
				 this.value[i][6] = ((this.value[i][6] - box.x) * width)  / box.width  + box.x;
				 this.value[i][7] = ((this.value[i][7] - box.y) * height) / box.height + box.y;
			 }

		 }

		 return this;
	 }
	 // Absolutize and parse path to array
	 , parse: function(array) {
		 // if it's already a patharray, no need to parse it
		 if (array instanceof SVG.PathArray) return array.valueOf()

		 // prepare for parsing
		 var i, x0, y0, s, seg, arr
		 , x = 0
		 , y = 0
		 , paramCnt = { 'M':2, 'L':2, 'H':1, 'V':1, 'C':6, 'S':4, 'Q':4, 'T':2, 'A':7 }

		 if(typeof array == 'string'){

			 array = array
			 .replace(SVG.regex.negExp, 'X')         // replace all negative exponents with certain char
			 .replace(SVG.regex.pathLetters, ' $& ') // put some room between letters and numbers
			 .replace(SVG.regex.hyphen, ' -')        // add space before hyphen
			 .replace(SVG.regex.comma, ' ')          // unify all spaces
			 .replace(SVG.regex.X, 'e-')             // add back the expoent
			 .trim()                                 // trim
			 .split(SVG.regex.whitespaces)           // split into array

			 // at this place there could be parts like ['3.124.854.32'] because we could not determine the point as seperator till now
			 // we fix this elements in the next loop
			 for(i = array.length; --i;){
				 if(array[i].indexOf('.') != array[i].lastIndexOf('.')){
					 var split = array[i].split('.') // split at the point
					 var first = [split.shift(), split.shift()].join('.') // join the first number together
					 array.splice.apply(array, [i, 1].concat(first, split.map(function(el){ return '.'+el }))) // add first and all other entries back to array
				 }
			 }

		 }else{
			 array = array.reduce(function(prev, curr){
				 return [].concat.apply(prev, curr)
			 }, [])
		 }

		 // array now is an array containing all parts of a path e.g. ['M', '0', '0', 'L', '30', '30' ...]

		 var arr = [];

		 do{

			 // Test if we have a path letter
			 if(SVG.regex.isPathLetter.test(array[0])){
				 s = array[0];
				 array.shift();
				 // If last letter was a move command and we got no new, it defaults to [L]ine
			 }else if(s == 'M'){
				 s = 'L';
			 }else if(s == 'm'){
				 s = 'l';
			 }else{
				 array.shift();
			 }

			 // add path letter as first element
			 seg = [s.toUpperCase()]

			 // push all necessary parameters to segment
			 for(i = 0; i < paramCnt[seg[0]]; ++i){
				 var val = parseFloat(array.shift());
				 var vall = ( isNaN(val) ) ? (isNaN(seg[seg.length-1]) ? 0 : seg[seg.length-1]) : val;
				 seg.push(vall);
			 }

			 // upper case
			 if(s == seg[0]){

				 if(s == 'M' || s == 'L' || s == 'C' || s == 'Q'){
					 x = seg[paramCnt[seg[0]]-1];
					 y = seg[paramCnt[seg[0]]];
				 }else if(s == 'V'){
					 y = seg[1];
				 }else if(s == 'H'){
					 x = seg[1];
				 }else if(s == 'A'){
					 x = seg[6];
					 y = seg[7];
				 }

				 // lower case
			 }else{

				 // convert relative to absolute values
				 if(s == 'm' || s == 'l' || s == 'c' || s == 's' || s == 'q' || s == 't'){

					 seg[1] += x;
					 seg[2] += y;

					 if(seg[3] != null){
						 seg[3] += x;
						 seg[4] += y;
					 }

					 if(seg[5] != null){
						 seg[5] += x;
						 seg[6] += y;
					 }

					 // move pointer
					 x = seg[paramCnt[seg[0]]-1];
					 y = seg[paramCnt[seg[0]]];

				 }else if(s == 'v'){
					 seg[1] += y;
					 y = seg[1];
				 }else if(s == 'h'){
					 seg[1] += x;
					 x = seg[1];
				 }else if(s == 'a'){
					 seg[6] += x;
					 seg[7] += y;
					 x = seg[6];
					 y = seg[7];
				 }

			 }

			 if(seg[0] == 'M'){
				 x0 = x;
				 y0 = y;
			 }

			 if(seg[0] == 'Z'){
				 x = x0;
				 y = y0;
			 }

			 arr.push(seg);

		 }while(array.length);

			 return arr;

	 }
	 // Get bounding box of path
	 , bbox: function() {
		 SVG.parser.path.setAttribute('d', this.toString());

		 return SVG.parser.path.getBBox();
	 }

	 })
//	 Module for unit convertions
	 SVG.Number = SVG.invent({
		 // Initialize
		 create: function(value, unit) {
			 // initialize defaults
			 this.value = 0;
			 this.unit  = unit || '';

			 // parse value
			 if (typeof value === 'number') {
				 // ensure a valid numeric value
				 this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value;

			 } else if (typeof value === 'string') {
				 unit = value.match(SVG.regex.numberAndUnit);

				 if (unit) {
					 // make value numeric
					 this.value = parseFloat(unit[1]);

					 // normalize
					 if (unit[5] == '%')
						 this.value /= 100;
						 else if (unit[5] == 's')
							 this.value *= 1000;

							 // store unit
							 this.unit = unit[5];
				 }

			 } else {
				 if (value instanceof SVG.Number) {
					 this.value = value.valueOf();
					 this.unit  = value.unit;
				 }
			 }

		 }
	 // Add methods
	 , extend: {
		 // Stringalize
		 toString: function() {
			 return (
					 this.unit == '%' ?
							 ~~(this.value * 1e8) / 1e6:
								 this.unit == 's' ?
										 this.value / 1e3 :
											 this.value
			 ) + this.unit
		 }
	 , toJSON: function() {
		 return this.toString()
	 }
	 , // Convert to primitive
	 valueOf: function() {
		 return this.value
	 }
	 // Add number
	 , plus: function(number) {
		 return new SVG.Number(this + new SVG.Number(number), this.unit)
	 }
	 // Subtract number
	 , minus: function(number) {
		 return this.plus(-new SVG.Number(number))
	 }
	 // Multiply number
	 , times: function(number) {
		 return new SVG.Number(this * new SVG.Number(number), this.unit)
	 }
	 // Divide number
	 , divide: function(number) {
		 return new SVG.Number(this / new SVG.Number(number), this.unit)
	 }
	 // Convert to different unit
	 , to: function(unit) {
		 var number = new SVG.Number(this)

		 if (typeof unit === 'string')
			 number.unit = unit

			 return number
	 }
	 // Make number morphable
	 , morph: function(number) {
		 this.destination = new SVG.Number(number)

		 return this
	 }
	 // Get morphed number at given position
	 , at: function(pos) {
		 // Make sure a destination is defined
		 if (!this.destination) return this

		 // Generate new morphed number
		 return new SVG.Number(this.destination)
		 .minus(this)
		 .times(pos)
		 .plus(this)
	 }

	 }
	 })

	 SVG.ViewBox = function(element) {
		 var x, y, width, height
		 , wm   = 1 // width multiplier
		 , hm   = 1 // height multiplier
		 , box  = element.bbox()
		 , view = (element.attr('viewBox') || '').match(/-?[\d\.]+/g)
		 , we   = element
		 , he   = element;

		 // get dimensions of current node
		 width  = new SVG.Number(element.width());
		 height = new SVG.Number(element.height());

		 // find nearest non-percentual dimensions
		 while (width.unit == '%') {
			 wm *= width.value;
			 width = new SVG.Number(we instanceof SVG.Doc ? we.parent().offsetWidth : we.parent().width());
			 we = we.parent();
		 }
		 while (height.unit == '%') {
			 hm *= height.value;
			 height = new SVG.Number(he instanceof SVG.Doc ? he.parent().offsetHeight : he.parent().height());
			 he = he.parent();
		 }

		 // ensure defaults
		 this.x      = box.x;
		 this.y      = box.y;
		 this.width  = width  * wm;
		 this.height = height * hm;
		 this.zoom   = 1;

		 if (view) {
			 // get width and height from viewbox
			 x      = parseFloat(view[0]);
			 y      = parseFloat(view[1]);
			 width  = parseFloat(view[2]);
			 height = parseFloat(view[3]);

			 // calculate zoom accoring to viewbox
			 this.zoom = ((this.width / this.height) > (width / height)) ?
					 this.height / height :
						 this.width  / width;

						 // calculate real pixel dimensions on parent SVG.Doc element
						 this.x      = x;
						 this.y      = y;
						 this.width  = width;
						 this.height = height;

		 }

	 }


	 SVG.extend(SVG.ViewBox, {
		 // Parse viewbox to string
		 toString: function() {
			 return (this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height);
		 }

	 })

	 SVG.Element = SVG.invent({
		 // Initialize node
		 create: function(node) {
			 // make stroke value accessible dynamically
			 this._stroke = SVG.defaults.attrs.stroke

			 // initialize data object
			 this.dom = {}

			 // create circular reference
			 if (this.node = node) {
				 this.type = node.nodeName;
				 this.node.instance = this;

				 // store current attribute value
				 this._stroke = node.getAttribute('stroke') || this._stroke;
			 }
		 }

	 // Add class methods
	 , extend: {
		 // Move over x-axis
		 x: function(x) {
			 return this.attr('x', x);
		 }
	 // Move over y-axis
	 , y: function(y) {
		 return this.attr('y', y);
	 }
	 // Move by center over x-axis
	 , cx: function(x) {
		 return (x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2));
	 }
	 // Move by center over y-axis
	 , cy: function(y) {
		 return (y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2));
	 }
	 // Move element to given x and y values
	 , move: function(x, y) {
		 return this.x(x).y(y);
	 }
	 // Move element by its center
	 , center: function(x, y) {
		 return this.cx(x).cy(y);
	 }
	 // Set width of element
	 , width: function(width) {
		 return this.attr('width', width);
	 }
	 // Set height of element
	 , height: function(height) {
		 return this.attr('height', height);
	 }
	 // Set element size to given width and height
	 , size: function(width, height) {
		 var p = proportionalSize(this.bbox(), width, height);

		 return (this
		 .width(new SVG.Number(p.width))
		 .height(new SVG.Number(p.height)));
	 }
	 // Clone element
	 , clone: function() {
		 // clone element and assign new id
		 var clone = assignNewId(this.node.cloneNode(true));

		 // insert the clone after myself
		 this.after(clone);

		 return clone;
	 }
	 // Remove element
	 , remove: function() {
		 if (this.parent())
			 this.parent().removeElement(this);

			 return this;
	 }
	 // Replace element
	 , replace: function(element) {
		 this.after(element).remove();

		 return element;
	 }
	 // Add element to given container and return self
	 , addTo: function(parent) {
		 return parent.put(this);
	 }
	 // Add element to given container and return container
	 , putIn: function(parent) {
		 return parent.add(this);
	 }
	 // Get / set id
	 , id: function(id) {
		 return this.attr('id', id);
	 }
	 // Checks whether the given point inside the bounding box of the element
	 , inside: function(x, y) {
		 var box = this.bbox();

		 return (x > box.x
		 && y > box.y
		 && x < box.x + box.width
		 && y < box.y + box.height);
	 }
	 // Show element
	 , show: function() {
		 return (this.style('display', ''));
	 }
	 // Hide element
	 , hide: function() {
		 return (this.style('display', 'none'));
	 }
	 // Is element visible?
	 , visible: function() {
		 return (this.style('display') != 'none');
	 }
	 // Return id on string conversion
	 , toString: function() {
		 return this.attr('id');
	 }
	 // Return array of classes on the node
	 , classes: function() {
		 var attr = this.attr('class');

		 return (attr == null ? [] : attr.trim().split(/\s+/));
	 }
	 // Return true if class exists on the node, false otherwise
	 , hasClass: function(name) {
		 return (this.classes().indexOf(name) != -1);
	 }
	 // Add class to the node
	 , addClass: function(name) {
		 if (!this.hasClass(name)) {
			 var array = this.classes();
			 array.push(name);
			 this.attr('class', array.join(' '));
		 }

		 return this;
	 }
	 // Remove class from the node
	 , removeClass: function(name) {
		 if (this.hasClass(name)) {
			 this.attr('class', this.classes().filter(function(c) {
				 return c != name
			 }).join(' '))
		 }

		 return this;
	 }
	 // Toggle the presence of a class on the node
	 , toggleClass: function(name) {
		 return (this.hasClass(name) ? this.removeClass(name) : this.addClass(name));
	 }
	 // Get referenced element form attribute value
	 , reference: function(attr) {
		 return SVG.get(this.attr(attr));
	 }
	 // Returns the parent element instance
	 , parent: function(type) {
		 var parent = this;

		 // check for parent
		 if(!parent.node.parentNode)
			 return null;

		 // get parent element
		 parent = SVG.adopt(parent.node.parentNode);

		 if(!type)
			 return parent;

		 // loop trough ancestors if type is given
		 while(parent.node instanceof SVGElement){
			 if(typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent;
			 parent = SVG.adopt(parent.node.parentNode);
		 }
	 }
	 // Get parent document
	 , doc: function() {
		 return (this instanceof SVG.Doc ? this : this.parent(SVG.Doc));
	 }
	 // return array of all ancestors of given type up to the root svg
	 , parents: function(type) {
		 var parents = [], parent = this;

		 do{
			 parent = parent.parent(type);
			 if(!parent || !parent.node) break;

			 parents.push(parent);
		 } while(parent.parent)

			 return parents;
	 }
	 // matches the element vs a css selector
	 , matches: function(selector){
		 return matches(this.node, selector);
	 }
	 // Returns the svg node to call native svg methods on it
	 , native: function() {
		 return this.node
	 }
	 // Import raw svg
	 , svg: function(svg) {
		 // create temporary holder
		 var well = document.createElement('svg')

		 // act as a setter if svg is given
		 if (svg && this instanceof SVG.Parent) {
			 // dump raw svg
			 well.innerHTML = '<svg>' + svg.replace(/\n/, '').replace(/<(\w+)([^<]+?)\/>/g, '<$1$2></$1>') + '</svg>'

			 // transplant nodes
			 for (var i = 0, il = well.firstChild.childNodes.length; i < il; i++)
				 this.node.appendChild(well.firstChild.firstChild)

				 // otherwise act as a getter
		 } else {
			 // create a wrapping svg element in case of partial content
			 well.appendChild(svg = document.createElement('svg'))

			 // write svgjs data to the dom
			 this.writeDataToDom()

			 // insert a copy of this node
			 svg.appendChild(this.node.cloneNode(true))

			 // return target element
			 return well.innerHTML.replace(/^<svg>/, '').replace(/<\/svg>$/, '')
		 }

		 return this
	 }
	 // write svgjs data to the dom
	 , writeDataToDom: function() {

		 // dump variables recursively
		 if(this.each || this.lines){
			 var fn = this.each ? this : this.lines();
			 fn.each(function(){
				 this.writeDataToDom()
			 })
		 }

		 // remove previously set data
		 this.node.removeAttribute('svgjs:data')

		 if(Object.keys(this.dom).length)
			 this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)) // see #428

			 return this
	 }
	 // set given data to the elements data property
	 , setData: function(o){
		 this.dom = o
		 return this
	 }
	 }
	 })

	 SVG.FX = SVG.invent({
		 // Initialize FX object
		 create: function(element) {
			 // store target element
			 this.target = element
		 }

	 // Add class methods
	 , extend: {
		 // Add animation parameters and start animation
		 animate: function(d, ease, delay) {
			 var akeys, skeys, key
			 , element = this.target
			 , fx = this

			 // dissect object if one is passed
			 if (typeof d == 'object') {
				 delay = d.delay
				 ease = d.ease
				 d = d.duration
			 }

			 // ensure default duration and easing
			 d = d == '=' ? d : d == null ? 1000 : new SVG.Number(d).valueOf()
					 ease = ease || '<>'

					 // process values
					 fx.at = function(pos) {
				 var i

				 // normalise pos
				 pos = pos < 0 ? 0 : pos > 1 ? 1 : pos

						 // collect attribute keys
						 if (akeys == null) {
							 akeys = []
							 for (key in fx.attrs)
								 akeys.push(key)

								 // make sure morphable elements are scaled, translated and morphed all together
								 if (element.morphArray && (fx.destination.plot || akeys.indexOf('points') > -1)) {
									 // get destination
									 var box
									 , p = new element.morphArray(fx.destination.plot || fx.attrs.points || element.array())

									 // add size
									 if (fx.destination.size)
										 p.size(fx.destination.size.width.to, fx.destination.size.height.to)

										 // add movement
										 box = p.bbox()
										 if (fx.destination.x)
											 p.move(fx.destination.x.to, box.y)
											 else if (fx.destination.cx)
												 p.move(fx.destination.cx.to - box.width / 2, box.y)

												 box = p.bbox()
												 if (fx.destination.y)
													 p.move(box.x, fx.destination.y.to)
													 else if (fx.destination.cy)
														 p.move(box.x, fx.destination.cy.to - box.height / 2)

														 // reset destination values
														 fx.destination = {
															 plot: element.array().morph(p)
													 }
								 }
						 }

				 // collect style keys
				 if (skeys == null) {
					 skeys = []
					 for (key in fx.styles)
						 skeys.push(key)
				 }

				 // apply easing
				 pos = ease == '<>' ?
						 (-Math.cos(pos * Math.PI) / 2) + 0.5 :
							 ease == '>' ?
									 Math.sin(pos * Math.PI / 2) :
										 ease == '<' ?
												 -Math.cos(pos * Math.PI / 2) + 1 :
													 ease == '-' ?
															 pos :
																 typeof ease == 'function' ?
																		 ease(pos) :
																			 pos

																			 // run plot function
																			 if (fx.destination.plot) {
																				 element.plot(fx.destination.plot.at(pos))

																			 } else {
																				 // run all x-position properties
																				 if (fx.destination.x)
																					 element.x(fx.destination.x.at(pos))
																					 else if (fx.destination.cx)
																						 element.cx(fx.destination.cx.at(pos))

																						 // run all y-position properties
																						 if (fx.destination.y)
																							 element.y(fx.destination.y.at(pos))
																							 else if (fx.destination.cy)
																								 element.cy(fx.destination.cy.at(pos))

																								 // run all size properties
																								 if (fx.destination.size)
																									 element.size(fx.destination.size.width.at(pos), fx.destination.size.height.at(pos))
																			 }

																		 // run all viewbox properties
																		 if (fx.destination.viewbox)
																			 element.viewbox(
																					 fx.destination.viewbox.x.at(pos)
																					 , fx.destination.viewbox.y.at(pos)
																					 , fx.destination.viewbox.width.at(pos)
																					 , fx.destination.viewbox.height.at(pos)
																			 )

																			 // run leading property
																			 if (fx.destination.leading)
																				 element.leading(fx.destination.leading.at(pos))

																				 // animate attributes
																				 for (i = akeys.length - 1; i >= 0; i--)
																					 element.attr(akeys[i], at(fx.attrs[akeys[i]], pos))

																					 // animate styles
																					 for (i = skeys.length - 1; i >= 0; i--)
																						 element.style(skeys[i], at(fx.styles[skeys[i]], pos))

																						 // callback for each keyframe
																						 if (fx.situation.during)
																							 fx.situation.during.call(element, pos, function(from, to) {
																								 return at({ from: from, to: to }, pos)
																							 })
			 }

			 if (typeof d === 'number') {
				 // delay animation
				 this.timeout = setTimeout(function() {
					 var start = new Date().getTime()

					 // initialize situation object
					 fx.situation.start    = start
					 fx.situation.play     = true
					 fx.situation.finish   = start + d
					 fx.situation.duration = d
					 fx.situation.ease     = ease

					 // render function
					 fx.render = function() {

						 if (fx.situation.play === true) {
							 // calculate pos
							 var time = new Date().getTime()
							 , pos = time > fx.situation.finish ? 1 : (time - fx.situation.start) / d

									 // reverse pos if animation is reversed
									 if (fx.situation.reversing)
										 pos = -pos + 1

										 // process values
										 fx.at(pos)

										 // finish off animation
										 if (time > fx.situation.finish) {
											 if (fx.destination.plot)
												 element.plot(new SVG.PointArray(fx.destination.plot.destination).settle())

												 if (fx.situation.loop === true || (typeof fx.situation.loop == 'number' && fx.situation.loop > 0)) {
													 // register reverse
													 if (fx.situation.reverse)
														 fx.situation.reversing = !fx.situation.reversing

														 if (typeof fx.situation.loop == 'number') {
															 // reduce loop count
															 if (!fx.situation.reverse || fx.situation.reversing)
																 --fx.situation.loop

																 // remove last loop if reverse is disabled
																 if (!fx.situation.reverse && fx.situation.loop == 1)
																	 --fx.situation.loop
														 }

													 fx.animate(d, ease, delay)
												 } else {
													 fx.situation.after ? fx.situation.after.apply(element, [fx]) : fx.stop()
												 }

										 } else {
											 fx.animationFrame = requestAnimationFrame(fx.render)
										 }
						 } else {
							 fx.animationFrame = requestAnimationFrame(fx.render)
						 }

					 }

					 // start animation
					 fx.render()

				 }, new SVG.Number(delay).valueOf())
			 }

			 return this
		 }
	 // Get bounding box of target element
	 , bbox: function() {
		 return this.target.bbox()
	 }
	 // Add animatable attributes
	 , attr: function(a, v) {
		 // apply attributes individually
		 if (typeof a == 'object') {
			 for (var key in a)
				 this.attr(key, a[key])

		 } else {
			 // get the current state
			 var from = this.target.attr(a)

			 // detect format
			 if (a == 'transform') {
				 // merge given transformation with an existing one
				 if (this.attrs[a])
					 v = this.attrs[a].destination.multiply(v)

					 // prepare matrix for morphing
					 this.attrs[a] = (new SVG.Matrix(this.target)).morph(v)

					 // add parametric rotation values
					 if (this.param) {
						 // get initial rotation
						 v = this.target.transform('rotation')

						 // add param
						 this.attrs[a].param = {
							 from: this.target.param || { rotation: v, cx: this.param.cx, cy: this.param.cy }
						 , to:   this.param
						 }
					 }

			 } else {
				 this.attrs[a] = SVG.Color.isColor(v) ?
						 // prepare color for morphing
						 new SVG.Color(from).morph(v) :
							 SVG.regex.numberAndUnit.test(v) ?
									 // prepare number for morphing
									 new SVG.Number(from).morph(v) :
										 // prepare for plain morphing
									 { from: from, to: v }
			 }
		 }

		 return this
	 }
	 // Add animatable styles
	 , style: function(s, v) {
		 if (typeof s == 'object')
			 for (var key in s)
				 this.style(key, s[key])

				 else
					 this.styles[s] = { from: this.target.style(s), to: v }

		 return this
	 }
	 // Animatable x-axis
	 , x: function(x) {
		 this.destination.x = new SVG.Number(this.target.x()).morph(x)

		 return this
	 }
	 // Animatable y-axis
	 , y: function(y) {
		 this.destination.y = new SVG.Number(this.target.y()).morph(y)

		 return this
	 }
	 // Animatable center x-axis
	 , cx: function(x) {
		 this.destination.cx = new SVG.Number(this.target.cx()).morph(x)

		 return this
	 }
	 // Animatable center y-axis
	 , cy: function(y) {
		 this.destination.cy = new SVG.Number(this.target.cy()).morph(y)

		 return this
	 }
	 // Add animatable move
	 , move: function(x, y) {
		 return this.x(x).y(y)
	 }
	 // Add animatable center
	 , center: function(x, y) {
		 return this.cx(x).cy(y)
	 }
	 // Add animatable size
	 , size: function(width, height) {
		 if (this.target instanceof SVG.Text) {
			 // animate font size for Text elements
			 this.attr('font-size', width)

		 } else {
			 // animate bbox based size for all other elements
			 var box = this.target.bbox()

			 this.destination.size = {
				 width:  new SVG.Number(box.width).morph(width)
				 , height: new SVG.Number(box.height).morph(height)
			 }
		 }

		 return this
	 }
	 // Add animatable plot
	 , plot: function(p) {
		 this.destination.plot = p

		 return this
	 }
	 // Add leading method
	 , leading: function(value) {
		 if (this.target.destination.leading)
			 this.destination.leading = new SVG.Number(this.target.destination.leading).morph(value)

			 return this
	 }
	 // Add animatable viewbox
	 , viewbox: function(x, y, width, height) {
		 if (this.target instanceof SVG.Container) {
			 var box = this.target.viewbox()

			 this.destination.viewbox = {
				 x:      new SVG.Number(box.x).morph(x)
				 , y:      new SVG.Number(box.y).morph(y)
				 , width:  new SVG.Number(box.width).morph(width)
				 , height: new SVG.Number(box.height).morph(height)
			 }
		 }

		 return this
	 }
	 // Add animateable gradient update
	 , update: function(o) {
		 if (this.target instanceof SVG.Stop) {
			 if (o.opacity != null) this.attr('stop-opacity', o.opacity)
			 if (o.color   != null) this.attr('stop-color', o.color)
			 if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))
		 }

		 return this
	 }
	 // Add callback for each keyframe
	 , during: function(during) {
		 this.situation.during = during

		 return this
	 }
	 // Callback after animation
	 , after: function(after) {
		 this.situation.after = after

		 return this
	 }
	 // Make loopable
	 , loop: function(times, reverse) {
		 // store current loop and total loops
		 this.situation.loop = this.situation.loops = times || true

		 // make reversable
		 this.situation.reverse = !!reverse

		 return this
	 }
	 // Stop running animation
	 , stop: function(fulfill) {
		 // fulfill animation
		 if (fulfill === true) {

			 this.animate(0)

			 if (this.situation.after)
				 this.situation.after.apply(this.target, [this])

		 } else {
			 // stop current animation
			 clearTimeout(this.timeout)
			 cancelAnimationFrame(this.animationFrame);

			 // reset storage for properties
			 this.attrs       = {}
			 this.styles      = {}
			 this.situation   = {}
			 this.destination = {}
		 }

		 return this
	 }
	 // Pause running animation
	 , pause: function() {
		 if (this.situation.play === true) {
			 this.situation.play  = false
			 this.situation.pause = new Date().getTime()
		 }

		 return this
	 }
	 // Play running animation
	 , play: function() {
		 if (this.situation.play === false) {
			 var pause = new Date().getTime() - this.situation.pause

			 this.situation.finish += pause
			 this.situation.start  += pause
			 this.situation.play    = true
		 }

		 return this
	 }

	 }

	 // Define parent class
	 , parent: SVG.Element

	 // Add method to parent elements
	 , construct: {
		 // Get fx module or create a new one, then animate with given duration and ease
		 animate: function(d, ease, delay) {
			 return (this.fx || (this.fx = new SVG.FX(this))).stop().animate(d, ease, delay)
		 }
	 // Stop current animation; this is an alias to the fx instance
	 , stop: function(fulfill) {
		 if (this.fx)
			 this.fx.stop(fulfill)

			 return this
	 }
	 // Pause current animation
	 , pause: function() {
		 if (this.fx)
			 this.fx.pause()

			 return this
	 }
	 // Play paused current animation
	 , play: function() {
		 if (this.fx)
			 this.fx.play()

			 return this
	 }

	 }
	 })

	 SVG.BBox = SVG.invent({
		 // Initialize
		 create: function(element) {
			 // get values if element is given
			 if (element) {
				 var box

				 // yes this is ugly, but Firefox can be a bitch when it comes to elements that are not yet rendered
				 try {
					 // find native bbox
					 box = element.node.getBBox()
				 } catch(e) {
					 if(element instanceof SVG.Shape){
						 var clone = element.clone().addTo(SVG.parser.draw)
						 box = clone.bbox()
						 clone.remove()
					 }else{
						 box = {
								 x:      element.node.clientLeft
								 , y:      element.node.clientTop
								 , width:  element.node.clientWidth
								 , height: element.node.clientHeight
						 }
					 }
				 }

				 // plain x and y
				 this.x = box.x
				 this.y = box.y

				 // plain width and height
				 this.width  = box.width
				 this.height = box.height
			 }

			 // add center, right and bottom
			 fullBox(this)
		 }

	 // Define Parent
	 , parent: SVG.Element

	 // Constructor
	 , construct: {
		 // Get bounding box
		 bbox: function() {
			 return new SVG.BBox(this)
		 }
	 }

	 })

	 SVG.TBox = SVG.invent({
		 // Initialize
		 create: function(element) {
			 // get values if element is given
			 if (element) {
				 var t   = element.ctm().extract()
				 , box = element.bbox()

				 // width and height including transformations
				 this.width  = box.width  * t.scaleX
				 this.height = box.height * t.scaleY

				 // x and y including transformations
				 this.x = box.x + t.x
				 this.y = box.y + t.y
			 }

			 // add center, right and bottom
			 fullBox(this)
		 }

	 // Define Parent
	 , parent: SVG.Element

	 // Constructor
	 , construct: {
		 // Get transformed bounding box
		 tbox: function() {
			 return new SVG.TBox(this)
		 }
	 }

	 })


	 SVG.RBox = SVG.invent({
		 // Initialize
		 create: function(element) {
			 if (element) {
				 var e    = element.doc().parent()
				 , box  = element.node.getBoundingClientRect()
				 , zoom = 1

				 // get screen offset
				 this.x = box.left
				 this.y = box.top

				 // subtract parent offset
				 this.x -= e.offsetLeft
				 this.y -= e.offsetTop

				 while (e = e.offsetParent) {
					 this.x -= e.offsetLeft
					 this.y -= e.offsetTop
				 }

				 // calculate cumulative zoom from svg documents
				 e = element
				 while (e.parent && (e = e.parent())) {
					 if (e.viewbox) {
						 zoom *= e.viewbox().zoom
						 this.x -= e.x() || 0
						 this.y -= e.y() || 0
					 }
				 }

				 // recalculate viewbox distortion
				 this.width  = box.width  /= zoom
				 this.height = box.height /= zoom
			 }

			 // add center, right and bottom
			 fullBox(this)

			 // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
			 this.x += window.pageXOffset
			 this.y += window.pageYOffset
		 }

	 // define Parent
	 , parent: SVG.Element

	 // Constructor
	 , construct: {
		 // Get rect box
		 rbox: function() {
			 return new SVG.RBox(this)
		 }
	 }

	 })

//	 Add universal merge method
	 ;[SVG.BBox, SVG.TBox, SVG.RBox].forEach(function(c) {

		 SVG.extend(c, {
			 // Merge rect box with another, return a new instance
			 merge: function(box) {
				 var b = new c()

				 // merge boxes
				 b.x      = Math.min(this.x, box.x)
				 b.y      = Math.min(this.y, box.y)
				 b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
				 b.height = Math.max(this.y + this.height, box.y + box.height) - b.y

				 return fullBox(b)
			 }

		 })

	 })

	 SVG.Matrix = SVG.invent({
		 // Initialize
		 create: function(source) {
			 var i, base = arrayToMatrix([1, 0, 0, 1, 0, 0])

			 // ensure source as object
			 source = source instanceof SVG.Element ?
					 source.matrixify() :
						 typeof source === 'string' ?
								 stringToMatrix(source) :
									 arguments.length == 6 ?
											 arrayToMatrix([].slice.call(arguments)) :
												 typeof source === 'object' ?
														 source : base

														 // merge source
														 for (i = abcdef.length - 1; i >= 0; i--)
															 this[abcdef[i]] = source && typeof source[abcdef[i]] === 'number' ?
																	 source[abcdef[i]] : base[abcdef[i]]
		 }

	 // Add methods
	 , extend: {
		 // Extract individual transformations
		 extract: function() {
			 // find delta transform points
			 var px    = deltaTransformPoint(this, 0, 1)
			 , py    = deltaTransformPoint(this, 1, 0)
			 , skewX = 180 / Math.PI * Math.atan2(px.y, px.x) - 90

			 return {
				 // translation
				 x:        this.e
				 , y:        this.f
				 // skew
				 , skewX:    -skewX
				 , skewY:    180 / Math.PI * Math.atan2(py.y, py.x)
				 // scale
				 , scaleX:   Math.sqrt(this.a * this.a + this.b * this.b)
				 , scaleY:   Math.sqrt(this.c * this.c + this.d * this.d)
				 // rotation
				 , rotation: skewX
				 , a: this.a
				 , b: this.b
				 , c: this.c
				 , d: this.d
				 , e: this.e
				 , f: this.f
			 }
		 }
	 // Clone matrix
	 , clone: function() {
		 return new SVG.Matrix(this)
	 }
	 // Morph one matrix into another
	 , morph: function(matrix) {
		 // store new destination
		 this.destination = new SVG.Matrix(matrix)

		 return this
	 }
	 // Get morphed matrix at a given position
	 , at: function(pos) {
		 // make sure a destination is defined
		 if (!this.destination) return this

		 // calculate morphed matrix at a given position
		 var matrix = new SVG.Matrix({
			 a: this.a + (this.destination.a - this.a) * pos
			 , b: this.b + (this.destination.b - this.b) * pos
			 , c: this.c + (this.destination.c - this.c) * pos
			 , d: this.d + (this.destination.d - this.d) * pos
			 , e: this.e + (this.destination.e - this.e) * pos
			 , f: this.f + (this.destination.f - this.f) * pos
		 })

		 // process parametric rotation if present
		 if (this.param && this.param.to) {
			 // calculate current parametric position
			 var param = {
					 rotation: this.param.from.rotation + (this.param.to.rotation - this.param.from.rotation) * pos
					 , cx:       this.param.from.cx
					 , cy:       this.param.from.cy
			 }

			 // rotate matrix
			 matrix = matrix.rotate(
					 (this.param.to.rotation - this.param.from.rotation * 2) * pos
					 , param.cx
					 , param.cy
			 )

			 // store current parametric values
			 matrix.param = param
		 }

		 return matrix
	 }
	 // Multiplies by given matrix
	 , multiply: function(matrix) {
		 return new SVG.Matrix(this.native().multiply(parseMatrix(matrix).native()))
	 }
	 // Inverses matrix
	 , inverse: function() {
		 return new SVG.Matrix(this.native().inverse())
	 }
	 // Translate matrix
	 , translate: function(x, y) {
		 return new SVG.Matrix(this.native().translate(x || 0, y || 0))
	 }
	 // Scale matrix
	 , scale: function(x, y, cx, cy) {
		 // support universal scale
		 if (arguments.length == 1 || arguments.length == 3)
			 y = x
			 if (arguments.length == 3) {
				 cy = cx
				 cx = y
			 }

		 return this.around(cx, cy, new SVG.Matrix(x, 0, 0, y, 0, 0))
	 }
	 // Rotate matrix
	 , rotate: function(r, cx, cy) {
		 // convert degrees to radians
		 r = SVG.utils.radians(r)

		 return this.around(cx, cy, new SVG.Matrix(Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0))
	 }
	 // Flip matrix on x or y, at a given offset
	 , flip: function(a, o) {
		 return a == 'x' ? this.scale(-1, 1, o, 0) : this.scale(1, -1, 0, o)
	 }
	 // Skew
	 , skew: function(x, y, cx, cy) {
		 return this.around(cx, cy, this.native().skewX(x || 0).skewY(y || 0))
	 }
	 // SkewX
	 , skewX: function(x, cx, cy) {
		 return this.around(cx, cy, this.native().skewX(x || 0))
	 }
	 // SkewY
	 , skewY: function(y, cx, cy) {
		 return this.around(cx, cy, this.native().skewY(y || 0))
	 }
	 // Transform around a center point
	 , around: function(cx, cy, matrix) {
		 return this
		 .multiply(new SVG.Matrix(1, 0, 0, 1, cx || 0, cy || 0))
		 .multiply(matrix)
		 .multiply(new SVG.Matrix(1, 0, 0, 1, -cx || 0, -cy || 0))
	 }
	 // Convert to native SVGMatrix
	 , native: function() {
		 // create new matrix
		 var matrix = SVG.parser.draw.node.createSVGMatrix()

		 // update with current values
		 for (var i = abcdef.length - 1; i >= 0; i--)
			 matrix[abcdef[i]] = this[abcdef[i]]

		 return matrix
	 }
	 // Convert matrix to string
	 , toString: function() {
		 return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')'
	 }
	 }

	 // Define parent
	 , parent: SVG.Element

	 // Add parent method
	 , construct: {
		 // Get current matrix
		 ctm: function() {
			 return new SVG.Matrix(this.node.getCTM())
		 },
		 // Get current screen matrix
		 screenCTM: function() {
			 return new SVG.Matrix(this.node.getScreenCTM())
		 }

	 }

	 })

	 SVG.Point = SVG.invent({
		 // Initialize
		 create: function(x,y) {
			 var i, source, base = {x:0, y:0}

			 // ensure source as object
			 source = Array.isArray(x) ?
					 {x:x[0], y:x[1]} :
						 typeof x === 'object' ?
								 {x:x.x, y:x.y} :
									 y != null ?
											 {x:x, y:y} : base

											 // merge source
											 this.x = source.x
											 this.y = source.y
		 }

	 // Add methods
	 , extend: {
		 // Clone point
		 clone: function() {
			 return new SVG.Point(this)
		 }
	 // Morph one point into another
	 , morph: function(point) {
		 // store new destination
		 this.destination = new SVG.Point(point)

		 return this
	 }
	 // Get morphed point at a given position
	 , at: function(pos) {
		 // make sure a destination is defined
		 if (!this.destination) return this

		 // calculate morphed matrix at a given position
		 var point = new SVG.Point({
			 x: this.x + (this.destination.x - this.x) * pos
			 , y: this.y + (this.destination.y - this.y) * pos
		 })

		 return point
	 }
	 // Convert to native SVGPoint
	 , native: function() {
		 // create new point
		 var point = SVG.parser.draw.node.createSVGPoint()

		 // update with current values
		 point.x = this.x
		 point.y = this.y

		 return point
	 }
	 // transform point with matrix
	 , transform: function(matrix) {
		 return new SVG.Point(this.native().matrixTransform(matrix.native()))
	 }

	 }

	 })

	 SVG.extend(SVG.Element, {

		 // Get point
		 point: function(x, y) {
			 return new SVG.Point(x,y).transform(this.screenCTM().inverse());
		 }

	 })

	 SVG.extend(SVG.Element, {
		 // Set svg element attribute
		 attr: function(a, v, n) {
			 // act as full getter
			 if (a == null) {
				 // get an object of attributes
				 a = {}
				 v = this.node.attributes
				 for (n = v.length - 1; n >= 0; n--)
					 a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue) ? parseFloat(v[n].nodeValue) : v[n].nodeValue

							 return a

			 } else if (typeof a == 'object') {
				 // apply every attribute individually if an object is passed
				 for (v in a) this.attr(v, a[v])

			 } else if (v === null) {
				 // remove value
				 this.node.removeAttribute(a)

			 } else if (v == null) {
				 // act as a getter if the first and only argument is not an object
				 v = this.node.getAttribute(a)
				 return v == null ?
						 SVG.defaults.attrs[a] :
							 SVG.regex.isNumber.test(v) ?
									 parseFloat(v) : v

			 } else {
				 // BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0
				 if (a == 'stroke-width')
					 this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
					 else if (a == 'stroke')
						 this._stroke = v

						 // convert image fill and stroke to patterns
						 if (a == 'fill' || a == 'stroke') {
							 if (SVG.regex.isImage.test(v))
								 v = this.doc().defs().image(v, 0, 0)

								 if (v instanceof SVG.Image)
									 v = this.doc().defs().pattern(0, 0, function() {
										 this.add(v)
									 })
						 }

				 // ensure correct numeric values (also accepts NaN and Infinity)
				 if (typeof v === 'number')
					 v = new SVG.Number(v)

				 // ensure full hex color
				 else if (SVG.Color.isColor(v))
					 v = new SVG.Color(v)

				 // parse array values
				 else if (Array.isArray(v))
					 v = new SVG.Array(v)

				 // store parametric transformation values locally
				 else if (v instanceof SVG.Matrix && v.param)
					 this.param = v.param

					 // if the passed attribute is leading...
					 if (a == 'leading') {
						 // ... call the leading method instead
						 if (this.leading)
							 this.leading(v)
					 } else {
						 // set given attribute on node
						 typeof n === 'string' ?
								 this.node.setAttributeNS(n, a, v.toString()) :
									 this.node.setAttribute(a, v.toString())
					 }

				 // rebuild if required
				 if (this.rebuild && (a == 'font-size' || a == 'x'))
					 this.rebuild(a, v)
			 }

			 return this
		 }
	 })
	 SVG.extend(SVG.Element, SVG.FX, {
		 // Add transformations
		 transform: function(o, relative) {
			 // get target in case of the fx module, otherwise reference this
			 var target = this.target || this
			 , matrix

			 // act as a getter
			 if (typeof o !== 'object') {
				 // get current matrix
				 matrix = new SVG.Matrix(target).extract()

				 // add parametric rotation
				 if (typeof this.param === 'object') {
					 matrix.rotation = this.param.rotation
					 matrix.cx       = this.param.cx
					 matrix.cy       = this.param.cy
				 }

				 return typeof o === 'string' ? matrix[o] : matrix
			 }

			 // get current matrix
			 matrix = this instanceof SVG.FX && this.attrs.transform ?
					 this.attrs.transform :
						 new SVG.Matrix(target)

			 // ensure relative flag
			 relative = !!relative || !!o.relative

			 // act on matrix
			 if (o.a != null) {
				 matrix = relative ?
						 // relative
						 matrix.multiply(new SVG.Matrix(o)) :
							 // absolute
							 new SVG.Matrix(o)

						 // act on rotation
			 } else if (o.rotation != null) {
				 // ensure centre point
				 ensureCentre(o, target)

				 // relativize rotation value
				 if (relative) {
					 o.rotation += this.param && this.param.rotation != null ?
							 this.param.rotation :
								 matrix.extract().rotation
				 }

				 // store parametric values
				 this.param = o

				 // apply transformation
				 if (this instanceof SVG.Element) {
					 matrix = relative ?
							 // relative
							 matrix.rotate(o.rotation, o.cx, o.cy) :
								 // absolute
								 matrix.rotate(o.rotation - matrix.extract().rotation, o.cx, o.cy)
				 }

				 // act on scale
			 } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
				 // ensure centre point
				 ensureCentre(o, target)

				 // ensure scale values on both axes
				 o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
						 o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1

								 if (!relative) {
									 // absolute; multiply inversed values
									 var e = matrix.extract()
									 o.scaleX = o.scaleX * 1 / e.scaleX
									 o.scaleY = o.scaleY * 1 / e.scaleY
								 }

				 matrix = matrix.scale(o.scaleX, o.scaleY, o.cx, o.cy)

				 // act on skew
			 } else if (o.skewX != null || o.skewY != null) {
				 // ensure centre point
				 ensureCentre(o, target)

				 // ensure skew values on both axes
				 o.skewX = o.skewX != null ? o.skewX : 0
						 o.skewY = o.skewY != null ? o.skewY : 0

								 if (!relative) {
									 // absolute; reset skew values
									 var e = matrix.extract()
									 matrix = matrix.multiply(new SVG.Matrix().skew(e.skewX, e.skewY, o.cx, o.cy).inverse())
								 }

				 matrix = matrix.skew(o.skewX, o.skewY, o.cx, o.cy)

				 // act on flip
			 } else if (o.flip) {
				 matrix = matrix.flip(
						 o.flip
						 , o.offset == null ? target.bbox()['c' + o.flip] : o.offset
				 )

				 // act on translate
			 } else if (o.x != null || o.y != null) {
				 if (relative) {
					 // relative
					 matrix = matrix.translate(o.x, o.y)
				 } else {
					 // absolute
					 if (o.x != null) matrix.e = o.x
					 if (o.y != null) matrix.f = o.y
				 }
			 }

			 return this.attr(this instanceof SVG.Pattern ? 'patternTransform' : this instanceof SVG.Gradient ? 'gradientTransform' : 'transform', matrix)
		 }
	 })

	 SVG.extend(SVG.Element, {
		 // Reset all transformations
		 untransform: function() {
			 return this.attr('transform', null)
		 },
		 // merge the whole transformation chain into one matrix and returns it
		 matrixify: function() {

			 var matrix = (this.attr('transform') || '')
			 // split transformations
			 .split(/\)\s*/).slice(0,-1).map(function(str){
				 // generate key => value pairs
				 var kv = str.trim().split('(')
				 return [kv[0], kv[1].split(SVG.regex.matrixElements).map(function(str){ return parseFloat(str) })]
			 })
			 // calculate every transformation into one matrix
			 .reduce(function(matrix, transform){

				 if(transform[0] == 'matrix') return matrix.multiply(arrayToMatrix(transform[1]))
				 return matrix[transform[0]].apply(matrix, transform[1])

			 }, new SVG.Matrix())

			 return matrix
		 },
		 // add an element to another parent without changing the visual representation on the screen
		 toParent: function(parent) {
			 if(this == parent) return this
			 var ctm = this.screenCTM()
			 var temp = parent.rect(1,1)
			 var pCtm = temp.screenCTM().inverse()
			 temp.remove()

			 this.addTo(parent).untransform().transform(pCtm.multiply(ctm))

			 return this
		 },
		 // same as above with parent equals root-svg
		 toDoc: function() {
			 return this.toParent(this.doc())
		 }

	 })

	 SVG.extend(SVG.Element, {
		 // Dynamic style generator
		 style: function(s, v) {
			 if (arguments.length == 0) {
				 // get full style
				 return this.node.style.cssText || ''

			 } else if (arguments.length < 2) {
				 // apply every style individually if an object is passed
				 if (typeof s == 'object') {
					 for (v in s) this.style(v, s[v])

				 } else if (SVG.regex.isCss.test(s)) {
					 // parse css string
					 s = s.split(';')

					 // apply every definition individually
					 for (var i = 0; i < s.length; i++) {
						 v = s[i].split(':')
						 this.style(v[0].replace(/\s+/g, ''), v[1])
					 }
				 } else {
					 // act as a getter if the first and only argument is not an object
					 return this.node.style[camelCase(s)]
				 }

			 } else {
				 this.node.style[camelCase(s)] = v === null || SVG.regex.isBlank.test(v) ? '' : v
			 }

			 return this
		 }
	 })
	 SVG.Parent = SVG.invent({
		 // Initialize node
		 create: function(element) {
			 this.constructor.call(this, element)
		 }

	 // Inherit from
	 , inherit: SVG.Element

	 // Add class methods
	 , extend: {
		 // Returns all child elements
		 children: function() {
			 return SVG.utils.map(SVG.utils.filterSVGElements(this.node.childNodes), function(node) {
				 return SVG.adopt(node)
			 })
		 }
	 // Add given element at a position
	 , add: function(element, i) {
		 if (!this.has(element)) {
			 // define insertion index if none given
			 i = i == null ? this.children().length : i

					 // add element references
					 this.node.insertBefore(element.node, this.node.childNodes[i] || null)
		 }

		 return this
	 }
	 // Basically does the same as `add()` but returns the added element instead
	 , put: function(element, i) {
		 this.add(element, i)
		 return element
	 }
	 // Checks if the given element is a child
	 , has: function(element) {
		 return this.index(element) >= 0
	 }
	 // Gets index of given element
	 , index: function(element) {
		 return this.children().indexOf(element)
	 }
	 // Get a element at the given index
	 , get: function(i) {
		 return this.children()[i]
	 }
	 // Get first child, skipping the defs node
	 , first: function() {
		 return this.children()[0]
	 }
	 // Get the last child
	 , last: function() {
		 return this.children()[this.children().length - 1]
	 }
	 // Iterates over all children and invokes a given block
	 , each: function(block, deep) {
		 var i, il
		 , children = this.children()

		 for (i = 0, il = children.length; i < il; i++) {
			 if (children[i] instanceof SVG.Element)
				 block.apply(children[i], [i, children])

				 if (deep && (children[i] instanceof SVG.Container))
					 children[i].each(block, deep)
		 }

		 return this
	 }
	 // Remove a given child
	 , removeElement: function(element) {
		 this.node.removeChild(element.node)

		 return this
	 }
	 // Remove all elements in this container
	 , clear: function() {
		 // remove children
		 while(this.node.hasChildNodes())
			 this.node.removeChild(this.node.lastChild)

			 // remove defs reference
			 delete this._defs

			 return this
	 }
	 , // Get defs
	 defs: function() {
		 return this.doc().defs()
	 }
	 }

	 })

	 SVG.extend(SVG.Parent, {

		 ungroup: function(parent, depth) {
			 if(depth === 0 || this instanceof SVG.Defs) return this

			 parent = parent || (this instanceof SVG.Doc ? this : this.parent(SVG.Parent))
			 depth = depth || Infinity

			 this.each(function(){
				 if(this instanceof SVG.Defs) return this
				 if(this instanceof SVG.Parent) return this.ungroup(parent, depth-1)
				 return this.toParent(parent)
			 })

			 this.node.firstChild || this.remove()

			 return this
		 },

		 flatten: function(parent, depth) {
			 return this.ungroup(parent, depth)
		 }

	 })
	 SVG.Container = SVG.invent({
		 // Initialize node
		 create: function(element) {
			 this.constructor.call(this, element)
		 }

	 // Inherit from
	 , inherit: SVG.Parent

	 // Add class methods
	 , extend: {
		 // Get the viewBox and calculate the zoom value
		 viewbox: function(v) {
			 if (arguments.length == 0)
				 // act as a getter if there are no arguments
				 return new SVG.ViewBox(this)

			 // otherwise act as a setter
			 v = arguments.length == 1 ?
					 [v.x, v.y, v.width, v.height] :
						 [].slice.call(arguments)

						 return this.attr('viewBox', v)
		 }
	 }

	 })
//	 Add events to elements
	 ;[  'click'
	     , 'dblclick'
	     , 'mousedown'
	     , 'mouseup'
	     , 'mouseover'
	     , 'mouseout'
	     , 'mousemove'
	     // , 'mouseenter' -> not supported by IE
	     // , 'mouseleave' -> not supported by IE
	     , 'touchstart'
	     , 'touchmove'
	     , 'touchleave'
	     , 'touchend'
	     , 'touchcancel' ].forEach(function(event) {

	    	 // add event to SVG.Element
	    	 SVG.Element.prototype[event] = function(f) {
	    		 var self = this

	    		 // bind event to element rather than element node
	    		 this.node['on' + event] = typeof f == 'function' ?
	    				 function() { return f.apply(self, arguments) } : null

	    				 return this
	    	 }

	     })

//	     Initialize listeners stack
	     SVG.listeners = []
	 SVG.handlerMap = []

//	 Add event binder in the SVG namespace
	 SVG.on = function(node, event, listener, binding) {
		 // create listener, get object-index
		 var l     = listener.bind(binding || node.instance || node)
		 , index = (SVG.handlerMap.indexOf(node) + 1 || SVG.handlerMap.push(node)) - 1
		 , ev    = event.split('.')[0]
		 , ns    = event.split('.')[1] || '*'


		 // ensure valid object
		 SVG.listeners[index]         = SVG.listeners[index]         || {}
		 SVG.listeners[index][ev]     = SVG.listeners[index][ev]     || {}
		 SVG.listeners[index][ev][ns] = SVG.listeners[index][ev][ns] || {}

		 // reference listener
		 SVG.listeners[index][ev][ns][listener] = l

		 // add listener
		 node.addEventListener(ev, l, false)
	 }

//	 Add event unbinder in the SVG namespace
	 SVG.off = function(node, event, listener) {
		 var index = SVG.handlerMap.indexOf(node)
		 , ev    = event && event.split('.')[0]
		 , ns    = event && event.split('.')[1]

		 if(index == -1) return

		 if (listener) {
			 // remove listener reference
			 if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns || '*']) {
				 // remove listener
				 node.removeEventListener(ev, SVG.listeners[index][ev][ns || '*'][listener], false)

				 delete SVG.listeners[index][ev][ns || '*'][listener]
			 }

		 } else if (ns && ev) {
			 // remove all listeners for a namespaced event
			 if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns]) {
				 for (listener in SVG.listeners[index][ev][ns])
					 SVG.off(node, [ev, ns].join('.'), listener)

					 delete SVG.listeners[index][ev][ns]
			 }

		 } else if (ns){
			 // remove all listeners for a specific namespace
			 for(event in SVG.listeners[index]){
				 for(var namespace in SVG.listeners[index][event]){
					 if(ns === namespace){
						 SVG.off(node, [event, ns].join('.'))
					 }
				 }
			 }

		 } else if (ev) {
			 // remove all listeners for the event
			 if (SVG.listeners[index][ev]) {
				 for (namespace in SVG.listeners[index][ev])
					 SVG.off(node, [ev, namespace].join('.'))

					 delete SVG.listeners[index][ev]
			 }

		 } else {
			 // remove all listeners on a given node
			 for (event in SVG.listeners[index])
				 SVG.off(node, event)

				 delete SVG.listeners[index]

		 }
	 }


	 SVG.extend(SVG.Element, {
		 // Bind given event to listener
		 on: function(event, listener, binding) {
			 SVG.on(this.node, event, listener, binding)

			 return this
		 }
	 // Unbind event from listener
	 , off: function(event, listener) {
		 SVG.off(this.node, event, listener)

		 return this
	 }
	 // Fire given event
	 , fire: function(event, data) {

		 // Dispatch event
		 if(event instanceof Event){
			 this.node.dispatchEvent(event)
		 }else{
			 this.node.dispatchEvent(new CustomEvent(event, {detail:data}))
		 }

		 return this
	 }
	 })

	 SVG.Defs = SVG.invent({
		 // Initialize node
		 create: 'defs'

			 // Inherit from
			 , inherit: SVG.Container

	 })
	 SVG.G = SVG.invent({
		 // Initialize node
		 create: 'g'

			 // Inherit from
			 , inherit: SVG.Container

			 // Add class methods
			 , extend: {
				 // Move over x-axis
				 x: function(x) {
					 return x == null ? this.transform('x') : this.transform({ x: x - this.x() }, true)
				 }
	 // Move over y-axis
	 , y: function(y) {
		 return y == null ? this.transform('y') : this.transform({ y: y - this.y() }, true)
	 }
	 // Move by center over x-axis
	 , cx: function(x) {
		 return x == null ? this.tbox().cx : this.x(x - this.tbox().width / 2)
	 }
	 // Move by center over y-axis
	 , cy: function(y) {
		 return y == null ? this.tbox().cy : this.y(y - this.tbox().height / 2)
	 }
	 , gbox: function() {

		 var bbox  = this.bbox()
		 , trans = this.transform()

		 bbox.x  += trans.x
		 bbox.x2 += trans.x
		 bbox.cx += trans.x

		 bbox.y  += trans.y
		 bbox.y2 += trans.y
		 bbox.cy += trans.y

		 return bbox
	 }
			 }

	 // Add parent method
	 , construct: {
		 // Create a group element
		 group: function() {
			 return this.put(new SVG.G)
		 }
	 }
	 })

//	 ### This module adds backward / forward functionality to elements.


	 SVG.extend(SVG.Element, {
		 // Get all siblings, including myself
		 siblings: function() {
			 return this.parent().children()
		 }
	 // Get the curent position siblings
	 , position: function() {
		 return this.parent().index(this)
	 }
	 // Get the next element (will return null if there is none)
	 , next: function() {
		 return this.siblings()[this.position() + 1]
	 }
	 // Get the next element (will return null if there is none)
	 , previous: function() {
		 return this.siblings()[this.position() - 1]
	 }
	 // Send given element one step forward
	 , forward: function() {
		 var i = this.position() + 1
		 , p = this.parent()

		 // move node one step forward
		 p.removeElement(this).add(this, i)

		 // make sure defs node is always at the top
		 if (p instanceof SVG.Doc)
			 p.node.appendChild(p.defs().node)

			 return this
	 }
	 // Send given element one step backward
	 , backward: function() {
		 var i = this.position()

		 if (i > 0)
			 this.parent().removeElement(this).add(this, i - 1)

			 return this
	 }
	 // Send given element all the way to the front
	 , front: function() {
		 var p = this.parent()

		 // Move node forward
		 p.node.appendChild(this.node)

		 // Make sure defs node is always at the top
		 if (p instanceof SVG.Doc)
			 p.node.appendChild(p.defs().node)

			 return this
	 }
	 // Send given element all the way to the back
	 , back: function() {
		 if (this.position() > 0)
			 this.parent().removeElement(this).add(this, 0)

			 return this
	 }
	 // Inserts a given element before the targeted element
	 , before: function(element) {
		 element.remove()

		 var i = this.position()

		 this.parent().add(element, i)

		 return this
	 }
	 // Insters a given element after the targeted element
	 , after: function(element) {
		 element.remove()

		 var i = this.position()

		 this.parent().add(element, i + 1)

		 return this
	 }

	 })
	 SVG.Mask = SVG.invent({
		 // Initialize node
		 create: function() {
			 this.constructor.call(this, SVG.create('mask'))

			 // keep references to masked elements
			 this.targets = []
		 }

	 // Inherit from
	 , inherit: SVG.Container

	 // Add class methods
	 , extend: {
		 // Unmask all masked elements and remove itself
		 remove: function() {
			 // unmask all targets
			 for (var i = this.targets.length - 1; i >= 0; i--)
				 if (this.targets[i])
					 this.targets[i].unmask()
					 this.targets = []

			 // remove mask from parent
			 this.parent().removeElement(this)

			 return this
		 }
	 }

	 // Add parent method
	 , construct: {
		 // Create masking element
		 mask: function() {
			 return this.defs().put(new SVG.Mask)
		 }
	 }
	 })


	 SVG.extend(SVG.Element, {
		 // Distribute mask to svg element
		 maskWith: function(element) {
			 // use given mask or create a new one
			 this.masker = element instanceof SVG.Mask ? element : this.parent().mask().add(element)

					 // store reverence on self in mask
					 this.masker.targets.push(this)

					 // apply mask
					 return this.attr('mask', 'url("#' + this.masker.attr('id') + '")')
		 }
	 // Unmask element
	 , unmask: function() {
		 delete this.masker
		 return this.attr('mask', null)
	 }

	 })

	 SVG.ClipPath = SVG.invent({
		 // Initialize node
		 create: function() {
			 this.constructor.call(this, SVG.create('clipPath'))

			 // keep references to clipped elements
			 this.targets = []
		 }

	 // Inherit from
	 , inherit: SVG.Container

	 // Add class methods
	 , extend: {
		 // Unclip all clipped elements and remove itself
		 remove: function() {
			 // unclip all targets
			 for (var i = this.targets.length - 1; i >= 0; i--)
				 if (this.targets[i])
					 this.targets[i].unclip()
					 this.targets = []

			 // remove clipPath from parent
			 this.parent().removeElement(this)

			 return this
		 }
	 }

	 // Add parent method
	 , construct: {
		 // Create clipping element
		 clip: function() {
			 return this.defs().put(new SVG.ClipPath)
		 }
	 }
	 })


	 SVG.extend(SVG.Element, {
		 // Distribute clipPath to svg element
		 clipWith: function(element) {
			 // use given clip or create a new one
			 this.clipper = element instanceof SVG.ClipPath ? element : this.parent().clip().add(element)

					 // store reverence on self in mask
					 this.clipper.targets.push(this)

					 // apply mask
					 return this.attr('clip-path', 'url("#' + this.clipper.attr('id') + '")')
		 }
	 // Unclip element
	 , unclip: function() {
		 delete this.clipper
		 return this.attr('clip-path', null)
	 }

	 })
	 SVG.Gradient = SVG.invent({
		 // Initialize node
		 create: function(type) {
			 this.constructor.call(this, SVG.create(type + 'Gradient'))

			 // store type
			 this.type = type
		 }

	 // Inherit from
	 , inherit: SVG.Container

	 // Add class methods
	 , extend: {
		 // Add a color stop
		 at: function(offset, color, opacity) {
			 return this.put(new SVG.Stop).update(offset, color, opacity)
		 }
	 // Update gradient
	 , update: function(block) {
		 // remove all stops
		 this.clear()

		 // invoke passed block
		 if (typeof block == 'function')
			 block.call(this, this)

			 return this
	 }
	 // Return the fill id
	 , fill: function() {
		 return 'url(#' + this.id() + ')'
	 }
	 // Alias string convertion to fill
	 , toString: function() {
		 return this.fill()
	 }
	 // custom attr to handle transform
	 , attr: function(a, b, c) {
		 if(a == 'transform') a = 'gradientTransform'
			 return SVG.Container.prototype.attr.call(this, a, b, c)
	 }
	 }

	 // Add parent method
	 , construct: {
		 // Create gradient element in defs
		 gradient: function(type, block) {
			 return this.defs().gradient(type, block)
		 }
	 }
	 })

//	 Add animatable methods to both gradient and fx module
	 SVG.extend(SVG.Gradient, SVG.FX, {
		 // From position
		 from: function(x, y) {
			 return (this.target || this).type == 'radial' ?
					 this.attr({ fx: new SVG.Number(x), fy: new SVG.Number(y) }) :
						 this.attr({ x1: new SVG.Number(x), y1: new SVG.Number(y) })
		 }
	 // To position
	 , to: function(x, y) {
		 return (this.target || this).type == 'radial' ?
				 this.attr({ cx: new SVG.Number(x), cy: new SVG.Number(y) }) :
					 this.attr({ x2: new SVG.Number(x), y2: new SVG.Number(y) })
	 }
	 })

//	 Base gradient generation
	 SVG.extend(SVG.Defs, {
		 // define gradient
		 gradient: function(type, block) {
			 return this.put(new SVG.Gradient(type)).update(block)
		 }

	 })

	 SVG.Stop = SVG.invent({
		 // Initialize node
		 create: 'stop'

			 // Inherit from
			 , inherit: SVG.Element

			 // Add class methods
			 , extend: {
				 // add color stops
				 update: function(o) {
					 if (typeof o == 'number' || o instanceof SVG.Number) {
						 o = {
								 offset:  arguments[0]
						 , color:   arguments[1]
						 , opacity: arguments[2]
						 }
					 }

					 // set attributes
					 if (o.opacity != null) this.attr('stop-opacity', o.opacity)
					 if (o.color   != null) this.attr('stop-color', o.color)
					 if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))

					 return this
				 }
			 }

	 })

	 SVG.Pattern = SVG.invent({
		 // Initialize node
		 create: 'pattern'

			 // Inherit from
			 , inherit: SVG.Container

			 // Add class methods
			 , extend: {
				 // Return the fill id
				 fill: function() {
					 return 'url(#' + this.id() + ')'
				 }
	 // Update pattern by rebuilding
	 , update: function(block) {
		 // remove content
		 this.clear()

		 // invoke passed block
		 if (typeof block == 'function')
			 block.call(this, this)

			 return this
	 }
	 // Alias string convertion to fill
	 , toString: function() {
		 return this.fill()
	 }
	 // custom attr to handle transform
	 , attr: function(a, b, c) {
		 if(a == 'transform') a = 'patternTransform'
			 return SVG.Container.prototype.attr.call(this, a, b, c)
	 }

			 }

	 // Add parent method
	 , construct: {
		 // Create pattern element in defs
		 pattern: function(width, height, block) {
			 return this.defs().pattern(width, height, block)
		 }
	 }
	 })

	 SVG.extend(SVG.Defs, {
		 // Define gradient
		 pattern: function(width, height, block) {
			 return this.put(new SVG.Pattern).update(block).attr({
				 x:            0
				 , y:            0
				 , width:        width
				 , height:       height
				 , patternUnits: 'userSpaceOnUse'
			 })
		 }

	 })
	 SVG.Doc = SVG.invent({
		 // Initialize node
		 create: function(element) {
			 if (element) {
				 // ensure the presence of a dom element
				 element = typeof element == 'string' ?
						 document.getElementById(element) :
							 element

							 // If the target is an svg element, use that element as the main wrapper.
							 // This allows svg.js to work with svg documents as well.
							 if (element.nodeName == 'svg') {
								 this.constructor.call(this, element)
							 } else {
								 this.constructor.call(this, SVG.create('svg'))
								 element.appendChild(this.node)
							 }

						 // set svg element attributes and ensure defs node
						 this.namespace().size('100%', '100%').defs()
			 }
		 }

	 // Inherit from
	 , inherit: SVG.Container

	 // Add class methods
	 , extend: {
		 // Add namespaces
		 namespace: function() {
			 return this
			 .attr({ xmlns: SVG.ns, version: '1.1' })
			 .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)
			 .attr('xmlns:svgjs', SVG.svgjs, SVG.xmlns)
		 }
	 // Creates and returns defs element
	 , defs: function() {
		 if (!this._defs) {
			 var defs

			 // Find or create a defs element in this instance
			 if (defs = this.node.getElementsByTagName('defs')[0])
				 this._defs = SVG.adopt(defs)
				 else
					 this._defs = new SVG.Defs

					 // Make sure the defs node is at the end of the stack
					 this.node.appendChild(this._defs.node)
		 }

		 return this._defs
	 }
	 // custom parent method
	 , parent: function() {
		 return this.node.parentNode.nodeName == '#document' ? null : this.node.parentNode
	 }
	 // Fix for possible sub-pixel offset. See:
	 // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
	 , spof: function(spof) {
		 var pos = this.node.getScreenCTM()

		 if (pos)
			 this
			 .style('left', (-pos.e % 1) + 'px')
			 .style('top',  (-pos.f % 1) + 'px')

			 return this
	 }

	 // Removes the doc from the DOM
	 , remove: function() {
		 if(this.parent()) {
			 this.parent().removeChild(this.node);
		 }

		 return this;
	 }
	 }

	 })

	 SVG.Shape = SVG.invent({
		 // Initialize node
		 create: function(element) {
			 this.constructor.call(this, element)
		 }

	 // Inherit from
	 , inherit: SVG.Element

	 })

	 SVG.Bare = SVG.invent({
		 // Initialize
		 create: function(element, inherit) {
			 // construct element
			 this.constructor.call(this, SVG.create(element))

			 // inherit custom methods
			 if (inherit)
				 for (var method in inherit.prototype)
					 if (typeof inherit.prototype[method] === 'function')
						 this[method] = inherit.prototype[method]
		 }

	 // Inherit from
	 , inherit: SVG.Element

	 // Add methods
	 , extend: {
		 // Insert some plain text
		 words: function(text) {
			 // remove contents
			 while (this.node.hasChildNodes())
				 this.node.removeChild(this.node.lastChild)

				 // create text node
				 this.node.appendChild(document.createTextNode(text))

				 return this
		 }
	 }
	 })


	 SVG.extend(SVG.Parent, {
		 // Create an element that is not described by SVG.js
		 element: function(element, inherit) {
			 return this.put(new SVG.Bare(element, inherit))
		 }
	 // Add symbol element
	 , symbol: function() {
		 return this.defs().element('symbol', SVG.Container)
	 }

	 })
	 SVG.Use = SVG.invent({
		 // Initialize node
		 create: 'use'

			 // Inherit from
			 , inherit: SVG.Shape

			 // Add class methods
			 , extend: {
				 // Use element as a reference
				 element: function(element, file) {
					 // Set lined element
					 return this.attr('href', (file || '') + '#' + element, SVG.xlink)
				 }
			 }

	 // Add parent method
	 , construct: {
		 // Create a use element
		 use: function(element, file) {
			 return this.put(new SVG.Use).element(element, file)
		 }
	 }
	 })
	 SVG.Rect = SVG.invent({
		 // Initialize node
		 create: 'rect'

			 // Inherit from
			 , inherit: SVG.Shape

			 // Add parent method
			 , construct: {
				 // Create a rect element
				 rect: function(width, height) {
					 return this.put(new SVG.Rect()).size(width, height)
				 }
			 }
	 })
	 SVG.Circle = SVG.invent({
		 // Initialize node
		 create: 'circle'

			 // Inherit from
			 , inherit: SVG.Shape

			 // Add parent method
			 , construct: {
				 // Create circle element, based on ellipse
				 circle: function(size) {
					 return this.put(new SVG.Circle).rx(new SVG.Number(size).divide(2)).move(0, 0)
				 }
			 }
	 })

	 SVG.extend(SVG.Circle, SVG.FX, {
		 // Radius x value
		 rx: function(rx) {
			 return this.attr('r', rx)
		 }
	 // Alias radius x value
	 , ry: function(ry) {
		 return this.rx(ry)
	 }
	 })

	 SVG.Ellipse = SVG.invent({
		 // Initialize node
		 create: 'ellipse'

			 // Inherit from
			 , inherit: SVG.Shape

			 // Add parent method
			 , construct: {
				 // Create an ellipse
				 ellipse: function(width, height) {
					 return this.put(new SVG.Ellipse).size(width, height).move(0, 0)
				 }
			 }
	 })

	 SVG.extend(SVG.Ellipse, SVG.Rect, SVG.FX, {
		 // Radius x value
		 rx: function(rx) {
			 return this.attr('rx', rx)
		 }
	 // Radius y value
	 , ry: function(ry) {
		 return this.attr('ry', ry)
	 }
	 })

//	 Add common method
	 SVG.extend(SVG.Circle, SVG.Ellipse, {
		 // Move over x-axis
		 x: function(x) {
			 return x == null ? this.cx() - this.rx() : this.cx(x + this.rx())
		 }
	 // Move over y-axis
	 , y: function(y) {
		 return y == null ? this.cy() - this.ry() : this.cy(y + this.ry())
	 }
	 // Move by center over x-axis
	 , cx: function(x) {
		 return x == null ? this.attr('cx') : this.attr('cx', x)
	 }
	 // Move by center over y-axis
	 , cy: function(y) {
		 return y == null ? this.attr('cy') : this.attr('cy', y)
	 }
	 // Set width of element
	 , width: function(width) {
		 return width == null ? this.rx() * 2 : this.rx(new SVG.Number(width).divide(2))
	 }
	 // Set height of element
	 , height: function(height) {
		 return height == null ? this.ry() * 2 : this.ry(new SVG.Number(height).divide(2))
	 }
	 // Custom size function
	 , size: function(width, height) {
		 var p = proportionalSize(this.bbox(), width, height)

		 return this
		 .rx(new SVG.Number(p.width).divide(2))
		 .ry(new SVG.Number(p.height).divide(2))
	 }
	 })
	 SVG.Line = SVG.invent({
		 // Initialize node
		 create: 'line'

			 // Inherit from
			 , inherit: SVG.Shape

			 // Add class methods
			 , extend: {
				 // Get array
				 array: function() {
					 return new SVG.PointArray([
					                            [ this.attr('x1'), this.attr('y1') ]
					                            , [ this.attr('x2'), this.attr('y2') ]
					                            ])
				 }
	 // Overwrite native plot() method
	 , plot: function(x1, y1, x2, y2) {
		 if (arguments.length == 4)
			 x1 = { x1: x1, y1: y1, x2: x2, y2: y2 }
		 else
			 x1 = new SVG.PointArray(x1).toLine()

			 return this.attr(x1)
	 }
	 // Move by left top corner
	 , move: function(x, y) {
		 return this.attr(this.array().move(x, y).toLine())
	 }
	 // Set element size to given width and height
	 , size: function(width, height) {
		 var p = proportionalSize(this.bbox(), width, height)

		 return this.attr(this.array().size(p.width, p.height).toLine())
	 }
			 }

	 // Add parent method
	 , construct: {
		 // Create a line element
		 line: function(x1, y1, x2, y2) {
			 return this.put(new SVG.Line).plot(x1, y1, x2, y2)
		 }
	 }
	 })

	 SVG.Polyline = SVG.invent({
		 // Initialize node
		 create: 'polyline'

			 // Inherit from
			 , inherit: SVG.Shape

			 // Add parent method
			 , construct: {
				 // Create a wrapped polyline element
				 polyline: function(p) {
					 return this.put(new SVG.Polyline).plot(p)
				 }
			 }
	 })

	 SVG.Polygon = SVG.invent({
		 // Initialize node
		 create: 'polygon'

			 // Inherit from
			 , inherit: SVG.Shape

			 // Add parent method
			 , construct: {
				 // Create a wrapped polygon element
				 polygon: function(p) {
					 return this.put(new SVG.Polygon).plot(p)
				 }
			 }
	 })

//	 Add polygon-specific functions
	 SVG.extend(SVG.Polyline, SVG.Polygon, {
		 // Get array
		 array: function() {
			 return this._array || (this._array = new SVG.PointArray(this.attr('points')))
		 }
	 // Plot new path
	 , plot: function(p) {
		 return this.attr('points', (this._array = new SVG.PointArray(p)))
	 }
	 // Move by left top corner
	 , move: function(x, y) {
		 return this.attr('points', this.array().move(x, y))
	 }
	 // Set element size to given width and height
	 , size: function(width, height) {
		 var p = proportionalSize(this.bbox(), width, height)

		 return this.attr('points', this.array().size(p.width, p.height))
	 }

	 })
//	 unify all point to point elements
	 SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, {
		 // Define morphable array
		 morphArray:  SVG.PointArray
		 // Move by left top corner over x-axis
		 , x: function(x) {
			 return x == null ? this.bbox().x : this.move(x, this.bbox().y)
		 }
	 // Move by left top corner over y-axis
	 , y: function(y) {
		 return y == null ? this.bbox().y : this.move(this.bbox().x, y)
	 }
	 // Set width of element
	 , width: function(width) {
		 var b = this.bbox()

		 return width == null ? b.width : this.size(width, b.height)
	 }
	 // Set height of element
	 , height: function(height) {
		 var b = this.bbox()

		 return height == null ? b.height : this.size(b.width, height)
	 }
	 })
	 SVG.Path = SVG.invent({
		 // Initialize node
		 create: 'path'

			 // Inherit from
			 , inherit: SVG.Shape

			 // Add class methods
			 , extend: {
				 // Define morphable array
				 morphArray:  SVG.PathArray
				 // Get array
				 , array: function() {
					 return this._array || (this._array = new SVG.PathArray(this.attr('d')))
				 }
	 // Plot new poly points
	 , plot: function(p) {
		 return this.attr('d', (this._array = new SVG.PathArray(p)))
	 }
	 // Move by left top corner
	 , move: function(x, y) {
		 return this.attr('d', this.array().move(x, y))
	 }
	 // Move by left top corner over x-axis
	 , x: function(x) {
		 return x == null ? this.bbox().x : this.move(x, this.bbox().y)
	 }
	 // Move by left top corner over y-axis
	 , y: function(y) {
		 return y == null ? this.bbox().y : this.move(this.bbox().x, y)
	 }
	 // Set element size to given width and height
	 , size: function(width, height) {
		 var p = proportionalSize(this.bbox(), width, height)

		 return this.attr('d', this.array().size(p.width, p.height))
	 }
	 // Set width of element
	 , width: function(width) {
		 return width == null ? this.bbox().width : this.size(width, this.bbox().height)
	 }
	 // Set height of element
	 , height: function(height) {
		 return height == null ? this.bbox().height : this.size(this.bbox().width, height)
	 }

			 }

	 // Add parent method
	 , construct: {
		 // Create a wrapped path element
		 path: function(d) {
			 return this.put(new SVG.Path).plot(d)
		 }
	 }
	 })
	 SVG.Image = SVG.invent({
		 // Initialize node
		 create: 'image'

			 // Inherit from
			 , inherit: SVG.Shape

			 // Add class methods
			 , extend: {
				 // (re)load image
				 load: function(url) {
					 if (!url) return this

					 var self = this
					 , img  = document.createElement('img')

					 // preload image
					 img.onload = function() {
						 var p = self.parent(SVG.Pattern)

						 if(p === null) return

						 // ensure image size
						 if (self.width() == 0 && self.height() == 0)
							 self.size(img.width, img.height)

							 // ensure pattern size if not set
							 if (p && p.width() == 0 && p.height() == 0)
								 p.size(self.width(), self.height())

								 // callback
								 if (typeof self._loaded === 'function')
									 self._loaded.call(self, {
										 width:  img.width
										 , height: img.height
										 , ratio:  img.width / img.height
										 , url:    url
									 })
					 }

					 return this.attr('href', (img.src = this.src = url), SVG.xlink)
				 }
	 // Add loaded callback
	 , loaded: function(loaded) {
		 this._loaded = loaded
		 return this
	 }
			 }

	 // Add parent method
	 , construct: {
		 // create image element, load image and set its size
		 image: function(source, width, height) {
			 return this.put(new SVG.Image).load(source).size(width || 0, height || width || 0)
		 }
	 }

	 })
	 SVG.Text = SVG.invent({
		 // Initialize node
		 create: function() {
			 this.constructor.call(this, SVG.create('text'))

			 this.dom.leading = new SVG.Number(1.3)    // store leading value for rebuilding
			 this._rebuild = true                      // enable automatic updating of dy values
			 this._build   = false                     // disable build mode for adding multiple lines

			 // set default font
			 this.attr('font-family', SVG.defaults.attrs['font-family'])
		 }

	 // Inherit from
	 , inherit: SVG.Shape

	 // Add class methods
	 , extend: {
		 clone: function(){
			 // clone element and assign new id
			 var clone = assignNewId(this.node.cloneNode(true))

			 // insert the clone after myself
			 this.after(clone)

			 return clone
		 }
	 // Move over x-axis
	 , x: function(x) {
		 // act as getter
		 if (x == null)
			 return this.attr('x')

			 // move lines as well if no textPath is present
			 if (!this.textPath)
				 this.lines().each(function() { if (this.dom.newLined) this.x(x) })

				 return this.attr('x', x)
	 }
	 // Move over y-axis
	 , y: function(y) {
		 var oy = this.attr('y')
		 , o  = typeof oy === 'number' ? oy - this.bbox().y : 0

				 // act as getter
				 if (y == null)
					 return typeof oy === 'number' ? oy - o : oy

							 return this.attr('y', typeof y === 'number' ? y + o : y)
	 }
	 // Move center over x-axis
	 , cx: function(x) {
		 return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
	 }
	 // Move center over y-axis
	 , cy: function(y) {
		 return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
	 }
	 // Set the text content
	 , text: function(text) {
		 // act as getter
		 if (typeof text === 'undefined'){
			 var text = ''
				 var children = this.node.childNodes
				 for(var i = 0, len = children.length; i < len; ++i){

					 // add newline if its not the first child and newLined is set to true
					 if(i != 0 && children[i].nodeType != 3 && SVG.adopt(children[i]).dom.newLined == true){
						 text += '\n'
					 }

					 // add content of this node
					 text += children[i].textContent
				 }

			 return text
		 }

		 // remove existing content
		 this.clear().build(true)

		 if (typeof text === 'function') {
			 // call block
			 text.call(this, this)

		 } else {
			 // store text and make sure text is not blank
			 text = text.split('\n')

			 // build new lines
			 for (var i = 0, il = text.length; i < il; i++)
				 this.tspan(text[i]).newLine()
		 }

		 // disable build mode and rebuild lines
		 return this.build(false).rebuild()
	 }
	 // Set font size
	 , size: function(size) {
		 return this.attr('font-size', size).rebuild()
	 }
	 // Set / get leading
	 , leading: function(value) {
		 // act as getter
		 if (value == null)
			 return this.dom.leading

			 // act as setter
			 this.dom.leading = new SVG.Number(value)

		 return this.rebuild()
	 }
	 // Get all the first level lines
	 , lines: function() {
		 // filter tspans and map them to SVG.js instances
		 var lines = SVG.utils.map(SVG.utils.filterSVGElements(this.node.childNodes), function(el){
			 return SVG.adopt(el)
		 })

		 // return an instance of SVG.set
		 return new SVG.Set(lines)
	 }
	 // Rebuild appearance type
	 , rebuild: function(rebuild) {
		 // store new rebuild flag if given
		 if (typeof rebuild == 'boolean')
			 this._rebuild = rebuild

			 // define position of all lines
			 if (this._rebuild) {
				 var self = this
				 , blankLineOffset = 0
				 , dy = this.dom.leading * new SVG.Number(this.attr('font-size'))

				 this.lines().each(function() {
					 if (this.dom.newLined) {
						 if (!this.textPath)
							 this.attr('x', self.attr('x'))

							 if(this.text() == '\n') {
								 blankLineOffset += dy
							 }else{
								 this.attr('dy', dy + blankLineOffset)
								 blankLineOffset = 0
							 }
					 }
				 })

				 this.fire('rebuild')
			 }

		 return this
	 }
	 // Enable / disable build mode
	 , build: function(build) {
		 this._build = !!build
		 return this
	 }
	 // overwrite method from parent to set data properly
	 , setData: function(o){
		 this.dom = o
		 this.dom.leading = new SVG.Number(o.leading || 1.3)
		 return this
	 }
	 }

	 // Add parent method
	 , construct: {
		 // Create text element
		 text: function(text) {
			 return this.put(new SVG.Text).text(text)
		 }
	 // Create plain text element
	 , plain: function(text) {
		 return this.put(new SVG.Text).plain(text)
	 }
	 }

	 })

	 SVG.Tspan = SVG.invent({
		 // Initialize node
		 create: 'tspan'

			 // Inherit from
			 , inherit: SVG.Shape

			 // Add class methods
			 , extend: {
				 // Set text content
				 text: function(text) {
					 if(text == null) return this.node.textContent + (this.dom.newLined ? '\n' : '')

					 typeof text === 'function' ? text.call(this, this) : this.plain(text)

							 return this
				 }
	 // Shortcut dx
	 , dx: function(dx) {
		 return this.attr('dx', dx)
	 }
	 // Shortcut dy
	 , dy: function(dy) {
		 return this.attr('dy', dy)
	 }
	 // Create new line
	 , newLine: function() {
		 // fetch text parent
		 var t = this.parent(SVG.Text)

		 // mark new line
		 this.dom.newLined = true

		 // apply new hy¡n
		 return this.dy(t.dom.leading * t.attr('font-size')).attr('x', t.x())
	 }
			 }

	 })

	 SVG.extend(SVG.Text, SVG.Tspan, {
		 // Create plain text node
		 plain: function(text) {
			 // clear if build mode is disabled
			 if (this._build === false)
				 this.clear()

				 // create text node
				 this.node.appendChild(document.createTextNode(text))

				 return this
		 }
	 // Create a tspan
	 , tspan: function(text) {
		 var node  = (this.textPath && this.textPath() || this).node
		 , tspan = new SVG.Tspan

		 // clear if build mode is disabled
		 if (this._build === false)
			 this.clear()

			 // add new tspan
			 node.appendChild(tspan.node)

			 return tspan.text(text)
	 }
	 // Clear all lines
	 , clear: function() {
		 var node = (this.textPath && this.textPath() || this).node

		 // remove existing child nodes
		 while (node.hasChildNodes())
			 node.removeChild(node.lastChild)

			 return this
	 }
	 // Get length of text element
	 , length: function() {
		 return this.node.getComputedTextLength()
	 }
	 })

	 SVG.TextPath = SVG.invent({
		 // Initialize node
		 create: 'textPath'

			 // Inherit from
			 , inherit: SVG.Element

			 // Define parent class
			 , parent: SVG.Text

			 // Add parent method
			 , construct: {
				 // Create path for text to run on
				 path: function(d) {
					 // create textPath element
					 var path  = new SVG.TextPath
					 , track = this.doc().defs().path(d)

					 // move lines to textpath
					 while (this.node.hasChildNodes())
						 path.node.appendChild(this.node.firstChild)

						 // add textPath element as child node
						 this.node.appendChild(path.node)

						 // link textPath to path and add content
						 path.attr('href', '#' + track, SVG.xlink)

						 return this
				 }
	 // Plot path if any
	 , plot: function(d) {
		 var track = this.track()

		 if (track)
			 track.plot(d)

			 return this
	 }
	 // Get the path track element
	 , track: function() {
		 var path = this.textPath()

		 if (path)
			 return path.reference('href')
	 }
	 // Get the textPath child
	 , textPath: function() {
		 if (this.node.firstChild && this.node.firstChild.nodeName == 'textPath')
			 return SVG.adopt(this.node.firstChild)
	 }
			 }
	 })
	 SVG.Nested = SVG.invent({
		 // Initialize node
		 create: function() {
			 this.constructor.call(this, SVG.create('svg'))

			 this.style('overflow', 'visible')
		 }

	 // Inherit from
	 , inherit: SVG.Container

	 // Add parent method
	 , construct: {
		 // Create nested svg document
		 nested: function() {
			 return this.put(new SVG.Nested)
		 }
	 }
	 })
	 SVG.A = SVG.invent({
		 // Initialize node
		 create: 'a'

			 // Inherit from
			 , inherit: SVG.Container

			 // Add class methods
			 , extend: {
				 // Link url
				 to: function(url) {
					 return this.attr('href', url, SVG.xlink)
				 }
	 // Link show attribute
	 , show: function(target) {
		 return this.attr('show', target, SVG.xlink)
	 }
	 // Link target attribute
	 , target: function(target) {
		 return this.attr('target', target)
	 }
			 }

	 // Add parent method
	 , construct: {
		 // Create a hyperlink element
		 link: function(url) {
			 return this.put(new SVG.A).to(url)
		 }
	 }
	 })

	 SVG.extend(SVG.Element, {
		 // Create a hyperlink element
		 linkTo: function(url) {
			 var link = new SVG.A

			 if (typeof url == 'function')
				 url.call(link, link)
				 else
					 link.to(url)

					 return this.parent().put(link).put(this)
		 }

	 })
	 SVG.Marker = SVG.invent({
		 // Initialize node
		 create: 'marker'

			 // Inherit from
			 , inherit: SVG.Container

			 // Add class methods
			 , extend: {
				 // Set width of element
				 width: function(width) {
					 return this.attr('markerWidth', width)
				 }
	 // Set height of element
	 , height: function(height) {
		 return this.attr('markerHeight', height)
	 }
	 // Set marker refX and refY
	 , ref: function(x, y) {
		 return this.attr('refX', x).attr('refY', y)
	 }
	 // Update marker
	 , update: function(block) {
		 // remove all content
		 this.clear()

		 // invoke passed block
		 if (typeof block == 'function')
			 block.call(this, this)

			 return this
	 }
	 // Return the fill id
	 , toString: function() {
		 return 'url(#' + this.id() + ')'
	 }
			 }

	 // Add parent method
	 , construct: {
		 marker: function(width, height, block) {
			 // Create marker element in defs
			 return this.defs().marker(width, height, block)
		 }
	 }

	 })

	 SVG.extend(SVG.Defs, {
		 // Create marker
		 marker: function(width, height, block) {
			 // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
			 return this.put(new SVG.Marker)
			 .size(width, height)
			 .ref(width / 2, height / 2)
			 .viewbox(0, 0, width, height)
			 .attr('orient', 'auto')
			 .update(block)
		 }

	 })

	 SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, SVG.Path, {
		 // Create and attach markers
		 marker: function(marker, width, height, block) {
			 var attr = ['marker']

			 // Build attribute name
			 if (marker != 'all') attr.push(marker)
			 attr = attr.join('-')

			 // Set marker attribute
			 marker = arguments[1] instanceof SVG.Marker ?
					 arguments[1] :
						 this.doc().marker(width, height, block)

						 return this.attr(attr, marker)
		 }

	 })
//	 Define list of available attributes for stroke and fill
	 var sugar = {
		 stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
	 , fill:   ['color', 'opacity', 'rule']
	 , prefix: function(t, a) {
		 return a == 'color' ? t : t + '-' + a
	 }
	 }

//	 Add sugar for fill and stroke
	 ;['fill', 'stroke'].forEach(function(m) {
		 var i, extension = {}

		 extension[m] = function(o) {
			 if (typeof o == 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function'))
				 this.attr(m, o)

				 else
					 // set all attributes from sugar.fill and sugar.stroke list
					 for (i = sugar[m].length - 1; i >= 0; i--)
						 if (o[sugar[m][i]] != null)
							 this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]])

							 return this
		 }

		 SVG.extend(SVG.Element, SVG.FX, extension)

	 })

	 SVG.extend(SVG.Element, SVG.FX, {
		 // Map rotation to transform
		 rotate: function(d, cx, cy) {
			 return this.transform({ rotation: d, cx: cx, cy: cy })
		 }
	 // Map skew to transform
	 , skew: function(x, y, cx, cy) {
		 return this.transform({ skewX: x, skewY: y, cx: cx, cy: cy })
	 }
	 // Map scale to transform
	 , scale: function(x, y, cx, cy) {
		 return arguments.length == 1  || arguments.length == 3 ?
				 this.transform({ scale: x, cx: y, cy: cx }) :
					 this.transform({ scaleX: x, scaleY: y, cx: cx, cy: cy })
	 }
	 // Map translate to transform
	 , translate: function(x, y) {
		 return this.transform({ x: x, y: y })
	 }
	 // Map flip to transform
	 , flip: function(a, o) {
		 return this.transform({ flip: a, offset: o })
	 }
	 // Map matrix to transform
	 , matrix: function(m) {
		 return this.attr('transform', new SVG.Matrix(m))
	 }
	 // Opacity
	 , opacity: function(value) {
		 return this.attr('opacity', value)
	 }
	 // Relative move over x axis
	 , dx: function(x) {
		 return this.x((this.target || this).x() + x)
	 }
	 // Relative move over y axis
	 , dy: function(y) {
		 return this.y((this.target || this).y() + y)
	 }
	 // Relative move over x and y axes
	 , dmove: function(x, y) {
		 return this.dx(x).dy(y)
	 }
	 })

	 SVG.extend(SVG.Rect, SVG.Ellipse, SVG.Circle, SVG.Gradient, SVG.FX, {
		 // Add x and y radius
		 radius: function(x, y) {
			 var type = (this.target || this).type;
			 return type == 'radial' || type == 'circle' ?
					 this.attr({ 'r': new SVG.Number(x) }) :
						 this.rx(x).ry(y == null ? x : y)
		 }
	 })

	 SVG.extend(SVG.Path, {
		 // Get path length
		 length: function() {
			 return this.node.getTotalLength()
		 }
	 // Get point at length
	 , pointAt: function(length) {
		 return this.node.getPointAtLength(length)
	 }
	 })

	 SVG.extend(SVG.Parent, SVG.Text, SVG.FX, {
		 // Set font
		 font: function(o) {
			 for (var k in o)
				 k == 'leading' ?
						 this.leading(o[k]) :
							 k == 'anchor' ?
									 this.attr('text-anchor', o[k]) :
										 k == 'size' || k == 'family' || k == 'weight' || k == 'stretch' || k == 'variant' || k == 'style' ?
												 this.attr('font-'+ k, o[k]) :
													 this.attr(k, o[k])

													 return this
		 }
	 })


	 SVG.Set = SVG.invent({
		 // Initialize
		 create: function(members) {
			 // Set initial state
			 Array.isArray(members) ? this.members = members : this.clear()
		 }

	 // Add class methods
	 , extend: {
		 // Add element to set
		 add: function() {
			 var i, il, elements = [].slice.call(arguments)

			 for (i = 0, il = elements.length; i < il; i++)
				 this.members.push(elements[i])

				 return this
		 }
	 // Remove element from set
	 , remove: function(element) {
		 var i = this.index(element)

		 // remove given child
		 if (i > -1)
			 this.members.splice(i, 1)

			 return this
	 }
	 // Iterate over all members
	 , each: function(block) {
		 for (var i = 0, il = this.members.length; i < il; i++)
			 block.apply(this.members[i], [i, this.members])

			 return this
	 }
	 // Restore to defaults
	 , clear: function() {
		 // initialize store
		 this.members = []

		 return this
	 }
	 // Get the length of a set
	 , length: function() {
		 return this.members.length
	 }
	 // Checks if a given element is present in set
	 , has: function(element) {
		 return this.index(element) >= 0
	 }
	 // retuns index of given element in set
	 , index: function(element) {
		 return this.members.indexOf(element)
	 }
	 // Get member at given index
	 , get: function(i) {
		 return this.members[i]
	 }
	 // Get first member
	 , first: function() {
		 return this.get(0)
	 }
	 // Get last member
	 , last: function() {
		 return this.get(this.members.length - 1)
	 }
	 // Default value
	 , valueOf: function() {
		 return this.members
	 }
	 // Get the bounding box of all members included or empty box if set has no items
	 , bbox: function(){
		 var box = new SVG.BBox()

		 // return an empty box of there are no members
		 if (this.members.length == 0)
			 return box

			 // get the first rbox and update the target bbox
			 var rbox = this.members[0].rbox()
			 box.x      = rbox.x
			 box.y      = rbox.y
			 box.width  = rbox.width
			 box.height = rbox.height

			 this.each(function() {
				 // user rbox for correct position and visual representation
				 box = box.merge(this.rbox())
			 })

			 return box
	 }
	 }

	 // Add parent method
	 , construct: {
		 // Create a new set
		 set: function(members) {
			 return new SVG.Set(members)
		 }
	 }
	 })

	 SVG.FX.Set = SVG.invent({
		 // Initialize node
		 create: function(set) {
			 // store reference to set
			 this.set = set
		 }

	 })

//	 Alias methods
	 SVG.Set.inherit = function() {
		 var m
		 , methods = []

		 // gather shape methods
		 for(var m in SVG.Shape.prototype)
			 if (typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function')
				 methods.push(m)

				 // apply shape aliasses
				 methods.forEach(function(method) {
					 SVG.Set.prototype[method] = function() {
						 for (var i = 0, il = this.members.length; i < il; i++)
							 if (this.members[i] && typeof this.members[i][method] == 'function')
								 this.members[i][method].apply(this.members[i], arguments)

								 return method == 'animate' ? (this.fx || (this.fx = new SVG.FX.Set(this))) : this
					 }
				 })

				 // clear methods for the next round
				 methods = []

		 // gather fx methods
		 for(var m in SVG.FX.prototype)
			 if (typeof SVG.FX.prototype[m] == 'function' && typeof SVG.FX.Set.prototype[m] != 'function')
				 methods.push(m)

				 // apply fx aliasses
				 methods.forEach(function(method) {
					 SVG.FX.Set.prototype[method] = function() {
						 for (var i = 0, il = this.set.members.length; i < il; i++)
							 this.set.members[i].fx[method].apply(this.set.members[i].fx, arguments)

							 return this
					 }
				 })
	 }




	 SVG.extend(SVG.Element, {
		 // Store data values on svg nodes
		 data: function(a, v, r) {
			 if (typeof a == 'object') {
				 for (v in a)
					 this.data(v, a[v])

			 } else if (arguments.length < 2) {
				 try {
					 return JSON.parse(this.attr('data-' + a))
				 } catch(e) {
					 return this.attr('data-' + a)
				 }

			 } else {
				 this.attr(
						 'data-' + a
						 , v === null ?
								 null :
									 r === true || typeof v === 'string' || typeof v === 'number' ?
											 v :
												 JSON.stringify(v)
				 )
			 }

			 return this
		 }
	 })
	 SVG.extend(SVG.Element, {
		 // Remember arbitrary data
		 remember: function(k, v) {
			 // remember every item in an object individually
			 if (typeof arguments[0] == 'object')
				 for (var v in k)
					 this.remember(v, k[v])

					 // retrieve memory
					 else if (arguments.length == 1)
						 return this.memory()[k]

			 // store memory
					 else
						 this.memory()[k] = v

						 return this
		 }

	 // Erase a given memory
	 , forget: function() {
		 if (arguments.length == 0)
			 this._memory = {}
		 else
			 for (var i = arguments.length - 1; i >= 0; i--)
				 delete this.memory()[arguments[i]]

		 return this
	 }

	 // Initialize or return local memory object
	 , memory: function() {
		 return this._memory || (this._memory = {})
	 }

	 })
//	 Method for getting an element by id
	 SVG.get = function(id) {
		 var node = document.getElementById(idFromReference(id) || id)
		 return SVG.adopt(node)
	 }

//	 Select elements by query string
	 SVG.select = function(query, parent) {
		 return new SVG.Set(
				 SVG.utils.map((parent || document).querySelectorAll(query), function(node) {
					 return SVG.adopt(node)
				 })
		 )
	 }

	 SVG.extend(SVG.Parent, {
		 // Scoped select method
		 select: function(query) {
			 return SVG.select(query, this.node)
		 }

	 })
//	 tests if a given selector matches an element
	 function matches(el, selector) {
		 return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
	 }

//	 Convert dash-separated-string to camelCase
	 function camelCase(s) {
		 return s.toLowerCase().replace(/-(.)/g, function(m, g) {
			 return g.toUpperCase()
		 })
	 }

//	 Capitalize first letter of a string
	 function capitalize(s) {
		 return s.charAt(0).toUpperCase() + s.slice(1)
	 }

//	 Ensure to six-based hex
	 function fullHex(hex) {
		 return hex.length == 4 ?
				 [ '#',
				   hex.substring(1, 2), hex.substring(1, 2)
				   , hex.substring(2, 3), hex.substring(2, 3)
				   , hex.substring(3, 4), hex.substring(3, 4)
				   ].join('') : hex
	 }

//	 Component to hex value
	 function compToHex(comp) {
		 var hex = comp.toString(16)
		 return hex.length == 1 ? '0' + hex : hex
	 }

//	 Calculate proportional width and height values when necessary
	 function proportionalSize(box, width, height) {
		 if (height == null)
			 height = box.height / box.width * width
			 else if (width == null)
				 width = box.width / box.height * height

				 return {
				 width:  width
				 , height: height
			 }
	 }

//	 Delta transform point
	 function deltaTransformPoint(matrix, x, y) {
		 return {
			 x: x * matrix.a + y * matrix.c + 0
			 , y: x * matrix.b + y * matrix.d + 0
		 }
	 }

//	 Map matrix array to object
	 function arrayToMatrix(a) {
		 return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] }
	 }

//	 Parse matrix if required
	 function parseMatrix(matrix) {
		 if (!(matrix instanceof SVG.Matrix))
			 matrix = new SVG.Matrix(matrix)

		 return matrix
	 }

//	 Add centre point to transform object
	 function ensureCentre(o, target) {
		 o.cx = o.cx == null ? target.bbox().cx : o.cx
				 o.cy = o.cy == null ? target.bbox().cy : o.cy
	 }

//	 Convert string to matrix
	 function stringToMatrix(source) {
		 // remove matrix wrapper and split to individual numbers
		 source = source
		 .replace(SVG.regex.whitespace, '')
		 .replace(SVG.regex.matrix, '')
		 .split(SVG.regex.matrixElements)

		 // convert string values to floats and convert to a matrix-formatted object
		 return arrayToMatrix(
				 SVG.utils.map(source, function(n) {
					 return parseFloat(n)
				 })
		 )
	 }

//	 Calculate position according to from and to
	 function at(o, pos) {
		 // number recalculation (don't bother converting to SVG.Number for performance reasons)
		 return typeof o.from == 'number' ?
				 o.from + (o.to - o.from) * pos :

					 // instance recalculation
					 o instanceof SVG.Color || o instanceof SVG.Number || o instanceof SVG.Matrix ? o.at(pos) :

						 // for all other values wait until pos has reached 1 to return the final value
						 pos < 1 ? o.from : o.to
	 }

//	 PathArray Helpers
	 function arrayToString(a) {
		 for (var i = 0, il = a.length, s = ''; i < il; i++) {
			 s += a[i][0]

			 if (a[i][1] != null) {
				 s += a[i][1]

				 if (a[i][2] != null) {
					 s += ' '
						 s += a[i][2]

					 if (a[i][3] != null) {
						 s += ' '
							 s += a[i][3]
						 s += ' '
							 s += a[i][4]

						 if (a[i][5] != null) {
							 s += ' '
								 s += a[i][5]
							 s += ' '
								 s += a[i][6]

							 if (a[i][7] != null) {
								 s += ' '
									 s += a[i][7]
							 }
						 }
					 }
				 }
			 }
		 }

		 return s + ' '
	 }

//	 Deep new id assignment
	 function assignNewId(node) {
		 // do the same for SVG child nodes as well
		 for (var i = node.childNodes.length - 1; i >= 0; i--)
			 if (node.childNodes[i] instanceof SVGElement)
				 assignNewId(node.childNodes[i])

				 return SVG.adopt(node).id(SVG.eid(node.nodeName))
	 }

//	 Add more bounding box properties
	 function fullBox(b) {
		 if (b.x == null) {
			 b.x      = 0
			 b.y      = 0
			 b.width  = 0
			 b.height = 0
		 }

		 b.w  = b.width
		 b.h  = b.height
		 b.x2 = b.x + b.width
		 b.y2 = b.y + b.height
		 b.cx = b.x + b.width / 2
		 b.cy = b.y + b.height / 2

		 return b
	 }

//	 Get id from reference string
	 function idFromReference(url) {
		 var m = url.toString().match(SVG.regex.reference)

		 if (m) return m[1]
	 }

//	 Create matrix array for looping
	 var abcdef = 'abcdef'.split('')
//	 Add CustomEvent to IE9 and IE10
	 if (typeof CustomEvent !== 'function') {
		 // Code from: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
		 var CustomEvent = function(event, options) {
			 options = options || { bubbles: false, cancelable: false, detail: undefined }
			 var e = document.createEvent('CustomEvent')
			 e.initCustomEvent(event, options.bubbles, options.cancelable, options.detail)
			 return e
		 }

		 CustomEvent.prototype = window.Event.prototype

		 window.CustomEvent = CustomEvent
	 }

//	 requestAnimationFrame / cancelAnimationFrame Polyfill with fallback based on Paul Irish
	 (function(w) {
		 var lastTime = 0
		 var vendors = ['moz', 'webkit']

		 for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			 w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame']
			 w.cancelAnimationFrame  = w[vendors[x] + 'CancelAnimationFrame'] ||
			 w[vendors[x] + 'CancelRequestAnimationFrame']
		 }

		 w.requestAnimationFrame = w.requestAnimationFrame ||
		 function(callback) {
			 var currTime = new Date().getTime()
			 var timeToCall = Math.max(0, 16 - (currTime - lastTime))

			 var id = w.setTimeout(function() {
				 callback(currTime + timeToCall)
			 }, timeToCall)

			 lastTime = currTime + timeToCall
			 return id
		 }

		 w.cancelAnimationFrame = w.cancelAnimationFrame || w.clearTimeout;

	 }(window))

	 return SVG

 }));

//IN BUILT PATH STRINGS

 var svg_path_set = {
		 "Question" : "M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466z M17.328,24.371h-2.707v-2.596h2.707V24.371zM17.328,19.003v0.858h-2.707v-1.057c0-3.19,3.63-3.696,3.63-5.963c0-1.034-0.924-1.826-2.134-1.826c-1.254,0-2.354,0.924-2.354,0.924l-1.541-1.915c0,0,1.519-1.584,4.137-1.584c2.487,0,4.796,1.54,4.796,4.136C21.156,16.208,17.328,16.627,17.328,19.003z",
		 "Up" : "M23.963,20.834L17.5,9.64c-0.825-1.429-2.175-1.429-3,0L8.037,20.834c-0.825,1.429-0.15,2.598,1.5,2.598h12.926C24.113,23.432,24.788,22.263,23.963,20.834z",
		 "Down" : "M8.037,11.166L14.5,22.359c0.825,1.43,2.175,1.43,3,0l6.463-11.194c0.826-1.429,0.15-2.598-1.5-2.598H9.537C7.886,8.568,7.211,9.737,8.037,11.166z",
		 "Warning" : "M26.711,14.086L16.914,4.29c-0.778-0.778-2.051-0.778-2.829,0L4.29,14.086c-0.778,0.778-0.778,2.05,0,2.829l9.796,9.796c0.778,0.777,2.051,0.777,2.829,0l9.797-9.797C27.488,16.136,27.488,14.864,26.711,14.086zM14.702,8.981c0.22-0.238,0.501-0.357,0.844-0.357s0.624,0.118,0.844,0.353c0.221,0.235,0.33,0.531,0.33,0.885c0,0.306-0.101,1.333-0.303,3.082c-0.201,1.749-0.379,3.439-0.531,5.072H15.17c-0.135-1.633-0.301-3.323-0.5-5.072c-0.198-1.749-0.298-2.776-0.298-3.082C14.372,9.513,14.482,9.22,14.702,8.981zM16.431,21.799c-0.247,0.241-0.542,0.362-0.885,0.362s-0.638-0.121-0.885-0.362c-0.248-0.241-0.372-0.533-0.372-0.876s0.124-0.638,0.372-0.885c0.247-0.248,0.542-0.372,0.885-0.372s0.638,0.124,0.885,0.372c0.248,0.247,0.372,0.542,0.372,0.885S16.679,21.558,16.431,21.799z",
		 "Cloud" : "M7.562,24.812c-3.313,0-6-2.687-6-6l0,0c0.002-2.659,1.734-4.899,4.127-5.684l0,0c0.083-2.26,1.937-4.064,4.216-4.066l0,0c0.73,0,1.415,0.19,2.01,0.517l0,0c1.266-2.105,3.57-3.516,6.208-3.517l0,0c3.947,0.002,7.157,3.155,7.248,7.079l0,0c2.362,0.804,4.062,3.034,4.064,5.671l0,0c0,3.313-2.687,6-6,6l0,0H7.562L7.562,24.812zM24.163,14.887c-0.511-0.095-0.864-0.562-0.815-1.079l0,0c0.017-0.171,0.027-0.336,0.027-0.497l0,0c-0.007-2.899-2.352-5.245-5.251-5.249l0,0c-2.249-0.002-4.162,1.418-4.911,3.41l0,0c-0.122,0.323-0.406,0.564-0.748,0.63l0,0c-0.34,0.066-0.694-0.052-0.927-0.309l0,0c-0.416-0.453-0.986-0.731-1.633-0.731l0,0c-1.225,0.002-2.216,0.993-2.22,2.218l0,0c0,0.136,0.017,0.276,0.045,0.424l0,0c0.049,0.266-0.008,0.54-0.163,0.762l0,0c-0.155,0.223-0.392,0.371-0.657,0.414l0,0c-1.9,0.313-3.352,1.949-3.35,3.931l0,0c0.004,2.209,1.792,3.995,4.001,4.001l0,0h15.874c2.209-0.006,3.994-1.792,3.999-4.001l0,0C27.438,16.854,26.024,15.231,24.163,14.887L24.163,14.887",
		 "Android" : "M6.13,11.126c-0.894,0-1.624,0.731-1.624,1.624v6.496c0,0.895,0.73,1.624,1.624,1.624c0.893,0,1.624-0.729,1.624-1.624V12.75C7.754,11.856,7.023,11.126,6.13,11.126zM19.516,4.96l1.32-2.035c0.074-0.113,0.042-0.264-0.07-0.338c-0.113-0.074-0.266-0.041-0.34,0.072l-1.367,2.106c-0.93-0.36-1.966-0.561-3.059-0.561c-1.094,0-2.13,0.201-3.058,0.561l-1.368-2.106c-0.073-0.113-0.225-0.145-0.338-0.072c-0.113,0.074-0.145,0.225-0.072,0.338l1.321,2.035c-2.186,1.009-3.674,2.928-3.717,5.138h14.464C23.189,7.888,21.702,5.969,19.516,4.96zM12.898,8.062c-0.459,0-0.832-0.373-0.832-0.832s0.373-0.832,0.832-0.832c0.46,0,0.832,0.373,0.832,0.832S13.358,8.062,12.898,8.062zM19.102,8.062c-0.459,0-0.832-0.373-0.832-0.832s0.373-0.832,0.832-0.832s0.832,0.373,0.832,0.832S19.561,8.062,19.102,8.062zM25.87,11.126c-0.894,0-1.624,0.731-1.624,1.624v6.496c0,0.895,0.73,1.624,1.624,1.624s1.624-0.729,1.624-1.624V12.75C27.494,11.856,26.764,11.126,25.87,11.126zM8.756,22.904c0,0.723,0.591,1.312,1.314,1.312h1.363v3.61c0,0.896,0.731,1.624,1.625,1.624c0.893,0,1.624-0.729,1.624-1.624v-3.611h2.636v3.61c0,0.896,0.729,1.624,1.625,1.624c0.894,0,1.623-0.729,1.623-1.624v-3.61h1.363c0.723,0,1.312-0.591,1.312-1.312V11.07H8.756V22.904z",
		 "Ios" : "M4.065,21.797h2.236v-8.784H4.065V21.797zM5.184,9.352c-0.739,0-1.245,0.523-1.245,1.208c0,0.667,0.487,1.19,1.227,1.19c0.775,0,1.263-0.523,1.263-1.19C6.41,9.875,5.941,9.352,5.184,9.352zM13.915,9.442c-3.427,0-5.771,2.633-5.771,6.367c0,3.571,2.164,6.186,5.591,6.186c3.355,0,5.826-2.326,5.826-6.402C19.561,12.13,17.468,9.442,13.915,9.442zM13.86,20.21c-2.128,0-3.373-1.966-3.373-4.437c0-2.507,1.172-4.545,3.373-4.545c2.218,0,3.354,2.164,3.354,4.455C17.215,18.227,16.007,20.21,13.86,20.21zM25.695,14.727c-1.622-0.631-2.326-1.064-2.326-2.002c0-0.703,0.613-1.461,2.021-1.461c1.137,0,1.979,0.343,2.416,0.577l0.541-1.785c-0.643-0.325-1.604-0.613-2.933-0.613c-2.633,0-4.293,1.515-4.293,3.499c0,1.75,1.278,2.813,3.282,3.535c1.552,0.559,2.162,1.1,2.162,2.02c0,0.992-0.797,1.659-2.227,1.659c-1.137,0-2.219-0.36-2.938-0.775l-0.484,1.84c0.668,0.396,2.002,0.758,3.28,0.758c3.14,0,4.616-1.688,4.616-3.644C28.835,16.585,27.807,15.521,25.695,14.727z",
		 "Linkedin" : "M27.25,3.125h-22c-1.104,0-2,0.896-2,2v22c0,1.104,0.896,2,2,2h22c1.104,0,2-0.896,2-2v-22C29.25,4.021,28.354,3.125,27.25,3.125zM11.219,26.781h-4v-14h4V26.781zM9.219,11.281c-1.383,0-2.5-1.119-2.5-2.5s1.117-2.5,2.5-2.5s2.5,1.119,2.5,2.5S10.602,11.281,9.219,11.281zM25.219,26.781h-4v-8.5c0-0.4-0.403-1.055-0.687-1.213c-0.375-0.211-1.261-0.229-1.665-0.034l-1.648,0.793v8.954h-4v-14h4v0.614c1.583-0.723,3.78-0.652,5.27,0.184c1.582,0.886,2.73,2.864,2.73,4.702V26.781z",
		 "Mobile" : "M20.755,1H10.62C9.484,1,8.562,1.921,8.562,3.058v24.385c0,1.136,0.921,2.058,2.058,2.058h10.135c1.136,0,2.058-0.922,2.058-2.058V3.058C22.812,1.921,21.891,1,20.755,1zM14.659,3.264h2.057c0.101,0,0.183,0.081,0.183,0.18c0,0.1-0.082,0.18-0.183,0.18h-2.057c-0.1,0-0.181-0.081-0.181-0.18C14.478,3.344,14.559,3.264,14.659,3.264zM13.225,3.058c0.199,0,0.359,0.162,0.359,0.36c0,0.198-0.161,0.36-0.359,0.36c-0.2,0-0.36-0.161-0.36-0.36S13.025,3.058,13.225,3.058zM15.688,28.473c-0.796,0-1.44-0.646-1.44-1.438c0-0.799,0.645-1.439,1.44-1.439s1.44,0.646,1.44,1.439S16.483,28.473,15.688,28.473zM22.041,24.355c0,0.17-0.139,0.309-0.309,0.309H9.642c-0.17,0-0.308-0.139-0.308-0.309V6.042c0-0.17,0.138-0.309,0.308-0.309h12.09c0.17,0,0.309,0.138,0.309,0.309V24.355z",
		 "Tablet" : "M25.221,1.417H6.11c-0.865,0-1.566,0.702-1.566,1.566v25.313c0,0.865,0.701,1.565,1.566,1.565h19.111c0.865,0,1.565-0.7,1.565-1.565V2.984C26.787,2.119,26.087,1.417,25.221,1.417zM15.666,29.299c-0.346,0-0.626-0.279-0.626-0.625s0.281-0.627,0.626-0.627c0.346,0,0.627,0.281,0.627,0.627S16.012,29.299,15.666,29.299zM24.376,26.855c0,0.174-0.142,0.312-0.313,0.312H7.27c-0.173,0-0.313-0.142-0.313-0.312V4.3c0-0.173,0.14-0.313,0.313-0.313h16.792c0.172,0,0.312,0.14,0.312,0.313L24.376,26.855L24.376,26.855z",
		 "Pc" : "M28.936,2.099H2.046c-0.506,0-0.919,0.414-0.919,0.92v21.097c0,0.506,0.413,0.919,0.919,0.919h17.062v-0.003h9.828c0.506,0,0.92-0.413,0.92-0.921V3.019C29.854,2.513,29.439,2.099,28.936,2.099zM28.562,20.062c0,0.412-0.338,0.75-0.75,0.75H3.062c-0.413,0-0.75-0.338-0.75-0.75v-16c0-0.413,0.337-0.75,0.75-0.75h24.75c0.412,0,0.75,0.337,0.75,0.75V20.062zM20.518,28.4c-0.033-0.035-0.062-0.055-0.068-0.062l-0.01-0.004l-0.008-0.004c0,0-0.046-0.021-0.119-0.062c-0.108-0.056-0.283-0.144-0.445-0.237c-0.162-0.097-0.32-0.199-0.393-0.271c-0.008-0.014-0.035-0.079-0.058-0.17c-0.083-0.32-0.161-0.95-0.22-1.539h-7.5c-0.023,0.23-0.048,0.467-0.076,0.691c-0.035,0.272-0.073,0.524-0.113,0.716c-0.02,0.096-0.039,0.175-0.059,0.23c-0.009,0.025-0.018,0.05-0.024,0.062c-0.003,0.006-0.005,0.01-0.007,0.013c-0.094,0.096-0.34,0.246-0.553,0.36c-0.107,0.062-0.209,0.11-0.283,0.146c-0.074,0.037-0.119,0.062-0.119,0.062l-0.007,0.004l-0.008,0.004c-0.01,0.009-0.038,0.022-0.07,0.062c-0.031,0.037-0.067,0.103-0.067,0.185c0.002,0.002-0.004,0.037-0.006,0.088c0,0.043,0.007,0.118,0.068,0.185c0.061,0.062,0.143,0.08,0.217,0.08h9.716c0.073,0,0.153-0.021,0.215-0.08c0.062-0.063,0.068-0.142,0.068-0.185c-0.001-0.051-0.008-0.086-0.007-0.088C20.583,28.503,20.548,28.439,20.518,28.4z",
		 "User" : "M20.771,12.364c0,0,0.849-3.51,0-4.699c-0.85-1.189-1.189-1.981-3.058-2.548s-1.188-0.454-2.547-0.396c-1.359,0.057-2.492,0.792-2.492,1.188c0,0-0.849,0.057-1.188,0.397c-0.34,0.34-0.906,1.924-0.906,2.321s0.283,3.058,0.566,3.624l-0.337,0.113c-0.283,3.283,1.132,3.68,1.132,3.68c0.509,3.058,1.019,1.756,1.019,2.548s-0.51,0.51-0.51,0.51s-0.452,1.245-1.584,1.698c-1.132,0.452-7.416,2.886-7.927,3.396c-0.511,0.511-0.453,2.888-0.453,2.888h26.947c0,0,0.059-2.377-0.452-2.888c-0.512-0.511-6.796-2.944-7.928-3.396c-1.132-0.453-1.584-1.698-1.584-1.698s-0.51,0.282-0.51-0.51s0.51,0.51,1.02-2.548c0,0,1.414-0.397,1.132-3.68H20.771z",
		 "Users" : "M21.053,20.8c-1.132-0.453-1.584-1.698-1.584-1.698s-0.51,0.282-0.51-0.51s0.51,0.51,1.02-2.548c0,0,1.414-0.397,1.132-3.68h-0.34c0,0,0.849-3.51,0-4.699c-0.85-1.189-1.189-1.981-3.058-2.548s-1.188-0.454-2.547-0.396c-1.359,0.057-2.492,0.792-2.492,1.188c0,0-0.849,0.057-1.188,0.397c-0.34,0.34-0.906,1.924-0.906,2.321s0.283,3.058,0.566,3.624l-0.337,0.113c-0.283,3.283,1.132,3.68,1.132,3.68c0.509,3.058,1.019,1.756,1.019,2.548s-0.51,0.51-0.51,0.51s-0.452,1.245-1.584,1.698c-1.132,0.452-7.416,2.886-7.927,3.396c-0.511,0.511-0.453,2.888-0.453,2.888h26.947c0,0,0.059-2.377-0.452-2.888C28.469,23.686,22.185,21.252,21.053,20.8zM8.583,20.628c-0.099-0.18-0.148-0.31-0.148-0.31s-0.432,0.239-0.432-0.432s0.432,0.432,0.864-2.159c0,0,1.199-0.336,0.959-3.119H9.538c0,0,0.143-0.591,0.237-1.334c-0.004-0.308,0.006-0.636,0.037-0.996l0.038-0.426c-0.021-0.492-0.107-0.939-0.312-1.226C8.818,9.619,8.53,8.947,6.947,8.467c-1.583-0.48-1.008-0.385-2.159-0.336C3.636,8.179,2.676,8.802,2.676,9.139c0,0-0.72,0.048-1.008,0.336c-0.271,0.271-0.705,1.462-0.757,1.885v0.281c0.047,0.653,0.258,2.449,0.469,2.872l-0.286,0.096c-0.239,2.783,0.959,3.119,0.959,3.119c0.432,2.591,0.864,1.488,0.864,2.159s-0.432,0.432-0.432,0.432s-0.383,1.057-1.343,1.439c-0.061,0.024-0.139,0.056-0.232,0.092v5.234h0.575c-0.029-1.278,0.077-2.927,0.746-3.594C2.587,23.135,3.754,22.551,8.583,20.628zM30.913,11.572c-0.04-0.378-0.127-0.715-0.292-0.946c-0.719-1.008-1.008-1.679-2.59-2.159c-1.584-0.48-1.008-0.385-2.16-0.336C24.72,8.179,23.76,8.802,23.76,9.139c0,0-0.719,0.048-1.008,0.336c-0.271,0.272-0.709,1.472-0.758,1.891h0.033l0.08,0.913c0.02,0.231,0.022,0.436,0.027,0.645c0.09,0.666,0.21,1.35,0.33,1.589l-0.286,0.096c-0.239,2.783,0.96,3.119,0.96,3.119c0.432,2.591,0.863,1.488,0.863,2.159s-0.432,0.432-0.432,0.432s-0.053,0.142-0.163,0.338c4.77,1.9,5.927,2.48,6.279,2.834c0.67,0.667,0.775,2.315,0.746,3.594h0.48v-5.306c-0.016-0.006-0.038-0.015-0.052-0.021c-0.959-0.383-1.343-1.439-1.343-1.439s-0.433,0.239-0.433-0.432s0.433,0.432,0.864-2.159c0,0,0.804-0.229,0.963-1.841v-1.227c-0.001-0.018-0.001-0.033-0.003-0.051h-0.289c0,0,0.215-0.89,0.292-1.861V11.572z",
		 "Callout" : "M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z",
		 "Callout-warn" : "M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z",
		 "Callout-question" : "M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.982,21.375h-1.969v-1.889h1.969V21.375zM16.982,17.469v0.625h-1.969v-0.769c0-2.321,2.641-2.689,2.641-4.337c0-0.752-0.672-1.329-1.553-1.329c-0.912,0-1.713,0.672-1.713,0.672l-1.12-1.393c0,0,1.104-1.153,3.009-1.153c1.81,0,3.49,1.121,3.49,3.009C19.768,15.437,16.982,15.741,16.982,17.469z",
		 "Favourite" : "M14.615,4.928c0.487-0.986,1.284-0.986,1.771,0l2.249,4.554c0.486,0.986,1.775,1.923,2.864,2.081l5.024,0.73c1.089,0.158,1.335,0.916,0.547,1.684l-3.636,3.544c-0.788,0.769-1.28,2.283-1.095,3.368l0.859,5.004c0.186,1.085-0.459,1.553-1.433,1.041l-4.495-2.363c-0.974-0.512-2.567-0.512-3.541,0l-4.495,2.363c-0.974,0.512-1.618,0.044-1.432-1.041l0.858-5.004c0.186-1.085-0.307-2.6-1.094-3.368L3.93,13.977c-0.788-0.768-0.542-1.525,0.547-1.684l5.026-0.73c1.088-0.158,2.377-1.095,2.864-2.081L14.615,4.928z",
		 "Heart" : "M24.132,7.971c-2.203-2.205-5.916-2.098-8.25,0.235L15.5,8.588l-0.382-0.382c-2.334-2.333-6.047-2.44-8.25-0.235c-2.204,2.203-2.098,5.916,0.235,8.249l8.396,8.396l8.396-8.396C26.229,13.887,26.336,10.174,24.132,7.971z",
		 "Columnchart" : "M21.25,8.375V28h6.5V8.375H21.25zM12.25,28h6.5V4.125h-6.5V28zM3.25,28h6.5V12.625h-6.5V28z",
		 "Piechart" : "M29.568,11.75c-12.482-0.001-22.6,10.117-22.599,22.599c-0.001,12.482,10.117,22.6,22.599,22.599   c12.482,0.001,22.6-10.117,22.599-22.599l-22.599-0.001V11.75z M34.432,7.052v22.6h22.599C57.032,17.169,46.915,7.05,34.432,7.052z",
		 "Linechart" : "M3.625,25.062c-0.539-0.115-0.885-0.646-0.77-1.187l0,0L6.51,6.584l2.267,9.259l1.923-5.188l3.581,3.741l3.883-13.103l2.934,11.734l1.96-1.509l5.271,11.74c0.226,0.504,0,1.095-0.505,1.321l0,0c-0.505,0.227-1.096,0-1.322-0.504l0,0l-4.23-9.428l-2.374,1.826l-1.896-7.596l-2.783,9.393l-3.754-3.924L8.386,22.66l-1.731-7.083l-1.843,8.711c-0.101,0.472-0.515,0.794-0.979,0.794l0,0C3.765,25.083,3.695,25.076,3.625,25.062L3.625,25.062z",
		 "Car" : "M28.59,10.781h-2.242c-0.129,0-0.244,0.053-0.333,0.133c-0.716-1.143-1.457-2.058-2.032-2.633c-2-2-14-2-16,0C7.41,8.854,6.674,9.763,5.961,10.898c-0.086-0.069-0.19-0.117-0.309-0.117H3.41c-0.275,0-0.5,0.225-0.5,0.5v1.008c0,0.275,0.221,0.542,0.491,0.594l1.359,0.259c-1.174,2.619-1.866,5.877-0.778,9.14v1.938c0,0.553,0.14,1,0.313,1h2.562c0.173,0,0.313-0.447,0.313-1v-1.584c2.298,0.219,5.551,0.459,8.812,0.459c3.232,0,6.521-0.235,8.814-0.453v1.578c0,0.553,0.141,1,0.312,1h2.562c0.172,0,0.312-0.447,0.312-1l-0.002-1.938c1.087-3.261,0.397-6.516-0.775-9.134l1.392-0.265c0.271-0.052,0.491-0.318,0.491-0.594v-1.008C29.09,11.006,28.865,10.781,28.59,10.781zM7.107,18.906c-1.001,0-1.812-0.812-1.812-1.812s0.812-1.812,1.812-1.812s1.812,0.812,1.812,1.812S8.108,18.906,7.107,18.906zM5.583,13.716c0.96-2.197,2.296-3.917,3.106-4.728c0.585-0.585,3.34-1.207,7.293-1.207c3.953,0,6.708,0.622,7.293,1.207c0.811,0.811,2.146,2.53,3.106,4.728c-2.133,0.236-6.286-0.31-10.399-0.31S7.716,13.952,5.583,13.716zM24.857,18.906c-1.001,0-1.812-0.812-1.812-1.812s0.812-1.812,1.812-1.812s1.812,0.812,1.812,1.812S25.858,18.906,24.857,18.906z",
		 "Flag" : "M9.5,3v10c8,0,8,4,16,4V7C17.5,7,17.5,3,9.5,3z M6.5,29h2V3h-2V29z",
		 "Data" : "M15.499,23.438c-3.846,0-7.708-0.987-9.534-3.117c-0.054,0.236-0.09,0.48-0.09,0.737v3.877c0,3.435,4.988,4.998,9.625,4.998s9.625-1.563,9.625-4.998v-3.877c0-0.258-0.036-0.501-0.09-0.737C23.209,22.451,19.347,23.438,15.499,23.438zM15.499,15.943c-3.846,0-7.708-0.987-9.533-3.117c-0.054,0.236-0.091,0.479-0.091,0.736v3.877c0,3.435,4.988,4.998,9.625,4.998s9.625-1.563,9.625-4.998v-3.877c0-0.257-0.036-0.501-0.09-0.737C23.209,14.956,19.347,15.943,15.499,15.943zM15.5,1.066c-4.637,0-9.625,1.565-9.625,5.001v3.876c0,3.435,4.988,4.998,9.625,4.998s9.625-1.563,9.625-4.998V6.067C25.125,2.632,20.137,1.066,15.5,1.066zM15.5,9.066c-4.211,0-7.625-1.343-7.625-3c0-1.656,3.414-3,7.625-3s7.625,1.344,7.625,3C23.125,7.724,19.711,9.066,15.5,9.066z",
		 "Shoppingcart" : "M29.02,11.754L8.416,9.473L7.16,4.716C7.071,4.389,6.772,4.158,6.433,4.158H3.341C3.114,3.866,2.775,3.667,2.377,3.667c-0.686,0-1.242,0.556-1.242,1.242c0,0.686,0.556,1.242,1.242,1.242c0.399,0,0.738-0.201,0.965-0.493h2.512l5.23,19.8c-0.548,0.589-0.891,1.373-0.891,2.242c0,1.821,1.473,3.293,3.293,3.293c1.82,0,3.294-1.472,3.297-3.293c0-0.257-0.036-0.504-0.093-0.743h5.533c-0.056,0.239-0.092,0.486-0.092,0.743c0,1.821,1.475,3.293,3.295,3.293s3.295-1.472,3.295-3.293c0-1.82-1.473-3.295-3.295-3.297c-0.951,0.001-1.801,0.409-2.402,1.053h-7.136c-0.601-0.644-1.451-1.052-2.402-1.053c-0.379,0-0.738,0.078-1.077,0.196l-0.181-0.685H26.81c1.157-0.027,2.138-0.83,2.391-1.959l1.574-7.799c0.028-0.145,0.041-0.282,0.039-0.414C30.823,12.733,30.051,11.86,29.02,11.754zM25.428,27.994c-0.163,0-0.295-0.132-0.297-0.295c0.002-0.165,0.134-0.297,0.297-0.297s0.295,0.132,0.297,0.297C25.723,27.862,25.591,27.994,25.428,27.994zM27.208,20.499l0.948-0.948l-0.318,1.578L27.208,20.499zM12.755,11.463l1.036,1.036l-1.292,1.292l-1.292-1.292l1.087-1.087L12.755,11.463zM17.253,11.961l0.538,0.538l-1.292,1.292l-1.292-1.292l0.688-0.688L17.253,11.961zM9.631,14.075l0.868-0.868l1.292,1.292l-1.292,1.292l-0.564-0.564L9.631,14.075zM9.335,12.956l-0.328-1.24L9.792,12.5L9.335,12.956zM21.791,16.499l-1.292,1.292l-1.292-1.292l1.292-1.292L21.791,16.499zM21.207,14.5l1.292-1.292l1.292,1.292l-1.292,1.292L21.207,14.5zM18.5,15.791l-1.293-1.292l1.292-1.292l1.292,1.292L18.5,15.791zM17.791,16.499L16.5,17.791l-1.292-1.292l1.292-1.292L17.791,16.499zM14.499,15.791l-1.292-1.292l1.292-1.292l1.292,1.292L14.499,15.791zM13.791,16.499l-1.292,1.291l-1.292-1.291l1.292-1.292L13.791,16.499zM10.499,17.207l1.292,1.292l-0.785,0.784l-0.54-2.044L10.499,17.207zM11.302,20.404l1.197-1.197l1.292,1.292L12.5,21.791l-1.131-1.13L11.302,20.404zM13.208,18.499l1.291-1.292l1.292,1.292L14.5,19.791L13.208,18.499zM16.5,19.207l1.292,1.292L16.5,21.79l-1.292-1.291L16.5,19.207zM17.208,18.499l1.292-1.292l1.291,1.292L18.5,19.79L17.208,18.499zM20.499,19.207l1.292,1.292L20.5,21.79l-1.292-1.292L20.499,19.207zM21.207,18.499l1.292-1.292l1.292,1.292l-1.292,1.292L21.207,18.499zM23.207,16.499l1.292-1.292l1.292,1.292l-1.292,1.292L23.207,16.499zM25.207,14.499l1.292-1.292L27.79,14.5l-1.291,1.292L25.207,14.499zM24.499,13.792l-1.156-1.156l2.082,0.23L24.499,13.792zM21.791,12.5l-1.292,1.292L19.207,12.5l0.29-0.29l2.253,0.25L21.791,12.5zM14.5,11.791l-0.152-0.152l0.273,0.03L14.5,11.791zM10.5,11.792l-0.65-0.65l1.171,0.129L10.5,11.792zM14.5,21.207l1.205,1.205h-2.409L14.5,21.207zM18.499,21.207l1.206,1.206h-2.412L18.499,21.207zM22.499,21.207l1.208,1.207l-2.414-0.001L22.499,21.207zM23.207,20.499l1.292-1.292l1.292,1.292l-1.292,1.292L23.207,20.499zM25.207,18.499l1.292-1.291l1.291,1.291l-1.291,1.292L25.207,18.499zM28.499,17.791l-1.291-1.292l1.291-1.291l0.444,0.444l-0.429,2.124L28.499,17.791zM29.001,13.289l-0.502,0.502l-0.658-0.658l1.016,0.112C28.911,13.253,28.956,13.271,29.001,13.289zM13.487,27.994c-0.161,0-0.295-0.132-0.295-0.295c0-0.165,0.134-0.297,0.295-0.297c0.163,0,0.296,0.132,0.296,0.297C13.783,27.862,13.651,27.994,13.487,27.994zM26.81,22.414h-1.517l1.207-1.207l0.93,0.93C27.243,22.306,27.007,22.428,26.81,22.414z",
		 "Key" : "M18.386,16.009l0.009-0.006l-0.58-0.912c1.654-2.226,1.876-5.319,0.3-7.8c-2.043-3.213-6.303-4.161-9.516-2.118c-3.212,2.042-4.163,6.302-2.12,9.517c1.528,2.402,4.3,3.537,6.944,3.102l0.424,0.669l0.206,0.045l0.779-0.447l-0.305,1.377l2.483,0.552l-0.296,1.325l1.903,0.424l-0.68,3.06l1.406,0.313l-0.424,1.906l4.135,0.918l0.758-3.392L18.386,16.009z M10.996,8.944c-0.685,0.436-1.593,0.233-2.029-0.452C8.532,7.807,8.733,6.898,9.418,6.463s1.594-0.233,2.028,0.452C11.883,7.6,11.68,8.509,10.996,8.944z",
		 "Mail" : "M28.516,7.167H3.482l12.517,7.108L28.516,7.167zM16.74,17.303C16.51,17.434,16.255,17.5,16,17.5s-0.51-0.066-0.741-0.197L2.5,10.06v14.773h27V10.06L16.74,17.303z",
		 "Power" : "M25.542,8.354c-1.47-1.766-2.896-2.617-3.025-2.695c-0.954-0.565-2.181-0.241-2.739,0.724c-0.556,0.961-0.24,2.194,0.705,2.763c0,0,0.001,0,0.002,0.001c0.001,0,0.002,0.001,0.003,0.002c0.001,0,0.003,0.001,0.004,0.001c0.102,0.062,1.124,0.729,2.08,1.925c1.003,1.261,1.933,3.017,1.937,5.438c-0.001,2.519-1.005,4.783-2.64,6.438c-1.637,1.652-3.877,2.668-6.368,2.669c-2.491-0.001-4.731-1.017-6.369-2.669c-1.635-1.654-2.639-3.919-2.64-6.438c0.005-2.499,0.995-4.292,2.035-5.558c0.517-0.625,1.043-1.098,1.425-1.401c0.191-0.152,0.346-0.263,0.445-0.329c0.049-0.034,0.085-0.058,0.104-0.069c0.005-0.004,0.009-0.006,0.012-0.008s0.004-0.002,0.004-0.002l0,0c0.946-0.567,1.262-1.802,0.705-2.763c-0.559-0.965-1.785-1.288-2.739-0.724c-0.128,0.079-1.555,0.93-3.024,2.696c-1.462,1.751-2.974,4.511-2.97,8.157C2.49,23.775,8.315,29.664,15.5,29.667c7.186-0.003,13.01-5.892,13.012-13.155C28.516,12.864,27.005,10.105,25.542,8.354zM15.5,17.523c1.105,0,2.002-0.907,2.002-2.023h-0.001V3.357c0-1.118-0.896-2.024-2.001-2.024s-2.002,0.906-2.002,2.024V15.5C13.498,16.616,14.395,17.523,15.5,17.523z",
		 "Home" : "M27.812,16l-3.062-3.062V5.625h-2.625v4.688L16,4.188L4.188,16L7,15.933v11.942h17.875V16H27.812zM16,26.167h-5.833v-7H16V26.167zM21.667,23.167h-3.833v-4.042h3.833V23.167z",
		 "Child" : "M21.021,16.349c-0.611-1.104-1.359-1.998-2.109-2.623c-0.875,0.641-1.941,1.031-3.103,1.031c-1.164,0-2.231-0.391-3.105-1.031c-0.75,0.625-1.498,1.519-2.111,2.623c-1.422,2.563-1.578,5.192-0.35,5.874c0.55,0.307,1.127,0.078,1.723-0.496c-0.105,0.582-0.166,1.213-0.166,1.873c0,2.932,1.139,5.307,2.543,5.307c0.846,0,1.265-0.865,1.466-2.189c0.201,1.324,0.62,2.189,1.463,2.189c1.406,0,2.545-2.375,2.545-5.307c0-0.66-0.061-1.291-0.168-1.873c0.598,0.574,1.174,0.803,1.725,0.496C22.602,21.541,22.443,18.912,21.021,16.349zM15.808,13.757c2.362,0,4.278-1.916,4.278-4.279s-1.916-4.279-4.278-4.279c-2.363,0-4.28,1.916-4.28,4.279S13.445,13.757,15.808,13.757z",
		 "Dollar" : "M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466z M17.255,23.88v2.047h-1.958v-2.024c-3.213-0.44-4.621-3.08-4.621-3.08l2.002-1.673c0,0,1.276,2.223,3.586,2.223c1.276,0,2.244-0.683,2.244-1.849c0-2.729-7.349-2.398-7.349-7.459c0-2.2,1.738-3.785,4.137-4.159V5.859h1.958v2.046c1.672,0.22,3.652,1.1,3.652,2.993v1.452h-2.596v-0.704c0-0.726-0.925-1.21-1.959-1.21c-1.32,0-2.288,0.66-2.288,1.584c0,2.794,7.349,2.112,7.349,7.415C21.413,21.614,19.785,23.506,17.255,23.88z",
		 "Tick" : "M2.379,14.729 5.208,11.899 12.958,19.648 25.877,6.733 28.707,9.561 12.958,25.308z",
		 "Cross" : "M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z",
		 "Filter" : "M26.834,6.958c0-2.094-4.852-3.791-10.834-3.791c-5.983,0-10.833,1.697-10.833,3.791c0,0.429,0.213,0.84,0.588,1.224l8.662,15.002v4.899c0,0.414,0.709,0.75,1.583,0.75c0.875,0,1.584-0.336,1.584-0.75v-4.816l8.715-15.093h-0.045C26.625,7.792,26.834,7.384,26.834,6.958zM16,9.75c-6.363,0-9.833-1.845-9.833-2.792S9.637,4.167,16,4.167c6.363,0,9.834,1.844,9.834,2.791S22.363,9.75,16,9.75z",
		 "Grid" : "M36.571,146.286h73.143c20.188,0,36.572-16.385,36.572-36.572V36.571C146.286,16.384,129.901,0,109.714,0H36.571C16.384,0,0,16.384,0,36.571v73.143C0,129.901,16.384,146.286,36.571,146.286z M219.429,146.286h73.143c20.179,0,36.571-16.385,36.571-36.572V36.571C329.143,16.384,312.75,0,292.571,0h-73.143c-20.188,0-36.571,16.384-36.571,36.571v73.143C182.857,129.901,199.241,146.286,219.429,146.286z M402.286,146.286h73.143c20.179,0,36.571-16.385,36.571-36.572V36.571C512,16.384,495.607,0,475.429,0h-73.143c-20.179,0-36.572,16.384-36.572,36.571v73.143C365.714,129.901,382.107,146.286,402.286,146.286z M0,292.571c0,20.179,16.384,36.571,36.571,36.571h73.143c20.188,0,36.572-16.393,36.572-36.571v-73.143c0-20.188-16.385-36.571-36.572-36.571H36.571C16.384,182.857,0,199.241,0,219.429V292.571z M182.857,292.571c0,20.179,16.384,36.571,36.571,36.571h73.143c20.179,0,36.571-16.393,36.571-36.571v-73.143c0-20.188-16.393-36.571-36.571-36.571h-73.143c-20.188,0-36.571,16.384-36.571,36.571V292.571z M365.714,292.571c0,20.179,16.394,36.571,36.572,36.571h73.143c20.179,0,36.571-16.393,36.571-36.571v-73.143c0-20.188-16.393-36.571-36.571-36.571h-73.143c-20.179,0-36.572,16.384-36.572,36.571V292.571z M0,475.429C0,495.607,16.384,512,36.571,512h73.143c20.188,0,36.572-16.393,36.572-36.571v-73.143c0-20.179-16.385-36.572-36.572-36.572H36.571C16.384,365.714,0,382.107,0,402.286V475.429z M182.857,475.429c0,20.179,16.384,36.571,36.571,36.571h73.143c20.179,0,36.571-16.393,36.571-36.571v-73.143c0-20.179-16.393-36.572-36.571-36.572h-73.143c-20.188,0-36.571,16.394-36.571,36.572V475.429z M365.714,475.429c0,20.179,16.394,36.571,36.572,36.571h73.143C495.607,512,512,495.607,512,475.429v-73.143c0-20.179-16.393-36.572-36.571-36.572h-73.143c-20.179,0-36.572,16.394-36.572,36.572V475.429z",
		 "Apple" : "M24.32,10.85c-1.743,1.233-2.615,2.719-2.615,4.455c0,2.079,1.078,3.673,3.232,4.786c-0.578,1.677-1.416,3.134-2.514,4.375c-1.097,1.241-2.098,1.862-3.004,1.862c-0.427,0-1.009-0.143-1.748-0.423l-0.354-0.138c-0.725-0.281-1.363-0.423-1.92-0.423c-0.525,0-1.1,0.11-1.725,0.331l-0.445,0.16l-0.56,0.229c-0.441,0.176-0.888,0.264-1.337,0.264c-1.059,0-2.228-0.872-3.507-2.616c-1.843-2.498-2.764-5.221-2.764-8.167c0-2.095,0.574-3.781,1.725-5.061c1.149-1.279,2.673-1.92,4.568-1.92c0.709,0,1.371,0.13,1.988,0.389l0.423,0.172l0.445,0.183c0.396,0.167,0.716,0.251,0.959,0.251c0.312,0,0.659-0.072,1.04-0.217l0.582-0.229l0.435-0.16c0.693-0.251,1.459-0.377,2.297-0.377C21.512,8.576,23.109,9.334,24.32,10.85zM19.615,3.287c0.021,0.267,0.033,0.473,0.033,0.617c0,1.317-0.479,2.473-1.438,3.467s-2.075,1.49-3.347,1.49c-0.038-0.297-0.058-0.51-0.058-0.639c0-1.12,0.445-2.171,1.337-3.153c0.891-0.982,1.922-1.558,3.096-1.725C19.32,3.329,19.447,3.311,19.615,3.287z",
		 "Windows" : "M20.023,17.484c-1.732-0.205-3.022-0.908-4.212-1.701l0,0l-0.559,0.279l-2.578,8.924l0,0c1.217,0.805,2.905,1.707,4.682,1.914c2.686,0.312,5.56-0.744,6.391-1.195l2.617-9.061l-0.559-0.279C25.805,16.365,23.193,17.857,20.023,17.484zM14.424,14.825c-1.267-0.87-2.578-1.652-4.375-1.816c-0.318-0.029-0.627-0.042-0.925-0.042c-3.011,0-4.948,1.347-4.948,1.347l-2.565,8.877l0,0l0.526,0.281c0.981-0.476,2.78-1.145,5.09-0.984c1.665,0.113,2.92,0.781,4.117,1.531l0.507-0.26l0,0L14.424,14.825zM10.201,12.094c1.664,0.114,2.921,0.78,4.117,1.533l0.509-0.26l0,0L17.4,4.431c-1.27-0.87-2.579-1.653-4.377-1.816c-0.318-0.029-0.626-0.042-0.924-0.042C9.088,2.573,7.15,3.92,7.15,3.92l-2.566,8.878L5.11,13.08C6.092,12.604,7.891,11.936,10.201,12.094zM28.779,5.971L28.779,5.971c0,0.001-2.609,1.492-5.779,1.119c-1.734-0.204-3.023-0.907-4.213-1.701L18.227,5.67l-2.576,8.923l0,0c1.215,0.803,2.906,1.709,4.68,1.915c2.687,0.312,5.558-0.745,6.392-1.197l2.615-9.059L28.779,5.971z",
		 "Linux" : "M11.791,25.229c1.027-0.104,1.162-1.191,0.68-1.666c-0.398-0.392-2.598-2.022-3.171-2.664C9.033,20.6,8.673,20.454,8.52,20.12c-0.352-0.771-0.598-1.869-0.151-2.658c0.081-0.144,0.133-0.078,0.071,0.22c-0.351,1.684,0.746,3.059,0.986,2.354c0.167-0.487,0.013-1.358,0.102-2.051c0.158-1.226,1.273-3.577,1.763-3.712c-0.755-1.398,0.886-2.494,0.866-3.723c-0.014-0.798,0.701,0.982,1.419,1.359c0.802,0.422,1.684-0.794,2.936-1.41c0.354-0.176,0.809-0.376,0.776-0.524c-0.146-0.718-1.644,0.886-2.979,0.939c-0.61,0.024-0.837-0.12-1.072-0.347c-0.712-0.689,0.073-0.115,1.132-0.307c0.471-0.085,0.629-0.163,1.128-0.365c0.5-0.201,1.069-0.5,1.636-0.654c0.395-0.106,0.361-0.402,0.208-0.491c-0.088-0.051-0.219-0.046-0.321,0.133c-0.244,0.419-1.383,0.661-1.74,0.771c-0.457,0.14-0.962,0.271-1.634,0.243c-1.021-0.042-0.782-0.509-1.513-0.928c-0.213-0.122-0.156-0.444,0.129-0.729c0.148-0.148,0.557-0.232,0.76-0.572c0.028-0.047,0.289-0.32,0.494-0.461c0.07-0.049,0.076-1.295-0.562-1.32c-0.543-0.021-0.697,0.398-0.675,0.818c0.022,0.419,0.245,0.765,0.393,0.764c0.285-0.004,0.019,0.311-0.138,0.361c-0.237,0.078-0.562-0.934-0.525-1.418c0.039-0.506,0.303-1.4,0.942-1.383c0.576,0.016,0.993,0.737,0.973,1.983c-0.003,0.211,0.935-0.101,1.247,0.229c0.224,0.236-0.767-2.207,1.438-2.375c0.582,0.111,1.14,0.305,1.371,1.641c-0.086,0.139,0.146,1.07-0.215,1.182c-0.438,0.135-0.707-0.02-0.453-0.438c0.172-0.418,0.004-1.483-0.882-1.42c-0.887,0.064-0.769,1.637-0.526,1.668c0.243,0.031,0.854,0.465,1.282,0.549c1.401,0.271,0.371,1.075,0.555,2.048c0.205,1.099,0.929,0.809,1.578,3.717c0.137,0.177,0.676,0.345,1.199,2.579c0.473,2.011-0.195,3.473,0.938,3.353c0.256-0.026,0.629-0.1,0.792-0.668c0.425-1.489-0.213-3.263-0.855-4.46c-0.375-0.698-0.729-1.174-0.916-1.337c0.738,0.436,1.683,1.829,1.898,2.862c0.286,1.358,0.49,1.934,0.059,3.37c0.25,0.125,0.871,0.39,0.871,0.685c-0.647-0.53-2.629-0.625-2.68,0.646c-0.338,0.008-0.594,0.034-0.811,0.293c-0.797,0.944-0.059,2.842-0.139,3.859c-0.07,0.896-0.318,1.783-0.46,2.683c-0.474-0.019-0.428-0.364-0.274-0.852c0.135-0.431,0.351-0.968,0.365-1.484c0.012-0.467-0.039-0.759-0.156-0.831c-0.118-0.072-0.303,0.074-0.559,0.485c-0.543,0.875-1.722,1.261-2.821,1.397c-1.099,0.138-2.123,0.028-2.664-0.578c-0.186-0.207-0.492,0.058-0.529,0.111c-0.049,0.074,0.18,0.219,0.352,0.533c0.251,0.461,0.49,1.159-0.105,1.479C12.83,26.314,12.316,26.221,11.791,25.229L11.791,25.229zM11.398,25.188c0.395,0.621,1.783,3.232-0.652,3.571c-0.814,0.114-2.125-0.474-3.396-0.784c-1.142-0.279-2.301-0.444-2.949-0.627c-0.391-0.108-0.554-0.25-0.588-0.414c-0.091-0.434,0.474-1.041,0.503-1.555c0.028-0.514-0.188-0.779-0.364-1.199c-0.177-0.42-0.224-0.734-0.081-0.914c0.109-0.141,0.334-0.199,0.698-0.164c0.462,0.047,1.02-0.049,1.319-0.23c0.505-0.309,0.742-0.939,0.516-1.699c0,0.744-0.244,1.025-0.855,1.366c-0.577,0.319-1.467,0.062-1.875,0.416c-0.492,0.427,0.175,1.528,0.12,2.338c-0.042,0.622-0.69,1.322-0.401,1.946c0.291,0.627,1.648,0.695,3.064,0.99c2.012,0.422,3.184,1.153,4.113,1.188c1.356,0.05,1.564-1.342,3.693-1.36c0.621-0.033,1.229-0.052,1.835-0.06c0.688-0.009,1.375-0.003,2.079,0.014c1.417,0.034,0.931,0.773,1.851,1.246c0.774,0.397,2.17,0.241,2.504-0.077c0.451-0.431,1.662-1.467,2.592-1.935c1.156-0.583,3.876-1.588,1.902-2.812c-0.461-0.285-1.547-0.588-1.639-2.676c-0.412,0.366-0.365,2.312,0.784,2.697c1.283,0.431,2.085,1.152-0.301,1.969c-1.58,0.54-1.849,0.706-3.099,1.747c-1.267,1.054-3.145,0.636-2.815-1.582c0.171-1.155,0.269-2.11-0.019-3.114c-0.142-0.49-0.211-1.119-0.114-1.562c0.187-0.858,0.651-1.117,1.106-0.293c0.285,0.519,0.385,1.122,1.408,1.171c1.607,0.077,1.926-1.553,2.439-1.627c0.343-0.05,0.686-1.02,0.425-2.589c-0.28-1.681-1.269-4.332-2.536-5.677c-1.053-1.118-1.717-2.098-2.135-3.497c-0.352-1.175-0.547-2.318-0.475-3.412c0.094-1.417-0.691-3.389-1.943-4.316c-0.782-0.581-2.011-0.893-3.122-0.88c-0.623,0.007-1.21,0.099-1.661,0.343c-1.855,1.008-2.113,2.445-2.086,4.088c0.025,1.543,0.078,3.303,0.254,4.977c-0.208,0.77-1.288,2.227-1.979,3.114C8.59,14.233,8.121,16.01,7.52,17.561c-0.321,0.828-0.862,1.2-0.908,2.265C6.6,20.122,6.61,20.891,6.894,20.672C7.98,19.829,9.343,21.95,11.398,25.188L11.398,25.188zM17.044,2.953c-0.06,0.176-0.3,0.321-0.146,0.443c0.152,0.123,0.24-0.171,0.549-0.281c0.08-0.028,0.449,0.012,0.519-0.164c0.03-0.077-0.19-0.164-0.321-0.291c-0.133-0.125-0.262-0.236-0.386-0.229C16.938,2.451,17.096,2.798,17.044,2.953L17.044,2.953zM18.934,9.35c0.115-0.121,0.174,0.207,0.483,0.402c0.244,0.154,0.481,0.04,0.545,0.354c0.044,0.225-0.097,0.467-0.284,0.436C19.35,10.486,18.596,9.705,18.934,9.35L18.934,9.35zM13.832,7.375c-0.508-0.037-0.543,0.33-0.375,0.324C13.629,7.693,13.523,7.408,13.832,7.375L13.832,7.375zM12.96,6.436c0.06-0.013,0.146,0.09,0.119,0.233c-0.037,0.199-0.021,0.324,0.117,0.325c0.022,0,0.048-0.005,0.056-0.057c0.066-0.396-0.14-0.688-0.225-0.711C12.834,6.178,12.857,6.458,12.96,6.436L12.96,6.436zM16.663,6.268c0.129,0.039,0.253,0.262,0.28,0.504c0.002,0.021,0.168-0.035,0.17-0.088c0.011-0.389-0.321-0.571-0.408-0.562C16.506,6.139,16.562,6.238,16.663,6.268L16.663,6.268zM14.765,7.423c0.463-0.214,0.625,0.118,0.465,0.171C15.066,7.648,15.065,7.345,14.765,7.423L14.765,7.423zM9.178,15.304c-0.219-0.026,0.063-0.19,0.184-0.397c0.131-0.227,0.105-0.511,0.244-0.469s0.061,0.2-0.033,0.461C9.491,15.121,9.258,15.313,9.178,15.304L9.178,15.304z",
		 "Nocharge" : "M27.271,13.501h-1.104v-1.417c0-0.553-0.447-1-1-1H5.25c-0.552,0-1,0.447-1,1v7.832c0,0.553,0.448,1,1,1h19.917c0.553,0,1-0.447,1-1v-1.417h1.104c0.265,0,0.479-0.447,0.479-1v-2.998C27.75,13.948,27.536,13.501,27.271,13.501zM24.167,18.916H6.25v-5.832h17.917V18.916zM9.167,14.084H7.25v3.832h1.917V14.084z",
		 "Fullcharge" : "M27.271,13.501h-1.104v-1.417c0-0.553-0.447-1-1-1H5.25c-0.552,0-1,0.447-1,1v7.832c0,0.553,0.448,1,1,1h19.917c0.553,0,1-0.447,1-1v-1.417h1.104c0.265,0,0.479-0.447,0.479-1v-2.998C27.75,13.948,27.536,13.501,27.271,13.501zM24.167,18.916H6.25v-5.832h17.917V18.916zM23.167,14.084H7.25v3.832h15.917V14.084z",
		 "Groupcallout" : "M15.985,5.972c-7.563,0-13.695,4.077-13.695,9.106c0,2.877,2.013,5.44,5.147,7.108c-0.446,1.479-1.336,3.117-3.056,4.566c0,0,4.015-0.266,6.851-3.143c0.163,0.04,0.332,0.07,0.497,0.107c-0.155-0.462-0.246-0.943-0.246-1.443c0-3.393,3.776-6.05,8.599-6.05c3.464,0,6.379,1.376,7.751,3.406c1.168-1.34,1.847-2.892,1.847-4.552C29.68,10.049,23.548,5.972,15.985,5.972zM27.68,22.274c0-2.79-3.401-5.053-7.599-5.053c-4.196,0-7.599,2.263-7.599,5.053c0,2.791,3.403,5.053,7.599,5.053c0.929,0,1.814-0.116,2.637-0.319c1.573,1.597,3.801,1.744,3.801,1.744c-0.954-0.804-1.447-1.713-1.695-2.534C26.562,25.293,27.68,23.871,27.68,22.274z",

		 "Dog" : "M2.933,379.802c0,0-24.432,98.829,67.741,98.829c92.163,0,102.156-34.426,102.156-34.426s23.323,25.542,38.862,28.869 c15.549,3.328,154.348,1.109,154.348,1.109s25.542-35.534-54.41-41.09c0,0,24.432-38.862,15.548-66.632l19.986-3.327 c0,0,33.315,88.836,55.52,108.821l45.527,1.109c0,0,14.439-6.665-22.214-34.426c-36.644-27.76-28.869-117.704-22.214-146.573 c6.665-28.869,7.774-98.829-2.218-132.145c-9.993-33.315,0-5.556,0-5.556s63.294,15.548,75.505-23.323 c0,0,15.549-6.665,12.212-21.095c0,0-49.974-22.204-58.857-26.65c0,0-6.665-19.852-25.819-26.928c0,0,6.522-27.626-1.94-31.929 c0,0-29.979,18.876-32.207,24.432c0,0-2.219-32.207-7.774-37.752c0,0-37.752,24.432-35.534,58.857 c0,0-53.301,79.952-46.636,133.253c0,0-179.89,66.622-135.472,205.432C145.069,408.671,76.22,439.769,2.933,379.802z",
		 "Deer" : "M458.609,24.264c-1.122-3.578-3.089-6.467-7.259-7.531c3.941,7.217,1.995,14.084-1.272,20.383 	c-3.48,6.704-5.684,8.454-12.64,6.81c8.438-16.52,6.051-31.297-7.724-43.925c-0.412,1.579-0.416,3.121-0.045,4.565 	c0.71,2.758,1.673,5.451,2.456,8.193c1.607,5.618,1.191,11.049-1.693,16.198c-2.566,4.573-6.483,5.267-10.424,1.856 	c-1.963-1.697-3.722-3.697-5.867-5.104c-7.707-5.042-15.116-10.4-21.127-17.482c-0.722-0.853-1.709-1.485-2.574-2.216 	c-0.375,0.233-0.751,0.465-1.126,0.698c1.84,4.717,3.681,9.437,5.59,14.337c-1.534-0.351-2.856-0.653-4.174-0.951 	c0.216,1.661,0.815,2.697,1.64,3.497c2.399,2.333,4.803,4.676,7.356,6.838c9.14,7.748,15.398,17.185,16.769,29.291 	c0.543,4.77,0.625,9.641,0.396,14.439c-0.192,4.027-0.277,8.413-1.905,11.955c-5.276,11.464-11.225,22.619-16.965,33.868 	c-0.384,0.755-1.171,1.302-2.514,2.738c0-8.254,0.44-15.438-0.122-22.546c-0.56-7.059-1.551-14.199-5.459-20.441 	c-0.44,0.938-0.494,1.787-0.519,2.636c-0.294,10.155-0.139,20.347-0.987,30.457c-0.935,11.122-3.77,21.75-12.439,29.784 	c-5.618,5.202-11.191,10.453-16.903,15.545c-0.73,0.653-2.175,0.502-3.289,0.726c-0.094-1.036-0.403-2.109-0.245-3.109 	c0.735-4.643,1.906-9.233,2.351-13.9c0.894-9.368,1.424-18.772,2.064-28.16c0.041-0.612-0.245-1.245-0.592-2.856 	c-3.737,8.144-6.602,15.529-7.401,23.473c-1.048,10.379-3.104,20.298-9.363,29.009c-1.163,1.615-1.366,4.076-1.566,6.185 	c-0.302,3.17-1.669,5.235-4.631,6.524c-7.16,3.113-14.436,3.778-22.126,2.293c-3.565-0.689-6.173-1.942-8.062-5.108 	c-2.636-4.415-5.075-9.11-8.511-12.848c-4.643-5.055-8.527-10.237-9.698-17.14c-0.289-1.709-0.697-3.407-1.179-5.071 	c-2.183-7.524-4.411-15.035-6.626-22.546c-0.428,0.086-0.853,0.167-1.281,0.253c-0.094,13.228,1.51,26.329,4.158,40.078 	c-2.224-1.742-3.753-2.97-5.312-4.162c-7.932-6.071-14.615-13.064-17.193-23.117c-1.2-4.68-2.493-9.343-3.611-14.043 	c-1.297-5.451-2.452-10.938-3.672-16.406c-4.149,9.233-0.938,18.646-1.518,28.14c-5.34-9.172-11.065-18.209-15.026-27.96 	c-4.945-12.163-6.275-24.807-0.833-37.626c2.615-6.161,6.916-10.71,11.02-15.651c2.171-2.611,3.248-6.128,5.133-9.861 	c-2.317,0-3.37,0-4.639,0c1.509-7.997,3.814-15.667,3.496-23.791c-1.248,0.612-2.003,1.359-2.562,2.232 	c-4.337,6.793-8.609,13.627-12.962,20.408c-3.35,5.218-6.655,10.469-10.225,15.537c-2.518,3.57-5.292,4.333-8.768,2.758 	c1.077-2.04,2.142-4.055,3.203-6.071c-0.253-0.176-0.506-0.355-0.754-0.53c-1.938,1.407-3.876,2.819-6.018,4.377 	c-3.027-4.737-3.843-9.576-3.113-14.569c1.053-7.234,2.526-14.407,3.705-21.624c0.318-1.95,0.221-3.966,0.314-5.949 	c-0.396-0.098-0.792-0.196-1.188-0.294c-0.689,1.061-1.53,2.052-2.048,3.195c-2.722,5.981-5.206,12.077-8.058,17.993 	c-4.745,9.833-3.791,19.151,1.709,28.368c1.126,1.889,1.232,4.357,2.003,6.487c1.362,3.766,2.762,7.528,4.353,11.204 	c2.485,5.737,5.928,11.073,5.472,17.805c-0.841,12.342,2.423,23.464,11.379,32.297c8.095,7.984,16.369,15.81,24.945,23.268 	c9.535,8.295,19.535,16.059,29.253,24.146c2.338,1.946,4.374,4.255,6.544,6.397c-7.226-1.901-13.701-4.79-20.445-6.736 	c-7.111-2.048-12.876-5.521-16.96-11.73c-0.404-0.616-1.334-0.89-2.015-1.322c-0.433,0.808-1.367,1.734-1.212,2.403 	c0.555,2.371,1.041,4.941,2.342,6.916c5.655,8.568,11.387,17.107,17.516,25.337c2.676,3.594,5.904,7.369,9.763,9.311 	c3.064,1.542,6.422,2.313,8.446,5.324c1.392,2.069,2.48,4.341,3.717,6.512c3.011,5.275,3.464,10.506-0.167,15.716 	c-0.347,0.498-0.62,1.093-0.764,1.681c-2.937,12.265-5.813,24.542-8.812,36.79c-0.302,1.232-1.032,2.624-1.999,3.386 	c-4.945,3.917-10.506,6.483-16.916,6.834c-13.979,0.771-27.957,1.612-41.947,2.195c-2.901,0.123-5.842-0.738-8.764-1.175 	c-2.064-0.311-4.194-1.204-6.165-0.926c-8.046,1.13-16.042,2.615-24.06,3.954c-2.787,0.465-5.847,0.298-8.319,1.428 	c-6.148,2.812-12.428,5.639-17.915,9.507c-6.854,4.834-15.908,6.866-20.176,15.157c-0.204,0.399-0.755,0.628-1.15,0.926 	c-7.732,5.761-11.787,13.908-14.031,22.905c-2.485,9.963,1.102,19.854,1.245,29.812c0,0.118,0.069,0.236,0.098,0.358 	c2.954,13.51,6.614,26.912,8.646,40.556c1.808,12.134,1.962,24.533,2.562,36.826c0.518,10.616,0.653,21.253,0.918,31.885 	c0.037,1.478,0.143,3.064-0.306,4.432c-2.917,8.927-5.182,18.196-9.25,26.585c-3.109,6.418-4.533,12.272-3.974,19.417 	c0.616,7.932-0.779,16.006-1.094,24.026c-0.204,5.166-0.037,10.348-0.037,15.524c-1.501,9.271-0.73,13.812,12.672,11.579 	c13.403-2.235,18.617,6.704,16.752-3.725c-1.864-10.429-12.962-15.704-12.962-15.704c-0.657-0.914-1.971-1.93-1.853-2.726 	c0.42-2.786,1.236-5.532,2.089-8.233c2.635-8.364,5.292-16.724,8.074-25.035c1.84-5.499,3.672-11.023,5.94-16.353 	c6.247-14.684,12.705-29.277,19.115-43.896c3.468-7.915,6.169-16.238,12.33-23.411c3.672,5.312,5.716-1.289,8.421-0.673 	c6.022,4.101,3.378,10.444,4.056,15.74c0.722,5.676,0.624,11.596-2.371,17.03c-5.5,9.976-10.474,20.257-16.267,30.053 	c-3.166,5.357-3.142,9.927-0.445,15.337c5.108,10.258,10.486,20.49,14.239,31.257c1.983,5.691,6.145,9.792,8.062,15.324 	c1.069,2.534-3.382,12.383,3.317,10.919c6.703-1.465,22.354,2.582,22.726,0c0.371-2.583-2.607-13.782-10.425-18.997 	c-7.817-5.214-7.67-22.175-7.67-22.175c-2.509-11.375,1.098-20.931,8.38-29.58c4.203-4.989,8.511-10.004,11.901-15.54 	c3.603-5.884,6.177-12.399,9.213-18.634c0.869-1.783,1.824-3.521,2.685-5.308c1.138-2.367,2.868-3.688,5.606-3.37 	c0.245,0.028,0.518,0.085,0.738,0.012c5.851-1.868,11.587-0.396,17.385,0.416c2.896,0.404,5.912-0.073,8.833,0.241 	c1.163,0.126,2.941,1.098,3.211,2.036c4.733,16.65,10.375,33.08,11.44,50.607c0.241,3.93,2.538,7.703,3.59,11.624 	c0.955,3.558-0.384,7.193-0.061,10.849l0.926,10.429c0,0-4.076,20.796-1.346,21.29c2.729,0.497,9.682-1.241,13.901,0.742 	c4.219,1.987,14.022-0.991,14.022-0.991c1.118-6.704-10.359-15.182-10.359-15.182c-0.109-8.389-0.583-16.802,0.062-25.17 	c0.277-3.623,2.387-7.119,2.604-10.738c0.236-3.966-0.478-8.059-1.253-11.999c-1.497-7.638-3.835-15.138-4.872-22.824 	c-0.946-7.033-0.562-14.243-0.913-21.366c-0.151-3.044,0.999-4.908,3.517-6.725c7.226-5.218,22.448-5.561,29.494,1.551 	c1.036,1.049,3.473,0.71,6.096,0.955c0.375,0.032,0.669,0.33,0.718,0.701c2.66,20.498,5.414,41.682,8.193,63.094 	c0.073,0.551,4.394,16.988,2.297,19.273c-1.143,1.244-0.485,4.137-0.294,7.079c0.041,0.616-4.762,10.18,1.195,17.254 	c5.957,7.075,26.063,6.328,26.063,6.328s-0.743-3.721-2.607-11.913c-1.86-8.193-4.777-8.527-4.777-8.527 	c-2.562-4.142-2.281-7.703,0.869-11.049c-0.078-0.612,0.081-1.502-0.254-1.774c-3.435-2.783-2.243-6.324-2.039-9.891 	c0.261-4.545,0-9.127-0.188-13.685c-0.526-12.729-2.027-25.499-1.432-38.176c0.493-10.474,3.651-20.796,5.198-31.253 	c1.044-7.083,1.505-14.272,1.917-21.429c0.29-5.096,1.547-9.53,5.101-13.447c2.398-2.644,4.243-5.879,5.92-9.069 	c1.42-2.701,1.995-5.843,3.374-8.572c4.337-8.589,8.548-17.132,4.912-27.141c-0.081-0.225-0.049-0.493-0.073-0.738 	c-0.938-9.494-1.873-18.988-2.812-28.482c-0.306-3.08-0.983-6.173-0.853-9.233c0.212-5.034,1.457-10.057,1.347-15.067 	c-0.191-8.646-0.103-17.486-1.942-25.847c-2.093-9.486-5.699-18.735-9.526-27.715c-3.876-9.099-8.405-17.989-13.448-26.5 	c-3.378-5.7-3.007-11.224-1.787-17.038c0.294-1.396,1.543-2.754,2.665-3.786c4.858-4.456,10.433-8.25,12.456-15.092 	c0.542-1.84,1.44-3.741,2.681-5.177c4.651-5.402,9.584-10.567,14.264-15.949c1.848-2.126,3.488-4.492,4.839-6.96 	c0.62-1.13,0.306-2.771,0.416-4.178c-1.448,0.184-2.048,0.465-2.33,0.938c-3.108,5.21-7.902,7.871-13.517,9.792 	c-7.002,2.395-13.786,5.41-20.686,8.119c-0.694,0.273-1.498,0.257-3.24,0.531c1.861-2.395,2.954-4.19,4.415-5.61 	c4.79-4.671,9.641-9.29,14.603-13.778c6.801-6.153,13.823-12.069,20.575-18.274c7.197-6.61,14.011-13.644,21.318-20.119 	c11.195-9.922,16.01-22.154,14.006-36.896c-1.199-8.833,2.967-15.455,8.014-21.824c1.991-2.509,4.182-4.917,6.581-7.03 	c1.33-1.171,3.228-2.142,4.957-2.31c3.46-0.33,3.982-1.183,2.57-4.439c-0.641-1.481-0.836-3.521-0.38-5.051 	C458.544,36.476,460.592,30.576,458.609,24.264z",
		 "Dove" : "M349.392,188.25c-2.426-0.821-8.947-3.453-10.738-6.017c-0.285-0.407-0.728-1.284-1.289-2.394  c-3.296-6.524-11.016-21.802-26.605-21.802c-2.451,0-5.021,0.387-7.64,1.151c-14.655,4.276-21.688,13.998-26.822,21.096  c-2.957,4.088-5.293,7.317-7.924,7.822c-0.828,0.159-1.604,0.239-2.308,0.239c-2.51,0-3.916-0.954-4.179-2.836  c-0.988-7.069-0.762-15.884-0.523-25.217c0.395-15.439,0.842-32.938-4.291-46.667c-8.368-22.384-27.05-40.417-42.062-54.906  c-3.751-3.621-7.294-7.041-10.332-10.185c-1.167-1.441-2.38-2.752-3.553-4.021c-1.703-1.841-3.312-3.58-4.486-5.411  c-5.038-7.854-8.567-16.764-11.617-25.18c-0.289-0.921-0.576-1.85-0.86-2.788c-0.456-1.503-0.958-2.649-1.533-3.499  C180.969,3.657,179.012,0,175.992,0c-0.471,0-0.955,0.092-1.436,0.274c-5.193,1.964-6.333,12.733-7.34,22.235  c-0.517,4.88-1.005,9.49-1.956,11.755c-1.228,2.925-3.132,4.655-5.148,6.485c-2.384,2.165-4.849,4.403-6.003,8.625  c-1.154,4.218,0.002,6.646,1.121,8.993c0.941,1.977,1.831,3.843,1.347,6.955c-0.507,3.266-2.082,5.03-3.749,6.899  c-1.777,1.992-3.616,4.052-3.929,7.821c-0.324,3.892,1.723,6.419,3.703,8.864c1.731,2.137,3.366,4.156,3.326,7.028  c-0.034,2.437-1.478,3.65-3.305,5.186c-2.394,2.011-5.373,4.514-4.396,10.538c0.646,3.98,3.274,6.058,5.593,7.891  c2.23,1.763,3.593,2.946,3.494,4.957c-0.075,1.529-0.546,3.163-1.044,4.892c-1.19,4.128-2.539,8.807,0.952,13.935  c1.258,1.848,5.446,5.553,10.098,9.346c-12.772-5.85-31.741-13.234-51.577-16.347c-32.537-5.105-64.092-17.726-81.045-24.507  c-7.98-3.192-11.569-4.604-12.984-4.604c-0.917,0-1.219,0.563-1.307,0.806c-0.337,0.933,0.472,1.811,2.414,3.424l5.224,4.335  c7.007,5.81,12.506,10.369,14.843,12.663c-1.142-0.406-2.777-1.072-4.896-1.992c-1.119-0.486-2.018-0.294-2.515,0.431  c-0.239,0.349-0.355,0.79-0.355,1.347c0,6.184,17.809,36.595,42.411,65.938c17.756,21.176,51.869,56.702,80.841,56.702  c1.729,0,3.43-0.127,5.085-0.379c-11.521,11.92-53.4,43.329-90.531,58.741c-44.868,18.624-65.123,28.194-66.54,35.67  c-0.322,1.699,0.266,3.287,1.748,4.719c1.973,1.906,3.814,2.793,5.795,2.793c1.398,0,2.681-0.447,3.921-0.879  c1.27-0.442,2.583-0.9,4.069-0.9c1.66,0,3.384,0.581,5.269,1.775c4.705,2.979,10.355,6.159,17.896,6.159  c7.856,0,16.524-3.437,26.5-10.507c1.869-1.324,3.564-1.915,5.499-1.915c1.092,0,2.163,0.182,3.295,0.374  c1.234,0.209,2.511,0.426,3.923,0.426c0,0,0,0,0,0c3.211,0,6.267-1.195,9.614-3.761c24.697-18.93,51.629-22.474,80.144-26.227  c33.636-4.427,68.417-9.004,105.821-37.771c31.833-24.481,38.115-45.503,42.273-59.415c0.438-1.465,0.85-2.846,1.266-4.135  c4.165-12.91,6.607-15.926,9.657-16.975c2.023-0.696,7.031-2.719,11.45-4.503c3.109-1.255,5.795-2.34,6.539-2.596  c1.097-0.377,1.227-1.049,1.207-1.417C352.252,189.776,352.204,188.897,349.392,188.25z",
		 "RightArrow" : "M.640 .512L.256 .192v.192H0v.256h.256v.192L.640 .512z",
		 "LeftArrow" : "M.32 .512l.480 .480v-.288h.512v-.384h-.512v-.288z",
		 "Palette" : "M19.251,5.758c-0.913-3.811-4.858-5.015-9.944-4.235c-5.383,0.824-8.928,4.356-9.218,5.51   C-0.03,7.509-0.157,8.112,0.621,8.921C1.397,9.727,2.695,8.703,3.667,9.71s0.105,1.97-1.126,2.438   c-1.232,0.47-2.904,1.359-1.984,3.494c1.686,3.597,6.892,2.839,12.006,0.672C17.677,14.145,20.164,9.569,19.251,5.758z    M16.133,3.648c0.195-0.093,0.62-0.118,0.944-0.056c0.321,0.063,0.567,0.45,0.545,0.861s-0.262,0.936-0.525,1.166   c-0.268,0.23-0.716,0.162-0.996-0.151c-0.28-0.313-0.47-0.813-0.417-1.109C15.733,4.061,15.937,3.74,16.133,3.648z M3.837,8.362   c-0.351-0.907,0.481-2.071,1.856-2.6c1.375-0.53,2.773-0.225,3.123,0.683c0.351,0.906-0.481,2.07-1.856,2.6   C5.585,9.575,4.187,9.267,3.837,8.362z M8.34,16.18c-0.691,0.201-1.357,0.055-1.48-0.324c-0.124-0.381-0.241-0.912-0.267-1.182   c-0.023-0.271,0.261-0.688,0.631-0.932c0.371-0.24,1.076-0.173,1.566,0.152c0.488,0.324,0.872,0.889,0.849,1.254   C9.615,15.516,9.03,15.981,8.34,16.18z M9.552,4.39C9.103,4.558,7.407,4.479,7.685,3.754c0.021-0.053,0,0,0.105-0.197   C7.894,3.36,7.894,3.36,7.894,3.36c0.15-0.348,0.466-0.649,0.707-0.678c0.24-0.027,0.612,0.033,0.829,0.132   C9.645,2.913,9.945,3.24,10.095,3.54S10.001,4.222,9.552,4.39z M12.957,13.977c-0.319,0.246-0.921,0.285-1.335,0.087   c-0.414-0.2-0.756-0.605-0.763-0.906c-0.004-0.298,0.258-0.628,0.58-0.732c0.324-0.104,0.734-0.18,0.914-0.166   c0.181,0.016,0.521,0.307,0.755,0.646C13.346,13.246,13.276,13.731,12.957,13.977z M13.438,4.229   c-0.15,0.224-0.562,0.349-0.914,0.278c-0.352-0.071-0.682-0.432-0.732-0.801c-0.053-0.37,0.121-0.842,0.384-1.048   c0.265-0.206,0.642-0.266,0.838-0.133c0.194,0.133,0.434,0.479,0.528,0.769C13.636,3.585,13.59,4.006,13.438,4.229z M16.205,12.571   c0,0,0,0-0.165-0.021c-0.165-0.021-0.165-0.021-0.165-0.021c-0.592-0.456-1.06-1.027-1.036-1.273   c0.021-0.246,0.243-0.549,0.491-0.672s0.672-0.104,0.94,0.041c0.271,0.146,0.491,0.559,0.491,0.916   C16.763,11.9,16.511,12.361,16.205,12.571z M17.954,9.069c-0.211,0.35-0.645,0.534-0.958,0.41   c-0.314-0.124-0.494-0.765-0.396-1.423c0.099-0.658,0.393-1.159,0.653-1.112c0.263,0.047,0.615,0.401,0.782,0.787   C18.201,8.117,18.165,8.719,17.954,9.069z",
		 "Brush" : "M11.815,65.812c-7.569,7.44-1.176,15.079-11.235,26.403c-4.54,5.113,18.69,3.554,30.199-7.76 c4.882-4.798,3.505-11.793-1.731-16.941C23.812,62.366,16.696,61.014,11.815,65.812z M95.701,1.293 C91.815-2.524,48.806,31.94,36.002,44.528c-6.354,6.246-8.476,9.595-10.424,12.1c-0.847,1.087,0.272,1.424,0.776,1.681 c2.517,1.281,4.277,2.475,6.553,4.712c2.277,2.237,3.492,3.968,4.795,6.441c0.261,0.496,0.604,1.597,1.708,0.766 c2.55-1.915,5.955-4.001,12.309-10.248C64.524,47.392,99.583,5.111,95.701,1.293z",
		 "OldBuilding" : "M344.046,298.535c0,0-3.254,0-4.338,0c-2.375,0-2.375-2.811-2.375-2.811V99.094c0-4.95-4.051-9-9-9c0,0-52.219,0-69.625,0 	c-2.5,0-2.367-2.37-2.367-2.37V49.818c0-0.375,0.211-0.796,1.455-0.796c2.75,0,5-2.25,5-5v-8.881c0-2.75-2.25-5-5-5H96.13 	c-2.75,0-5,2.25-5,5v8.881c0,2.75,2.25,5,5,5c1.453,0,1.456,1.302,1.456,1.453V86.85c0,0,0.247,3.245-1.878,3.245 	c-18.799,0-75.193,0-75.193,0c-4.95,0-9,4.05-9,9c0,0,0,147.941,0,197.255c0,1.875-1.016,2.186-3.068,2.186 	c-2.654,0-3.447,0-3.447,0c-2.75,0-5,2.25-5,5v10.369c0,2.75,2.25,5,5,5h339.046c2.75,0,5-2.25,5-5v-10.369 	C349.046,300.785,346.796,298.535,344.046,298.535z M196.075,133.209h29.924c2.201,0,4,1.8,4,4v29.925c0,2.2-1.799,4-4,4h-29.924 	c-2.201,0-4-1.8-4-4v-29.925C192.075,135.009,193.874,133.209,196.075,133.209z M192.075,114.647V84.722c0-2.2,1.799-4,4-4h29.924 	c2.201,0,4,1.8,4,4v29.925c0,2.2-1.799,4-4,4h-29.924C193.874,118.647,192.075,116.847,192.075,114.647z M196.075,183.846h29.924 	c2.201,0,4,1.8,4,4v29.925c0,2.2-1.799,4-4,4h-29.924c-2.201,0-4-1.8-4-4v-29.925 	C192.075,185.647,193.874,183.846,196.075,183.846z M200.516,244.008c2.199,0,4,1.8,4,4v46.335c0,2.2-1.801,4-4,4h-46.335 	c-2.199,0-4-1.8-4-4v-46.335c0-2.2,1.801-4,4-4H200.516z M161.903,114.647c0,2.2-1.8,4-4,4h-29.925c-2.2,0-4-1.8-4-4V84.722 	c0-2.2,1.8-4,4-4h29.925c2.2,0,4,1.8,4,4V114.647z M127.978,133.209h29.925c2.2,0,4,1.8,4,4v29.925c0,2.2-1.8,4-4,4h-29.925 	c-2.2,0-4-1.8-4-4v-29.925C123.978,135.009,125.778,133.209,127.978,133.209z M127.978,183.846h29.925c2.2,0,4,1.8,4,4v29.925 	c0,2.2-1.8,4-4,4h-29.925c-2.2,0-4-1.8-4-4v-29.925C123.978,185.647,125.778,183.846,127.978,183.846z M268.122,136.284 	c0-2.2,1.801-4,4-4h29.926c2.199,0,4,1.8,4,4v29.925c0,2.2-1.801,4-4,4h-29.926c-2.199,0-4-1.8-4-4V136.284z M268.122,188.772 	c0-2.2,1.801-4,4-4h29.926c2.199,0,4,1.8,4,4v29.925c0,2.2-1.801,4-4,4h-29.926c-2.199,0-4-1.8-4-4V188.772z M268.122,239.408 	c0-2.2,1.801-4,4-4h29.926c2.199,0,4,1.8,4,4v29.925c0,2.2-1.801,4-4,4h-29.926c-2.199,0-4-1.8-4-4V239.408z M42.8,136.284 	c0-2.2,1.8-4,4-4h29.925c2.2,0,4,1.8,4,4v29.925c0,2.2-1.8,4-4,4H46.8c-2.2,0-4-1.8-4-4V136.284z M42.8,188.772c0-2.2,1.8-4,4-4 	h29.925c2.2,0,4,1.8,4,4v29.925c0,2.2-1.8,4-4,4H46.8c-2.2,0-4-1.8-4-4V188.772z M42.8,239.408c0-2.2,1.8-4,4-4h29.925 	c2.2,0,4,1.8,4,4v29.925c0,2.2-1.8,4-4,4H46.8c-2.2,0-4-1.8-4-4V239.408z",
		 "CityBuilding" : "M23.534,7.782V4.465l0.991,0.187V2.745L12.425,0.198V0.17L0,2.792v1.924l1.444-0.271v26.058l10.933,1.326l1.956-0.269 v-5.809l3.056-0.18v5.619l1.898-0.229v-5.534l2.745-0.159v5.362l1.501-0.181l7.707-0.916V10.438L32,10.536V9.039L23.534,7.782z  M9.796,9.326l1.885-0.222v1.573l-1.885,0.19V9.326z M2.245,10.232l1.588-0.187v1.443l-1.588,0.159V10.232z M3.833,23.819 l-1.588-0.063v-1.417l1.588,0.039V23.819z M3.833,21.323l-1.588-0.021v-1.417l1.588-0.007V21.323z M3.848,18.875l-1.589,0.025 v-1.418l1.589-0.052V18.875z M3.848,16.458l-1.589,0.069V15.11l1.589-0.096V16.458z M3.848,13.92l-1.589,0.115v-1.417l1.589-0.143 V13.92z M3.861,9.072L2.272,9.276V7.859l1.589-0.23V9.072z M3.861,6.733L2.272,6.981V5.564l1.589-0.274V6.733z M4.684,9.905 l1.681-0.198v1.485l-1.681,0.17V9.905z M6.364,23.883l-1.681-0.066v-1.459l1.681,0.041V23.883z M6.364,21.315l-1.681-0.021v-1.457 l1.681-0.008V21.315z M6.379,18.795l-1.682,0.027v-1.459l1.682-0.055V18.795z M6.379,16.309l-1.682,0.073v-1.458l1.682-0.102 V16.309z M6.379,13.694l-1.682,0.123V12.36l1.682-0.151V13.694z M6.394,8.708L4.712,8.924V7.466l1.682-0.245V8.708z M6.394,6.3 L4.712,6.562V5.105l1.682-0.29V6.3z M7.144,9.63l1.777-0.209v1.527l-1.777,0.18V9.63z M8.921,24.002l-1.777-0.073v-1.498 l1.777,0.044V24.002z M8.921,21.358l-1.777-0.021v-1.498l1.777-0.009V21.358z M8.938,18.768L7.16,18.796v-1.498l1.778-0.06V18.768z  M8.938,16.21L7.16,16.288V14.79l1.778-0.107V16.21z M8.938,13.523L7.16,13.651v-1.498l1.778-0.159V13.523z M8.953,8.393 L7.175,8.621V7.123l1.778-0.259V8.393z M8.953,5.917L7.175,6.192V4.694l1.778-0.307V5.917z M11.681,24.122l-1.885-0.077v-1.542 l1.885,0.046V24.122z M11.681,21.399l-1.885-0.021v-1.542l1.885-0.009V21.399z M11.697,18.731l-1.885,0.03v-1.543l1.885-0.062 V18.731z M11.697,16.096l-1.885,0.083v-1.543l1.885-0.113V16.096z M11.697,13.329l-1.885,0.138v-1.543l1.885-0.169V13.329z  M11.714,8.044L9.829,8.287V6.744l1.885-0.273V8.044z M11.714,5.495L9.829,5.788V4.245l1.885-0.324V5.495z M21.137,7.537 l1.573,0.229V9.25l-1.573-0.202V7.537z M21.137,12.468l1.573,0.141v1.484l-1.573-0.113V12.468z M18.727,7.149l1.662,0.243v1.525 l-1.662-0.215V7.149z M18.727,12.218l1.662,0.148v1.525l-1.662-0.12V12.218z M16.229,6.78l1.756,0.257v1.567l-1.756-0.227V6.78z  M16.229,11.989l1.756,0.158v1.566l-1.756-0.127V11.989z M13.396,6.345l1.864,0.273v1.615l-1.864-0.241V6.345z M15.293,9.287v1.613 l-1.863-0.188V9.066L15.293,9.287z M13.396,11.715l1.864,0.168v1.614l-1.864-0.136V11.715z M15.248,24.084l-1.865,0.076v-1.647 l1.865-0.044V24.084z M15.275,21.442l-1.864,0.023v-1.646l1.864,0.009V21.442z M15.276,18.737l-1.864-0.029v-1.646l1.864,0.063 V18.737z M15.309,16.171l-1.862-0.082v-1.646l1.862,0.114V16.171z M15.325,5.675l-1.861-0.292V3.737l1.861,0.324V5.675z  M17.939,23.985l-1.756,0.072V22.46l1.756-0.043V23.985z M17.967,21.425l-1.756,0.022V19.85l1.756,0.008V21.425z M17.967,18.8 l-1.756-0.028v-1.598l1.756,0.059V18.8z M17.999,16.276L16.244,16.2v-1.598l1.755,0.108V16.276z M18.014,11.192l-1.754-0.176V9.42 l1.754,0.206V11.192z M18.014,6.085L16.26,5.811V4.212l1.754,0.306V6.085z M20.295,23.889l-1.666,0.068v-1.557l1.666-0.039V23.889z  M20.374,21.397l-1.664,0.022v-1.556l1.664,0.008V21.397z M20.374,18.842l-1.662-0.025v-1.556l1.662,0.056V18.842z M20.402,16.386 l-1.66-0.073v-1.554l1.66,0.102V16.386z M20.418,11.438l-1.662-0.167V9.717l1.662,0.196V11.438z M20.418,6.466l-1.662-0.261V4.651 l1.662,0.289V6.466z M22.686,23.809l-1.576,0.064V22.36l1.576-0.037V23.809z M22.695,21.399l-1.574,0.021v-1.514l1.574,0.007 V21.399z M22.697,18.913l-1.575-0.024v-1.513l1.575,0.052V18.913z M22.723,16.522l-1.572-0.068v-1.512l1.572,0.096V16.522z  M22.738,11.705l-1.573-0.158v-1.512l1.573,0.185V11.705z M22.738,6.863l-1.573-0.247V5.105l1.573,0.274V6.863z M29.048,13.188 l1.308,0.13v1.353l-1.308-0.107V13.188z M27.096,12.988l1.37,0.137v1.387l-1.37-0.112V12.988z M24.922,10.421l1.445,0.186v1.423 l-1.445-0.16V10.421z M24.896,12.751l1.444,0.146v1.423l-1.444-0.119V12.751z M26.333,23.653l-1.446,0.045V22.25l1.446-0.021 V23.653z M26.354,21.323l-1.444,0.006v-1.449l1.444,0.021V21.323z M26.354,18.94l-1.444-0.037v-1.448l1.444,0.063V18.94z  M26.379,16.678L24.936,16.6v-1.448l1.443,0.103V16.678z M28.432,23.6l-1.373,0.043v-1.41l1.373-0.021V23.6z M28.454,21.334 l-1.371,0.005v-1.411l1.371,0.02V21.334z M28.454,19.012l-1.371-0.035v-1.41l1.371,0.06V19.012z M28.479,16.78l-1.371-0.074v-1.41 l1.371,0.098V16.78z M28.491,12.281l-1.37-0.151v-1.41l1.37,0.175V12.281z M30.282,23.542l-1.31,0.04v-1.377l1.31-0.02V23.542z  M30.342,21.332l-1.307,0.005v-1.377l1.307,0.02V21.332z M30.343,19.065l-1.307-0.033v-1.377l1.307,0.057V19.065z M30.366,16.884 l-1.306-0.069v-1.376l1.306,0.093V16.884z M30.378,12.493l-1.306-0.145v-1.377l1.306,0.167V12.493z",
		 "Trend" : "M512,480v32H0V0h32v480H512z M228.906,177.719l130.719,32.656L404.875,135l41,24.625L448,32L336.406,93.938l41,24.625 l-33.031,55.063l-125.281-31.344L84.688,276.688l22.625,22.625L228.906,177.719z M192,448h64V217.469l-17.281-4.312L192,259.875 V448z M96,333.25V448h64V291.875l-52.688,52.688L96,333.25z M384,232v216h64V198.219l-32.156-19.281L384,232z M352,448V241.469 l-64-16V448H352z",
		 "Briefcase" : "M124.835,209.569v14.836H338.19v-14.836h55.23v14.836h36.422c24.092,0,44.153-17.439,48.314-40.347V96.44H318.773V57.902 	c0-5.01-4.066-9.079-9.079-9.079H169.479c-5.013,0-9.079,4.069-9.079,9.079V96.44H0v95.438 	c6.833,18.938,24.932,32.532,46.198,32.532h23.407v-14.836L124.835,209.569L124.835,209.569z M178.559,66.975h122.057v29.459 	H178.559V66.975z M393.421,274.638V236.51h36.422c19.636,0,37.096-9.327,48.314-23.74v216.564H0V215.35 	c11.239,12.933,27.763,21.16,46.198,21.16h23.407v38.128h55.23V236.51H338.19v38.128H393.421z",
		 "ShoppingCart" : "M19.006,2.97c-0.191-0.219-0.466-0.345-0.756-0.345H4.431L4.236,1.461 		C4.156,0.979,3.739,0.625,3.25,0.625H1c-0.553,0-1,0.447-1,1s0.447,1,1,1h1.403l1.86,11.164c0.008,0.045,0.031,0.082,0.045,0.124 		c0.016,0.053,0.029,0.103,0.054,0.151c0.032,0.066,0.075,0.122,0.12,0.179c0.031,0.039,0.059,0.078,0.095,0.112 		c0.058,0.054,0.125,0.092,0.193,0.13c0.038,0.021,0.071,0.049,0.112,0.065c0.116,0.047,0.238,0.075,0.367,0.075 		c0.001,0,11.001,0,11.001,0c0.553,0,1-0.447,1-1s-0.447-1-1-1H6.097l-0.166-1H17.25c0.498,0,0.92-0.366,0.99-0.858l1-7 		C19.281,3.479,19.195,3.188,19.006,2.97z M17.097,4.625l-0.285,2H13.25v-2H17.097z M12.25,4.625v2h-3v-2H12.25z M12.25,7.625v2 		h-3v-2H12.25z M8.25,4.625v2h-3c-0.053,0-0.101,0.015-0.148,0.03l-0.338-2.03H8.25z M5.264,7.625H8.25v2H5.597L5.264,7.625z 		 M13.25,9.625v-2h3.418l-0.285,2H13.25z",
		 "ShoppingBag" : "M18.209,5.668h-2.312v-0.14C15.896,2.482,13.417,0,10.368,0C7.318,0,4.84,2.482,4.84,5.528v0.14 	H2.528l-1.352,15.07h18.385L18.209,5.668L18.209,5.668z M10.368,0.678c2.015,0,3.748,1.239,4.479,2.992 	c-0.967-1.447-2.61-2.403-4.479-2.403c-1.866,0-3.512,0.956-4.48,2.406C6.623,1.917,8.355,0.678,10.368,0.678z M5.864,5.668 	c0.451-2.074,2.301-3.632,4.506-3.632c2.209,0,4.055,1.558,4.506,3.632H5.864z",
		 "Pause" : "M25.5,357h102V0h-102V357z M229.5,0v357h102V0H229.5z",
		 "Play" : "M61.792,2.588C64.771,0.864,68.105,0,71.444,0c3.33,0,6.663,0.864,9.655,2.588l230.116,167.2 	c5.963,3.445,9.656,9.823,9.656,16.719c0,6.895-3.683,13.272-9.656,16.713L81.099,370.427c-5.972,3.441-13.334,3.441-19.302,0 	c-5.973-3.453-9.66-9.833-9.66-16.724V19.305C52.137,12.413,55.818,6.036,61.792,2.588z",
		 "College" : "M23.458,16.267l-0.712-4.11l-8.713,5.195l-8.545-5.196l-0.71,4.436 c0.003-0.006,0.01-0.012,0.017-0.019c-0.102,0.17-0.158,0.345-0.158,0.524c0,1.567,6.577,6.393,8.768,6.393 c2.193,0,10.196-4.825,10.196-6.393C23.601,16.929,23.545,16.764,23.458,16.267z M14.101,16.434L0.711,8.32l13.427-4.282 L27.529,8.26L14.101,16.434z M0.803,9.038L0,17.929l0.803,2.666l0.744-2.666L0.803,9.038z",
		 "Book" : "M48.336,7.54c-0.701,0-1.359,0.007-2.018,0.024V5.326h-0.734c-14.262,0-19.043,3.411-20.585,5.252 c-1.542-1.841-6.323-5.252-20.585-5.252H3.68v2.237C3.022,7.545,2.364,7.54,1.664,7.54H0V39.89h1.664 c17.595,0,21.186,4.035,21.698,4.784h3.302c0.557-0.784,4.218-4.784,21.673-4.784H50V7.54H48.336z M23.899,38.431 c-2.457-1.812-7.611-3.914-18.383-4.054V7.175c15.087,0.194,18.001,4.327,18.383,5V38.431z M44.484,34.377 c-10.772,0.14-15.926,2.24-18.383,4.054V12.184c0.416-0.737,3.412-4.814,18.383-5.007V34.377z",
		 "Dress" : "M372.525,444.712c6.296-4.845,11.629-5.326,17.925-5.326c6.292,0,9.69-3.398,9.69-10.175 	c0-6.784,11.621-0.489,7.742-9.689c-3.879-9.201-17.433-35.358-25.183-58.128c-7.742-22.763-18.883-67.325-28.092-89.113 	c-9.197-21.797-60.54-111.4-68.283-131.263c-7.75-19.861,10.348-55.697,10.348-55.697s6.043-33.781,7.137-37.964 	c0.401-1.533-0.941-3.212-2.781-4.733c2.325-1.477,3.964-3.955,3.964-6.909c0-1.194-0.276-2.318-0.722-3.338 	c1.006-1.373,1.72-2.982,1.72-4.817c0-0.024-0.017-0.05-0.017-0.074c6.532-0.344,4.164-2.871,12.916-7.918 	c9.445-5.452,0.729-3.998,1.459-9.806c0.729-5.811-3.267-6.538-5.811-9.085c-2.545-2.541-5.45,2.907-5.45,2.907 	c-14.888-0.733-2.541,11.257-9.807,10.195c-3.41-0.501-4.348,2.53-3.559,5.856c-3.635,0.92-6.371,4.046-6.371,7.939 	c0,1.192,0.276,2.316,0.721,3.336c-1.002,1.37-1.715,2.981-1.715,4.821c0,0.062,0.027,0.108,0.027,0.172 	c-1.915-0.165-3.915,0.617-4.98,4.144c0,0-5.566-3.557-7.995,2.817c0,0-7.991-0.399-9.201,6.628c0,0-22.024-0.457-26.633,5.769 	c-4.606-6.226-26.637-5.769-26.637-5.769c-1.206-7.027-9.199-6.628-9.199-6.628c-2.426-6.382-7.993-2.817-7.993-2.817 	c-1.068-3.526-3.07-4.3-4.981-4.144c0-0.064,0.03-0.11,0.03-0.172c0-1.839-0.717-3.442-1.721-4.821 	c0.457-1.028,0.724-2.144,0.724-3.336c0-3.893-2.747-7.019-6.366-7.922c0.793-3.329-0.142-6.36-3.559-5.853 	c-7.259,1.066,5.087-10.92-9.804-10.201c0,0-2.905-5.446-5.448-2.905c-2.545,2.545-6.538,3.266-5.811,9.085 	c0.733,5.807-7.991,4.358,1.453,9.804c8.756,5.049,6.398,7.576,12.922,7.92c0,0.022-0.014,0.05-0.014,0.072 	c0,1.83,0.711,3.438,1.717,4.819c-0.453,1.03-0.721,2.142-0.721,3.338c0,2.952,1.633,5.432,3.963,6.909 	c-1.843,1.521-3.186,3.2-2.787,4.733c1.1,4.173,7.137,37.964,7.137,37.964s18.105,35.844,10.353,55.699 	c-7.746,19.861-59.087,109.465-68.286,131.261c-9.205,21.789-20.344,66.359-28.09,89.113 	c-7.747,22.771-21.313,48.919-25.185,58.128c-3.879,9.197,7.747,2.905,7.747,9.69c0,6.776,3.394,10.17,9.691,10.17 	c6.294,0,11.626,0.485,17.919,5.33c6.298,4.846,12.106,9.201,19.865,7.751c7.747-1.455,37.295,6.776,39.712,12.587 	c2.418,5.811,26.635,20.27,37.776,11.141c9.706-7.95,30.412-10.135,35.602-10.563c5.189,0.429,25.896,2.613,35.602,10.563 	c11.141,9.129,35.357-5.33,37.774-11.141c2.412-5.811,31.967-14.042,39.718-12.587 	C360.419,453.921,366.229,449.557,372.525,444.712z M296.521,21.85c1.311,2.787,3.759,5.202,7.069,5.558 	c0,0.054,0.04,0.101,0.04,0.165c0,1.012-0.317,1.914-0.77,2.753c-1.519-1.75-3.695-2.91-6.191-2.91 	c-1.764,0-3.314,0.675-4.665,1.625c-0.12-0.479-0.297-0.944-0.297-1.46C291.707,24.691,293.799,22.399,296.521,21.85z 	 M301.321,32.165c-1.03,0.81-2.248,1.365-3.659,1.365c-1.923,0-3.555-0.974-4.645-2.392c1.019-0.812,2.244-1.369,3.651-1.369 	C298.584,29.769,300.224,30.743,301.321,32.165z M291.467,32.981c1.527,1.753,3.703,2.913,6.195,2.913 	c1.771,0,3.314-0.677,4.669-1.625c0.124,0.479,0.301,0.94,0.301,1.461c0,2.438-1.487,4.528-3.587,5.448 	c-2.869-1.917-5.951-3.312-5.951-3.312s-0.926-0.733-2.216-1.31c-0.044-0.285-0.168-0.529-0.168-0.818 	C290.71,34.714,291.026,33.814,291.467,32.981z M175.522,27.573c0-0.058,0.034-0.11,0.034-0.165 	c3.306-0.364,5.763-2.771,7.073-5.558c2.713,0.549,4.811,2.841,4.811,5.723c0,0.519-0.172,0.982-0.299,1.46 	c-1.351-0.941-2.896-1.625-4.663-1.625c-2.495,0-4.672,1.163-6.193,2.91C175.845,29.486,175.522,28.585,175.522,27.573z 	 M186.13,31.138c-1.09,1.418-2.723,2.392-4.646,2.392c-1.399,0-2.629-0.555-3.653-1.365c1.092-1.422,2.725-2.396,4.648-2.396 	C183.884,29.769,185.118,30.326,186.13,31.138z M188.271,36.556c-1.288,0.585-2.22,1.31-2.22,1.31s-3.078,1.395-5.945,3.312 	c-2.1-0.919-3.586-3.009-3.586-5.448c0-0.521,0.176-0.982,0.298-1.461c1.353,0.94,2.897,1.625,4.665,1.625 	c2.494,0,4.668-1.16,6.195-2.913c0.443,0.833,0.757,1.745,0.757,2.757C188.436,36.019,188.314,36.271,188.271,36.556z",
		 "TShirt" : "M531.051,158.403c-19.09-31.777-60.282-44.864-60.282-44.864L376.615,90 c0,0-23.539,47.077-70.615,47.077S235.385,90,235.385,90l-94.154,23.538c0,0-41.192,13.087-60.282,44.864 c-30.506,50.82-79.96,122.306-79.96,122.306l88.505,53.997l51.738-77.159V702h329.538V375.239V257.547l51.738,77.159l88.481-53.997 C610.988,280.709,561.534,209.222,531.051,158.403z",
		 "Plate":"M242.001,0.002C108.348,0.002,0,108.348,0,242.002C0,375.652,108.348,484,242.001,484    c133.651,0,242.001-108.348,242.001-241.998C484.002,108.348,375.652,0.002,242.001,0.002z M301.397,283.492    c6.827,6.834,76.396,77.439,76.396,77.439l-0.096,0.037c0.096,0.062,0.186,0.1,0.263,0.195c6.466,6.408,6.466,16.842,0,23.22    c-6.368,6.419-16.843,6.419-23.22,0c-0.086-0.038-0.175-0.135-0.175-0.224h-0.1c0,0-78.934-78.942-86.772-86.812    c-1.27-1.275-7.725-7.732-17.395-17.418c-18.455,18.441-108.031,107.995-108.031,107.995l-0.02-0.02    c-0.061,0.06-0.089,0.166-0.189,0.262c-6.368,6.37-16.754,6.37-23.138-0.019c-6.378-6.389-6.402-16.744-0.008-23.143    c0.09-0.098,0.188-0.125,0.271-0.203l-0.016-0.021c0,0,89.464-89.464,108.022-108.043    C174.3,203.748,88.702,117.908,88.702,117.908l3.804-3.851c0,0,48.005-13.32,175.303,111.213    c6.514-8.768,11.536-20.295,12.482-35.828c-1.348-12.238,2.682-24.957,12.055-34.318c0.858-0.867,3.336-2.955,3.336-2.955    l68.283-53.197l6.221,6.224l-74.096,69.51l8.035,8.026l71.795-71.773l6.604,6.583l-71.787,71.793l6.789,6.788l71.772-71.784    l5.998,5.957l-71.354,71.355l8.181,8.202l69.327-73.394l6.809,6.826l-56.668,71.424c0,0-1.356,1.375-1.931,1.882    c-8.241,7.207-18.598,10.609-28.858,10.329c-0.059,0-0.176,0.008-0.214,0.029c-22.684,0.232-38.044,11.856-48.604,23.958    C272.415,271.359,297.167,282.251,301.397,283.492z",
		 "Bread" : "M39.645,15.841c-0.014-0.008-0.025-0.017-0.038-0.025c-0.29-0.191-0.664-0.202-0.964-0.026 		c-0.301,0.176-0.475,0.507-0.447,0.854c0.21,2.857-0.008,5.423-0.225,7.063c-0.021,0.151-0.147,0.265-0.301,0.271 		c-0.152,0.005-0.285-0.103-0.316-0.251c-0.871-4.412-2.584-8.213-3.656-10.305c-0.116-0.226-0.32-0.393-0.564-0.462 		c-2.828-0.793-5.451-1.07-7.082-1.158c-0.287-0.016-0.564,0.105-0.75,0.327c-0.184,0.221-0.252,0.517-0.186,0.797 		c0.995,4.145,0.73,8.72,0.49,11.043c-0.016,0.149-0.135,0.267-0.283,0.279c-0.148,0.014-0.286-0.081-0.327-0.224 		c-0.784-2.719-2.561-8.494-4.32-11.5c-0.179-0.306-0.52-0.481-0.872-0.448c-2.388,0.223-4.684,0.566-6.73,1.493 		c-0.001,0-0.001,0-0.002,0c-0.405,0-0.646,0.435-0.579,0.863c0.596,3.762,0.32,7.263,0.045,9.34 		c-0.021,0.151-0.146,0.232-0.3,0.237c-0.152,0.005-0.286-0.117-0.316-0.268c-0.563-2.852-1.48-5.458-2.348-7.506 		c-0.126-0.298-0.374-0.531-0.682-0.633c-0.307-0.103-0.643-0.07-0.923,0.093C2.459,18.895,0,22.635,0,26.454 		c0,8.124,10.598,9.087,23.671,9.087c13.073,0,23.67-0.963,23.67-9.087C47.344,22.953,45.159,19.508,39.645,15.841z",
		 "ThmbsUp" : "M199.595,25c9.365,0.001,18.973,6.367,21.828,21.159c10.263,53.176-14.648,92.984-14.648,92.984h53.946 				c15.896,0,29.773,12.879,29.773,28.771c0,15.885-10.836,28.771-21.199,28.771c2.55,4.299,4.038,9.291,4.038,14.646 				c0,12.208-7.611,22.619-18.353,26.799c2.863,4.477,4.546,9.771,4.546,15.477c0,14.063-10.086,25.75-23.412,28.262 				c2.434,4.224,3.847,9.109,3.847,14.33c0,15.885-12.884,28.771-28.772,28.771L180.662,325 				c-90.319,0-73.312-31.335-121.159-31.335V174.969c30.568,0,57.156-1.621,83.819-43.766 				c18.678-29.521,30.692-48.09,35.718-88.036C180.467,31.817,189.902,25,199.595,25 M199.597,0L199.597,0 				c-10.726,0-21.16,3.771-29.381,10.619c-8.845,7.369-14.52,17.82-15.981,29.428c-4.265,33.898-13.875,49.086-31.322,76.656 				l-0.717,1.133c-20.329,32.133-36.275,32.133-62.693,32.133c-13.807,0-25,11.193-25,25v118.696c0,13.808,11.193,25,25,25 				c12.812,0,16.722,2.515,25.291,8.024c7.315,4.703,17.334,11.146,33.014,15.887c16.52,4.996,37.08,7.424,62.854,7.424 				l30.551-0.028c29.627,0,53.749-24.122,53.749-53.771c0-0.366-0.004-0.732-0.011-1.1c12.055-9.947,19.577-24.98,19.577-41.492 				c0-1.996-0.111-3.981-0.331-5.95c1.61-1.759,3.11-3.632,4.492-5.608c6.311-9.044,9.646-19.665,9.646-30.716 				c0-0.644-0.012-1.283-0.035-1.924c10.421-9.954,17.196-25,17.196-41.495c0-14.528-5.919-28.177-16.668-38.433 				c-10.367-9.892-23.899-15.339-38.105-15.339h-17.255c6.225-23.892,7.101-48.911,2.504-72.722 				c-2.387-12.365-8.109-22.808-16.551-30.198C221.155,3.986,210.562,0.001,199.597,0L199.597,0z",
		 "Hand" : "M228.205,8.949c-9.885,0-17.898,8.014-17.898,17.899v62.644 	c0-9.885-8.014-17.898-17.898-17.898c-9.886,0-17.898,8.013-17.898,17.898c0-9.885-8.015-17.898-17.899-17.898 	s-17.898,8.013-17.898,17.898V17.898C138.713,8.014,130.699,0,120.814,0c-9.884,0-17.898,8.014-17.898,17.898v125.289 	c0,0-32.853-35.797-53.696-35.797c-15.321-0.002-17.898,6.638-17.898,17.898c0,8.831,12.244,12.067,31.165,40.845 	c10.941,16.642,7.449,24.728,24.584,40.846c3.015,2.842,7.993,6.664,14.119,10.39c0.327,0.304,0.778,0.594,1.42,0.869 	c0.763,0.332,1.283,0.732,1.99,1.077c1.107,0.62,2.197,1.228,3.356,1.821c12.129,8.299,12.858,31.766,12.858,38.389 	c0,13.403,4.235,17.899,17.55,17.899h71.943c12.756,0,17.898-5.335,17.898-17.899v-26.847c0-14.47,17.898-55.512,17.898-98.441 	V26.848C246.103,16.962,238.09,8.949,228.205,8.949z",
		 "Add" : "M255,0C114.75,0,0,114.75,0,255s114.75,255,255,255s255-114.75,255-255S395.25,0,255,0z M382.5,280.5h-102v102h-51v-102 		h-102v-51h102v-102h51v102h102V280.5z",
		 "Settings" : "M863.24,382.771l-88.759-14.807c-6.451-26.374-15.857-51.585-28.107-75.099l56.821-70.452 	c12.085-14.889,11.536-36.312-1.205-50.682l-35.301-39.729c-12.796-14.355-34.016-17.391-50.202-7.165l-75.906,47.716 	c-33.386-23.326-71.204-40.551-112-50.546l-14.85-89.235c-3.116-18.895-19.467-32.759-38.661-32.759h-53.198 	c-19.155,0-35.561,13.864-38.608,32.759l-14.931,89.263c-33.729,8.258-65.353,21.588-94.213,39.144l-72.188-51.518 	c-15.558-11.115-36.927-9.377-50.504,4.171l-37.583,37.61c-13.548,13.577-15.286,34.946-4.142,50.504l51.638,72.326 	c-17.391,28.642-30.584,60.086-38.841,93.515l-89.743,14.985C13.891,385.888,0,402.24,0,421.435v53.156 	c0,19.193,13.891,35.547,32.757,38.663l89.743,14.985c6.781,27.508,16.625,53.784,29.709,78.147L95.647,676.44 	c-12.044,14.875-11.538,36.312,1.203,50.669l35.274,39.73c12.797,14.382,34.028,17.363,50.216,7.163l77-48.37 	c32.581,22.285,69.44,38.664,108.993,48.37l14.931,89.25c3.048,18.896,19.453,32.76,38.608,32.76h53.198 	c19.194,0,35.545-13.863,38.661-32.759l14.875-89.25c33.308-8.147,64.531-21.245,93.134-38.5l75.196,53.705 	c15.53,11.155,36.915,9.405,50.478-4.186l37.598-37.597c13.532-13.536,15.365-34.893,4.127-50.479l-53.536-75.059 	c17.441-28.738,30.704-60.238,38.909-93.816l88.758-14.82c18.921-3.116,32.756-19.469,32.756-38.663v-53.156 	C895.998,402.24,882.163,385.888,863.24,382.771z M449.42,616.013c-92.764,0-168-75.25-168-168c0-92.764,75.236-168,168-168 	c92.748,0,167.998,75.236,167.998,168C617.418,540.763,542.168,616.013,449.42,616.013z",
		 "User" : "M394.235,333.585h-30.327c-33.495,0-60.653-27.158-60.653-60.654v-19.484c13.418-15.948,23.042-34.812,29.024-54.745 	c0.621-3.36,3.855-5.02,6.012-7.33c11.611-11.609,13.894-31.2,5.185-45.149c-1.186-2.117-3.322-3.953-3.201-6.576 	c0-17.784,0.089-35.596-0.023-53.366c-0.476-21.455-6.608-43.773-21.65-59.66c-12.144-12.836-28.819-20.479-46.022-23.75 	c-21.739-4.147-44.482-3.937-66.013,1.54c-18.659,4.709-36.189,15.637-47.028,31.836c-9.598,14.083-13.803,31.183-14.513,48.036 	c-0.266,18.094-0.061,36.233-0.116,54.371c0.413,3.631-2.667,6.088-4.058,9.094c-8.203,14.881-4.592,35.155,8.589,45.978 	c3.344,2.308,3.97,6.515,5.181,10.142c5.748,17.917,15.282,34.487,27.335,48.925v20.138c0,33.496-27.157,60.654-60.651,60.654 	H90.978c0,0-54.964,15.158-90.978,90.975v30.327c0,16.759,13.564,30.321,30.327,30.321h424.562 	c16.759,0,30.322-13.562,30.322-30.321V424.56C449.199,348.749,394.235,333.585,394.235,333.585z",
		 "Tooth" : "M46.324,8.615c-0.111-2.072-1.259-4.713-2.296-5.924c-1.038-1.21-2.974-2.359-4.321-2.567 	c-1.349-0.207-4.108-0.148-6.164,0.133l-7.299,0.995l-7.299-0.995c-2.057-0.281-4.816-0.34-6.165-0.133 	c-1.349,0.208-3.283,1.357-4.321,2.567C7.422,3.902,6.275,6.543,6.163,8.615c-0.198,3.667,0.046,9.474,2.672,14.804 	c0,0,1.879,3.758,1.879,9.77c0,4.396,1.675,13.876,3.85,18.093c0.951,1.845,3.801,1.491,4.378-0.503 	c2.02-6.988,3.46-24.59,7.301-24.541c3.839-0.049,5.279,17.553,7.302,24.541c0.578,1.994,3.428,2.348,4.379,0.503 	c2.174-4.217,3.85-13.694,3.85-18.093c0-6.012,1.879-9.77,1.879-9.77C46.278,18.089,46.522,12.282,46.324,8.615z",
		 "Pills" : "M133.88,197.244c-23.1-2.466-41.05-21.728-40.863-44.897c0.185-22.853,18.098-41.724,40.863-44.152V197.244z  M143.88,108.193v89.048c22.765-2.428,40.677-21.299,40.862-44.152C184.93,129.921,166.98,110.659,143.88,108.193z M66.487,38.057 L27.524,64.552c-7.577,5.152-12.693,12.946-14.408,21.946s0.179,18.13,5.331,25.706l1.776,2.612 c6.394,9.403,17.008,15.017,28.394,15.017c6.885,0,13.544-2.054,19.259-5.939l38.964-26.495L66.487,38.057z M163.149,17.628 l-1.776-2.612C154.98,5.614,144.365,0,132.98,0c-6.885,0-13.545,2.054-19.259,5.939L74.757,32.434l40.351,59.341l38.964-26.495 C169.712,54.646,173.784,33.269,163.149,17.628z",
		 "Stethesope" : "M32.455,21.875c0,0.926-0.522,1.723-1.287,2.133v4.223c0,4.537-3.606,8.229-8.043,8.229c-3.571,0-6.604-2.397-7.649-5.7   c-1.198-0.222-2.106-1.267-2.106-2.527v-5.498c0-0.269,0.051-0.521,0.127-0.764c-5.687-0.951-9.492-5.54-9.492-11.82   c0-0.935,0.602-1.722,1.436-2.016c0.21-1.488,0.652-2.914,1.305-4.214c-0.322-0.412-0.523-0.926-0.523-1.49   C6.223,1.088,7.311,0,8.654,0c1.343,0,2.431,1.088,2.431,2.431c0,1.342-1.088,2.43-2.431,2.43c-0.147,0-0.293-0.018-0.437-0.043   C7.698,5.886,7.336,7.049,7.153,8.265c0.678,0.36,1.145,1.065,1.145,1.886c0,4.691,2.918,7.721,7.436,7.721   c4.516,0,7.436-3.03,7.436-7.721c0-0.821,0.466-1.525,1.144-1.886c-0.185-1.216-0.547-2.379-1.064-3.447   c-0.143,0.026-0.285,0.043-0.436,0.043c-1.344,0-2.433-1.088-2.433-2.43C20.381,1.088,21.47,0,22.813,0   c1.343,0,2.431,1.088,2.431,2.431c0,0.564-0.2,1.078-0.522,1.49c0.652,1.3,1.094,2.726,1.305,4.214   c0.834,0.294,1.437,1.081,1.437,2.016c0,6.129-3.625,10.649-9.086,11.748c0.09,0.264,0.149,0.541,0.149,0.834v5.498   c0,0.965-0.537,1.795-1.323,2.235c0.889,2.492,3.209,4.277,5.935,4.277c3.487,0,6.327-2.923,6.327-6.513v-4   c-1.065-0.26-1.858-1.211-1.858-2.356c0-1.343,1.088-2.431,2.434-2.431C31.367,19.443,32.455,20.531,32.455,21.875z",
		 "People" : "M147.128,91.076c0-37.95,30.766-68.716,68.721-68.716c37.95,0,68.719,30.766,68.719,68.716s-30.769,68.715-68.719,68.715 	C177.894,159.792,147.128,129.026,147.128,91.076z M248.873,206.607c0.689-14.963,5.84-28.812,14.127-40.261 	c-5.816-1.218-11.827-1.865-17.995-1.865h-58.304c-6.15,0-12.153,0.642-17.939,1.845c8.819,12.232,14.094,27.171,14.18,43.343 	c10.72-5.896,23.02-9.253,36.085-9.253C229.625,200.416,239.714,202.624,248.873,206.607z M260.505,212.775 	c19.96,12.517,33.957,33.688,36.517,58.274c8.133,3.801,17.171,5.994,26.746,5.994c34.968,0,63.311-28.346,63.311-63.313 	c0-34.971-28.343-63.311-63.311-63.311C289.12,150.42,261.031,178.257,260.505,212.775z M219.026,342.411 	c34.962,0,63.307-28.354,63.307-63.311c0-34.962-28.345-63.311-63.307-63.311c-34.965,0-63.322,28.348-63.322,63.311 	C155.705,314.057,184.061,342.411,219.026,342.411z M245.882,346.72h-53.717c-44.697,0-81.069,36.369-81.069,81.072v65.703 	l0.171,1.029l4.522,1.406c42.658,13.323,79.718,17.779,110.224,17.779c59.571,0,94.114-16.987,96.242-18.074l4.231-2.141h0.449 	v-65.703C326.936,383.089,290.585,346.72,245.882,346.72z M350.638,281.364h-53.314c-0.579,21.332-9.683,40.542-24.081,54.35 	c39.732,11.815,68.802,48.657,68.802,92.178v20.245c52.629-1.938,82.963-16.846,84.961-17.851l4.232-2.152h0.449v-65.715 	C431.693,317.728,395.324,281.364,350.638,281.364z M364.889,149.069c19.961,12.519,33.957,33.691,36.511,58.277 	c8.134,3.801,17.171,5.99,26.746,5.99c34.975,0,63.316-28.342,63.316-63.304c0-34.972-28.342-63.311-63.316-63.311 	C393.503,86.717,365.416,114.56,364.889,149.069z M455.01,217.658h-53.303c-0.579,21.332-9.682,40.542-24.08,54.349 	c39.731,11.811,68.801,48.658,68.801,92.179v20.245c52.624-1.934,82.964-16.84,84.962-17.852l4.226-2.145h0.455v-65.723 	C536.077,254.024,499.708,217.658,455.01,217.658z M107.937,277.044c12.386,0,23.903-3.618,33.67-9.777 	c3.106-20.241,13.958-37.932,29.454-49.975c0.065-1.188,0.174-2.361,0.174-3.561c0-34.971-28.351-63.311-63.298-63.311 	c-34.977,0-63.316,28.339-63.316,63.311C44.621,248.704,72.959,277.044,107.937,277.044z M164.795,335.714 	c-14.331-13.742-23.404-32.847-24.072-54.055c-1.971-0.147-3.928-0.295-5.943-0.295H81.069C36.366,281.364,0,317.728,0,362.425 	v65.709l0.166,1.023l4.528,1.412c34.214,10.699,64.761,15.616,91.292,17.153v-19.837 	C95.991,384.371,125.054,347.523,164.795,335.714z",
		 "FemaleUser" : "M138.46,164.287c-38.628,0-69.925-37.519-69.925-83.767C68.535,34.277,99.832,0,138.46,0 	c38.634,0,69.957,34.277,69.957,80.52C208.417,126.768,177.093,164.287,138.46,164.287z M29.689,277.528 	c0,0-14.832,0.979-21.365-8.023c-3.53-4.863-1.071-14.718,1.343-20.217l5.912-13.473c0,0,16.35-36.567,34.962-57.757 	c11.433-12.994,25.031-10.035,33.826-5.809c5.417,2.6,11.542,10.176,16.018,14.191c6.168,5.532,17.057,11.819,34.859,12.173h10.922 	c17.791-0.354,28.68-6.641,34.843-12.173c4.471-4.014,10.427-11.825,15.795-14.511c8.072-4.041,20.358-6.527,31.492,6.13 	c18.618,21.191,33.363,58.421,33.363,58.421l6.059,13.212c2.507,5.461,5.075,15.267,1.643,20.195 	c-6.124,8.811-19.874,7.642-19.874,7.642S29.689,277.528,29.689,277.528z",
		 "Facebook" : "M576.505,14.076v550.801c0,4.08-1.432,7.443-4.285,10.098c-2.855,2.652-6.324,3.977-10.404,3.977 		H17.136c-4.08,0-7.548-1.322-10.404-3.977s-4.284-6.018-4.284-10.098V14.076c0-4.08,1.428-7.446,4.284-10.098S13.056,0,17.136,0 		h544.679c4.08,0,7.549,1.326,10.404,3.978S576.505,9.996,576.505,14.076z M401.471,511.633V307.225h74.664l3.061-73.44h-77.725 		v-53.856c0-10.2,1.734-18.258,5.203-24.174c3.467-5.916,11.729-8.67,24.785-8.262h45.898l1.836-68.544 		c-5.713-0.816-11.523-1.326-17.439-1.53s-11.322-0.51-16.221-0.918c-5.713-0.408-11.424-0.612-17.137-0.612 		c-17.951-1.224-33.354,0.714-46.205,5.814s-23.461,12.24-31.824,21.42c-8.361,9.18-14.586,19.686-18.666,31.518 		c-4.078,11.832-6.117,23.868-6.117,36.108v63.036h-52.633v73.44h52.633v204.408L401.471,511.633L401.471,511.633z",
		 "GooglePlus" : "M9.208,22.73c-0.292-0.396-0.552-0.795-0.779-1.23c-0.267-0.423-0.399-0.934-0.399-1.527c0-0.354,0.05-0.654,0.152-0.893c0.089-0.251,0.171-0.482,0.248-0.693c-0.459,0.053-0.893,0.078-1.3,0.078c-1.927-0.023-3.444-0.568-4.55-1.636v7.21c0.989-0.453,2.013-0.771,3.073-0.955C7.078,22.874,8.264,22.756,9.208,22.73zM10.311,23.872c-0.257-0.026-0.56-0.039-0.908-0.039c-0.207-0.026-0.734,0-1.584,0.079c-0.837,0.117-1.693,0.309-2.568,0.57c-0.206,0.08-0.496,0.197-0.869,0.354c-0.374,0.171-0.753,0.414-1.139,0.729c-0.247,0.229-0.468,0.479-0.664,0.771v1.104c0,1.026,0.838,1.865,1.869,1.865h10.188c0-0.021,0.002-0.051,0.002-0.068c0-1.021-0.335-1.922-1.004-2.688C12.924,25.812,11.817,24.925,10.311,23.872zM6.751,16.594c0.656,0.514,1.404,0.771,2.247,0.771c1.065-0.039,1.952-0.422,2.662-1.146c0.342-0.514,0.562-1.041,0.66-1.581c0.059-0.54,0.088-0.995,0.088-1.364c0-1.594-0.408-3.202-1.224-4.822c-0.382-0.777-0.886-1.41-1.51-1.897C9.037,6.094,8.304,5.85,7.476,5.824C6.38,5.848,5.468,6.289,4.742,7.146C4.129,8.042,3.837,9.043,3.863,10.15c0,1.463,0.428,2.985,1.284,4.566C5.562,15.453,6.097,16.079,6.751,16.594zM27.553,2.707H4.447c-1.031,0-1.869,0.838-1.869,1.869v2.507c0.118-0.125,0.24-0.25,0.367-0.372c1.15-0.947,2.345-1.565,3.584-1.855c1.227-0.25,2.376-0.375,3.45-0.375h8.087l-2.5,1.458h-2.494c0.254,0.158,0.54,0.388,0.857,0.69c0.304,0.315,0.603,0.703,0.895,1.164c0.279,0.434,0.527,0.946,0.743,1.538c0.177,0.592,0.267,1.282,0.267,2.071c-0.024,1.447-0.343,2.604-0.958,3.472c-0.302,0.421-0.621,0.809-0.958,1.164c-0.374,0.354-0.771,0.718-1.193,1.085c-0.241,0.25-0.464,0.533-0.669,0.848c-0.241,0.329-0.361,0.711-0.361,1.146c0,0.421,0.124,0.769,0.371,1.046c0.21,0.264,0.414,0.493,0.612,0.688l1.372,1.125c0.853,0.688,1.6,1.467,2.243,2.31c0.604,0.854,0.921,1.972,0.943,3.354c0,0.562-0.071,1.106-0.223,1.646H27.54c1.03,0,1.869-0.838,1.869-1.87V4.576C29.422,3.545,28.584,2.707,27.553,2.707zM29.023,10.953h-4.244v4.244h-2.057v-4.244H18.48V8.897h4.242V4.654h2.057v4.243h4.244V10.953z",
		 "Twitter" : "M459,0H51C22.95,0,0,22.95,0,51v408c0,28.05,22.95,51,51,51h408c28.05,0,51-22.95,51-51V51C510,22.95,487.05,0,459,0z 		 M400.35,186.15c-2.55,117.3-76.5,198.9-188.7,204C165.75,392.7,132.6,377.4,102,359.55c33.15,5.101,76.5-7.649,99.45-28.05 		c-33.15-2.55-53.55-20.4-63.75-48.45c10.2,2.55,20.4,0,28.05,0c-30.6-10.2-51-28.05-53.55-68.85c7.65,5.1,17.85,7.65,28.05,7.65 		c-22.95-12.75-38.25-61.2-20.4-91.8c33.15,35.7,73.95,66.3,140.25,71.4c-17.85-71.4,79.051-109.65,117.301-61.2 		c17.85-2.55,30.6-10.2,43.35-15.3c-5.1,17.85-15.3,28.05-28.05,38.25c12.75-2.55,25.5-5.1,35.7-10.2 		C425.85,165.75,413.1,175.95,400.35,186.15z",
		 "YouTube" : "M16.281,0.001H1.855C0.831,0.001,0,0.83,0,1.855v14.426c0,1.025,0.831,1.854,1.855,1.854h14.426 	c1.024,0,1.855-0.828,1.855-1.854V1.855C18.136,0.83,17.306,0.001,16.281,0.001z M10.447,3.063h0.883v2.785 	c0,0.535,0.017,0.519,0.035,0.586c0.019,0.071,0.083,0.238,0.29,0.238c0.22,0,0.281-0.176,0.298-0.251 	c0.014-0.065,0.03-0.052,0.03-0.61V3.063h0.882v4.18h-0.894l0.011-0.211L11.71,6.919c-0.069,0.14-0.149,0.24-0.247,0.31 	c-0.099,0.069-0.21,0.104-0.342,0.104c-0.152,0-0.276-0.033-0.37-0.098c-0.092-0.063-0.156-0.141-0.198-0.24 	c-0.046-0.11-0.075-0.229-0.086-0.346c-0.013-0.135-0.02-0.414-0.02-0.83V3.063L10.447,3.063z M7.379,4.801 	c0-0.436,0.037-0.773,0.107-1.012C7.552,3.568,7.669,3.394,7.844,3.26c0.178-0.139,0.413-0.208,0.699-0.208 	c0.244,0,0.453,0.048,0.624,0.138c0.166,0.088,0.294,0.203,0.381,0.338C9.637,3.67,9.699,3.815,9.732,3.961 	c0.034,0.152,0.051,0.398,0.051,0.73v0.736c0,0.432-0.017,0.747-0.048,0.941C9.705,6.546,9.639,6.716,9.54,6.872 	C9.441,7.025,9.318,7.139,9.161,7.213C8.999,7.29,8.808,7.33,8.594,7.33c-0.244,0-0.451-0.034-0.617-0.104 	C7.823,7.164,7.705,7.074,7.623,6.953C7.539,6.827,7.477,6.672,7.44,6.492C7.4,6.298,7.38,5.996,7.38,5.593L7.379,4.801z 	 M5.314,1.574l0.718,2.311c0.125-0.604,0.367-1.44,0.559-2.311h0.651L6.404,4.871L6.398,4.897v2.344H5.635V4.897L5.629,4.872 	L4.663,1.574H5.314z M15.708,14.501c-0.114,1.04-1.037,1.892-2.072,1.962c-3.048,0.131-6.087,0.131-9.134,0 	c-1.036-0.07-1.958-0.922-2.073-1.962c-0.113-1.646-0.113-3.263,0-4.907c0.114-1.04,1.037-1.89,2.073-1.963 	c3.047-0.13,6.086-0.13,9.134,0c1.036,0.073,1.958,0.923,2.072,1.963C15.822,11.238,15.822,12.855,15.708,14.501z M8.581,6.83 	c0.128,0,0.228-0.077,0.273-0.21C8.875,6.559,8.9,6.443,8.9,6.127V4.316c0-0.366-0.021-0.484-0.043-0.551 	C8.812,3.629,8.713,3.55,8.584,3.55c-0.127,0-0.227,0.076-0.274,0.211C8.286,3.826,8.262,3.947,8.262,4.316v1.761 	c0,0.346,0.025,0.465,0.047,0.532C8.355,6.749,8.454,6.83,8.581,6.83z M3.617,9.91h0.72H4.48v0.147v4.704h0.904v-4.704V9.91h0.142 	h0.723V8.99H3.617V9.91z M7.892,13.105c0,0.521-0.015,0.65-0.027,0.705c-0.031,0.135-0.139,0.217-0.291,0.217 	c-0.145,0-0.25-0.078-0.284-0.207c-0.015-0.055-0.031-0.184-0.031-0.68v-2.757H6.403v3.004c0,0.396,0.006,0.66,0.018,0.79 	c0.012,0.119,0.043,0.237,0.091,0.348c0.043,0.1,0.108,0.177,0.199,0.236c0.088,0.061,0.205,0.09,0.346,0.09 	c0.121,0,0.226-0.031,0.318-0.094c0.095-0.064,0.178-0.166,0.246-0.301l0.271,0.066L7.88,14.766h0.868v-4.383H7.893L7.892,13.105z 	 M11.678,10.605c-0.047-0.093-0.115-0.162-0.205-0.215c-0.093-0.053-0.207-0.078-0.338-0.078c-0.11,0-0.209,0.027-0.304,0.086 	c-0.097,0.062-0.188,0.153-0.27,0.281L10.3,11.082v-0.486V8.991H9.444v5.771h0.808l0.05-0.257l0.07-0.358l0.19,0.308 	c0.084,0.138,0.177,0.239,0.275,0.306c0.093,0.062,0.19,0.094,0.296,0.094c0.15,0,0.276-0.053,0.386-0.156 	c0.115-0.112,0.186-0.237,0.217-0.389c0.034-0.168,0.051-0.434,0.051-0.416v-2.291c0,0.01,0.034-0.228-0.017-0.701 	C11.761,10.803,11.73,10.706,11.678,10.605z M10.933,13.148c0,0.41-0.021,0.535-0.038,0.6c-0.04,0.141-0.141,0.223-0.277,0.223 	c-0.132,0-0.233-0.078-0.275-0.215c-0.02-0.062-0.042-0.184-0.042-0.559v-1.161c0-0.39,0.02-0.507,0.038-0.563 	c0.039-0.129,0.141-0.207,0.272-0.207c0.135,0,0.237,0.082,0.28,0.221c0.019,0.061,0.044,0.183,0.044,0.551v1.111L10.933,13.148 	L10.933,13.148z M13.272,12.702h0.143h1.335v-0.476c0-0.431-0.04-0.925-0.119-1.156c-0.075-0.223-0.202-0.395-0.389-0.528 	c-0.181-0.128-0.419-0.195-0.706-0.195c-0.233,0-0.441,0.054-0.618,0.163s-0.3,0.262-0.378,0.469 	c-0.082,0.215-0.125,0.521-0.125,1.064v1.345c0,0.173,0.02,0.429,0.056,0.597c0.036,0.162,0.101,0.312,0.193,0.447 	c0.087,0.127,0.214,0.23,0.374,0.305c0.164,0.076,0.358,0.115,0.576,0.115c0.223,0,0.409-0.039,0.551-0.113 	c0.142-0.075,0.26-0.19,0.354-0.342c0.098-0.158,0.161-0.309,0.187-0.445c0.028-0.143,0.042-0.355,0.042-0.631v-0.205h-0.796v0.472 	c0,0.25-0.017,0.413-0.052,0.511c-0.049,0.133-0.162,0.211-0.309,0.211c-0.129,0-0.229-0.064-0.274-0.179 	c-0.022-0.054-0.047-0.151-0.047-0.452v-0.838v-0.138h0.002L13.272,12.702z M13.272,12.087v-0.495c0-0.364,0.019-0.309,0.035-0.358 	c0.038-0.117,0.141-0.186,0.284-0.186c0.128,0,0.226,0.075,0.265,0.203c0.016,0.052,0.036,0.002,0.036,0.341v0.495v0.139h-0.143 	h-0.333h-0.143C13.273,12.226,13.272,12.087,13.272,12.087z",
		 "WhatsApp" : "M478.165,232.946c0,128.567-105.057,232.966-234.679,232.966c-41.102,0-79.814-10.599-113.445-28.969 	L0,478.165l42.437-125.04c-21.438-35.065-33.77-76.207-33.77-120.159C8.667,104.34,113.763,0,243.485,0 	C373.108,0,478.165,104.34,478.165,232.946z M243.485,37.098c-108.802,0-197.422,87.803-197.422,195.868 	c0,42.915,13.986,82.603,37.576,114.879l-24.586,72.542l75.849-23.968c31.121,20.481,68.457,32.296,108.583,32.296 	c108.723,0,197.323-87.843,197.323-195.908C440.808,124.921,352.208,37.098,243.485,37.098z M361.931,286.62 	c-1.395-2.331-5.22-3.746-10.898-6.814c-5.917-2.849-34.089-16.497-39.508-18.37c-5.16-1.913-8.986-2.849-12.811,2.829 	c-4.005,5.638-14.903,18.629-18.23,22.354c-3.546,3.785-6.854,4.264-12.552,1.435c-5.618-2.809-24.267-8.866-46.203-28.391 	c-17.055-15.042-28.67-33.711-31.997-39.508c-3.427-5.758-0.398-8.826,2.471-11.635c2.69-2.59,5.778-6.734,8.627-10.041 	c2.969-3.287,3.905-5.638,5.798-9.424c1.913-3.905,0.936-7.192-0.478-10.141c-1.415-2.849-13.01-30.881-17.752-42.337 	c-4.841-11.416-9.543-9.523-12.871-9.523c-3.467,0-7.212-0.478-11.117-0.478c-3.785,0-10.041,1.395-15.381,7.192 	c-5.2,5.658-20.123,19.465-20.123,47.597c0,28.052,20.601,55.308,23.55,59.053c2.869,3.785,39.747,63.197,98.303,86.07 	c58.476,22.872,58.476,15.321,69.115,14.365c10.38-0.956,34.069-13.867,38.811-27.096 	C363.345,300.307,363.345,288.991,361.931,286.62z",
		 "LinkedIn" : "M398.355,0H31.782C14.229,0,0.002,13.793,0.002,30.817v368.471 	c0,17.025,14.232,30.83,31.78,30.83h366.573c17.549,0,31.76-13.814,31.76-30.83V30.817C430.115,13.798,415.904,0,398.355,0z 	 M130.4,360.038H65.413V165.845H130.4V360.038z M97.913,139.315h-0.437c-21.793,0-35.92-14.904-35.92-33.563 	c0-19.035,14.542-33.535,36.767-33.535c22.227,0,35.899,14.496,36.331,33.535C134.654,124.415,120.555,139.315,97.913,139.315z 	 M364.659,360.038h-64.966V256.138c0-26.107-9.413-43.921-32.907-43.921c-17.973,0-28.642,12.018-33.327,23.621 	c-1.736,4.144-2.166,9.94-2.166,15.728v108.468h-64.954c0,0,0.85-175.979,0-194.192h64.964v27.531 	c8.624-13.229,24.035-32.1,58.534-32.1c42.76,0,74.822,27.739,74.822,87.414V360.038z M230.883,193.99 	c0.111-0.182,0.266-0.401,0.42-0.614v0.614H230.883z",
		 "Football" : "M489.927,239.193c-0.015-0.609-0.038-1.217-0.057-1.825c-0.041-1.337-0.09-2.671-0.151-4.003 c-0.033-0.688-0.068-1.376-0.106-2.063c-0.071-1.293-0.154-2.583-0.245-3.871c-0.046-0.647-0.089-1.294-0.141-1.94 c-0.121-1.55-0.26-3.094-0.411-4.635c-0.034-0.355-0.063-0.712-0.099-1.067c-0.192-1.879-0.408-3.751-0.643-5.618 c-0.068-0.552-0.148-1.101-0.221-1.652c-0.177-1.33-0.359-2.657-0.558-3.98c-0.102-0.682-0.209-1.362-0.316-2.042 c-0.191-1.216-0.393-2.429-0.603-3.639c-0.117-0.676-0.234-1.353-0.356-2.027c-0.24-1.319-0.495-2.633-0.756-3.945 c-0.105-0.53-0.204-1.062-0.313-1.59c-0.371-1.8-0.761-3.593-1.171-5.378c-0.11-0.483-0.232-0.963-0.346-1.444 c-0.314-1.327-0.634-2.65-0.968-3.968c-0.173-0.679-0.353-1.356-0.531-2.033c-0.298-1.133-0.603-2.264-0.917-3.39 c-0.195-0.699-0.392-1.397-0.592-2.094c-0.333-1.156-0.678-2.306-1.028-3.455c-0.19-0.627-0.377-1.256-0.572-1.88 c-0.535-1.709-1.085-3.412-1.657-5.104c-0.124-0.368-0.258-0.732-0.384-1.101c-0.468-1.362-0.943-2.721-1.435-4.073 c-0.244-0.671-0.496-1.338-0.745-2.007c-0.393-1.052-0.79-2.101-1.197-3.146c-0.276-0.713-0.557-1.424-0.841-2.133 c-0.409-1.023-0.827-2.042-1.25-3.059c-0.282-0.68-0.563-1.36-0.851-2.037c-0.517-1.212-1.047-2.416-1.583-3.618 c-0.208-0.467-0.409-0.938-0.62-1.403c-0.714-1.576-1.447-3.142-2.194-4.7c-0.311-0.65-0.632-1.293-0.948-1.939 c-0.482-0.983-0.967-1.965-1.461-2.94c-0.357-0.704-0.719-1.404-1.082-2.104c-0.48-0.926-0.967-1.847-1.459-2.766 c-0.369-0.69-0.739-1.382-1.115-2.069c-0.545-0.995-1.102-1.982-1.66-2.968c-0.33-0.584-0.654-1.172-0.989-1.753 c-0.857-1.485-1.729-2.959-2.616-4.424c-0.359-0.595-0.73-1.182-1.095-1.773c-0.581-0.941-1.163-1.88-1.756-2.812 c-0.427-0.671-0.858-1.336-1.292-2.002c-0.554-0.854-1.113-1.704-1.678-2.55c-0.445-0.667-0.892-1.333-1.343-1.995 c-0.601-0.881-1.21-1.755-1.822-2.628c-0.419-0.599-0.834-1.2-1.259-1.794c-0.988-1.383-1.988-2.758-3.004-4.12v0 c-26.757-35.862-63.104-64.141-105.236-81.062c-0.002-0.001-0.004-0.001-0.006-0.002c-1.676-0.673-3.363-1.326-5.057-1.963 c-0.122-0.046-0.242-0.093-0.363-0.138c-1.606-0.601-3.222-1.182-4.844-1.75c-0.218-0.076-0.436-0.154-0.654-0.23 c-1.547-0.537-3.102-1.056-4.663-1.562c-0.301-0.098-0.602-0.197-0.903-0.294c-1.494-0.478-2.996-0.94-4.503-1.391 c-0.38-0.113-0.759-0.227-1.138-0.338c-1.444-0.424-2.895-0.834-4.35-1.232c-0.454-0.125-0.909-0.248-1.365-0.37 c-1.395-0.372-2.794-0.734-4.199-1.082c-0.527-0.131-1.057-0.259-1.586-0.387c-1.348-0.325-2.698-0.641-4.055-0.943 c-0.597-0.133-1.195-0.261-1.793-0.391c-1.303-0.28-2.606-0.553-3.916-0.813c-0.668-0.132-1.338-0.258-2.008-0.385 c-1.252-0.237-2.506-0.47-3.765-0.688c-0.741-0.129-1.486-0.248-2.23-0.37c-1.2-0.197-2.401-0.391-3.607-0.57 c-0.817-0.122-1.638-0.23-2.457-0.344c-1.146-0.158-2.292-0.318-3.444-0.46c-0.895-0.111-1.795-0.207-2.693-0.308 c-1.088-0.122-2.175-0.248-3.268-0.356c-0.985-0.098-1.975-0.177-2.964-0.263c-1.017-0.088-2.031-0.183-3.052-0.259 c-1.103-0.082-2.213-0.143-3.32-0.21c-0.917-0.056-1.831-0.121-2.751-0.167c-1.295-0.064-2.597-0.104-3.896-0.148 c-0.743-0.025-1.484-0.063-2.23-0.081C249.121,0.027,247.064,0,245,0c-2.064,0-4.121,0.027-6.173,0.078 c-0.747,0.019-1.488,0.056-2.233,0.081c-1.299,0.044-2.599,0.084-3.893,0.148c-0.922,0.045-1.838,0.111-2.756,0.167 c-1.105,0.067-2.213,0.129-3.315,0.21c-1.022,0.076-2.039,0.171-3.058,0.259c-0.986,0.085-1.975,0.165-2.957,0.263 c-1.096,0.108-2.186,0.235-3.277,0.357c-0.895,0.101-1.791,0.196-2.683,0.307c-1.155,0.143-2.304,0.303-3.454,0.461 c-0.816,0.113-1.634,0.222-2.447,0.342c-1.21,0.18-2.414,0.375-3.618,0.572c-0.739,0.121-1.48,0.239-2.218,0.367 c-1.264,0.219-2.521,0.453-3.778,0.69c-0.665,0.127-1.33,0.251-1.993,0.382c-1.314,0.261-2.624,0.535-3.931,0.816 c-0.593,0.127-1.185,0.255-1.776,0.387c-1.362,0.304-2.721,0.621-4.074,0.947c-0.521,0.126-1.043,0.253-1.563,0.382 c-1.413,0.351-2.82,0.714-4.224,1.089c-0.446,0.119-0.893,0.24-1.338,0.362c-1.464,0.4-2.923,0.813-4.377,1.24 c-0.369,0.108-0.737,0.219-1.104,0.329c-1.52,0.453-3.032,0.92-4.538,1.402c-0.288,0.092-0.575,0.186-0.862,0.28 c-1.576,0.511-3.146,1.035-4.707,1.577c-0.2,0.069-0.399,0.141-0.6,0.211c-1.641,0.574-3.275,1.163-4.9,1.771 c-0.097,0.036-0.193,0.074-0.289,0.11C114.502,32.253,76.252,61.402,48.41,98.773c-0.975,1.309-1.937,2.627-2.886,3.956 c-0.448,0.628-0.888,1.264-1.33,1.896c-0.587,0.839-1.173,1.678-1.75,2.524c-0.466,0.683-0.925,1.369-1.384,2.056 c-0.549,0.823-1.093,1.65-1.633,2.48c-0.445,0.687-0.891,1.372-1.33,2.063c-0.572,0.899-1.133,1.805-1.693,2.712 c-0.385,0.623-0.774,1.241-1.153,1.867c-0.88,1.455-1.746,2.918-2.597,4.393c-0.348,0.603-0.685,1.213-1.027,1.819 c-0.547,0.965-1.091,1.931-1.624,2.904c-0.382,0.698-0.757,1.4-1.133,2.102c-0.485,0.905-0.965,1.814-1.438,2.727 c-0.369,0.709-0.735,1.42-1.098,2.134c-0.488,0.963-0.966,1.932-1.441,2.902c-0.322,0.657-0.648,1.311-0.965,1.972 c-0.736,1.536-1.459,3.079-2.163,4.632c-0.224,0.494-0.438,0.993-0.659,1.488c-0.531,1.193-1.058,2.388-1.57,3.591 c-0.29,0.68-0.57,1.363-0.854,2.045c-0.422,1.014-0.839,2.031-1.247,3.051c-0.284,0.711-0.564,1.423-0.843,2.137 c-0.405,1.044-0.802,2.091-1.194,3.142c-0.25,0.67-0.503,1.338-0.748,2.012c-0.489,1.349-0.964,2.704-1.431,4.063 c-0.127,0.371-0.262,0.738-0.387,1.109c-0.572,1.693-1.122,3.396-1.657,5.105c-0.195,0.624-0.382,1.251-0.572,1.877 c-0.35,1.148-0.694,2.299-1.027,3.454c-0.201,0.697-0.398,1.396-0.593,2.097c-0.314,1.128-0.62,2.259-0.918,3.393 c-0.178,0.675-0.357,1.348-0.528,2.025c-0.336,1.323-0.658,2.651-0.973,3.982c-0.112,0.479-0.232,0.954-0.343,1.433 c-0.41,1.787-0.8,3.581-1.171,5.382c-0.109,0.526-0.207,1.056-0.313,1.583c-0.262,1.314-0.516,2.629-0.757,3.951 c-0.122,0.674-0.239,1.35-0.357,2.025c-0.21,1.212-0.411,2.427-0.603,3.645c-0.107,0.678-0.214,1.355-0.315,2.035 c-0.198,1.327-0.382,2.658-0.559,3.992c-0.072,0.547-0.151,1.092-0.22,1.641c-0.234,1.867-0.45,3.74-0.643,5.62 c-0.036,0.355-0.064,0.712-0.099,1.067c-0.151,1.541-0.29,3.085-0.411,4.635c-0.052,0.645-0.095,1.293-0.141,1.94 c-0.091,1.288-0.174,2.578-0.245,3.871c-0.038,0.687-0.073,1.375-0.106,2.063c-0.061,1.331-0.11,2.666-0.151,4.003 c-0.019,0.608-0.042,1.215-0.057,1.825C0.028,241.124,0,243.059,0,245c0,1.737,0.027,3.468,0.065,5.196 c0.017,0.778,0.037,1.556,0.061,2.332c0.021,0.667,0.049,1.331,0.075,1.996c1.684,44.022,14.979,85.063,36.915,120.154 c0.003,0.004,0.005,0.008,0.007,0.012c4.157,6.648,8.622,13.081,13.379,19.281c0.025,0.034,0.052,0.068,0.078,0.102 c4.707,6.129,9.695,12.029,14.949,17.681c0.122,0.131,0.244,0.262,0.366,0.393c0.999,1.069,2.005,2.132,3.022,3.183 c0.042,0.044,0.085,0.087,0.127,0.131c3.161,3.262,6.412,6.436,9.748,9.519c0.106,0.098,0.211,0.197,0.318,0.295 c0.988,0.91,1.985,1.809,2.988,2.702c0.275,0.246,0.552,0.491,0.828,0.736c0.981,0.865,1.965,1.724,2.959,2.573 c0.229,0.197,0.463,0.391,0.693,0.587c3.172,2.692,6.414,5.304,9.723,7.835c0.33,0.253,0.659,0.509,0.991,0.76 c0.944,0.715,1.896,1.42,2.852,2.121c0.451,0.332,0.903,0.661,1.356,0.99c0.936,0.677,1.873,1.35,2.818,2.014 c0.443,0.311,0.891,0.618,1.337,0.927c3.143,2.177,6.339,4.282,9.585,6.314c0.547,0.342,1.091,0.686,1.64,1.023 c0.901,0.554,1.808,1.099,2.716,1.641c0.612,0.366,1.227,0.729,1.843,1.089c0.895,0.523,1.791,1.044,2.692,1.557 c0.637,0.361,1.276,0.715,1.916,1.071c3.139,1.747,6.318,3.425,9.539,5.036c0.71,0.355,1.418,0.711,2.132,1.059 c0.882,0.431,1.77,0.853,2.657,1.273c0.729,0.345,1.461,0.687,2.194,1.024c0.888,0.409,1.774,0.816,2.668,1.214 c0.753,0.336,1.51,0.663,2.267,0.992c0.884,0.384,1.765,0.772,2.654,1.146c0.002,0.001,0.004,0.002,0.007,0.003 C179.337,483.221,211.376,490,245,490c33.172,0,64.796-6.606,93.649-18.552c0.002-0.001,0.005-0.002,0.007-0.003 c1.484-0.615,2.96-1.246,4.43-1.889c0.149-0.065,0.299-0.131,0.448-0.196c1.438-0.633,2.87-1.278,4.295-1.938 c0.121-0.056,0.242-0.113,0.363-0.169c7.491-3.484,14.777-7.335,21.835-11.531c0.148-0.088,0.297-0.175,0.445-0.264 c1.264-0.755,2.519-1.522,3.768-2.299c0.258-0.16,0.516-0.321,0.772-0.482c1.213-0.761,2.419-1.53,3.618-2.312 c0.247-0.162,0.493-0.325,0.74-0.488c1.232-0.81,2.46-1.626,3.677-2.457c0.049-0.034,0.098-0.068,0.148-0.102 c3.943-2.699,7.803-5.512,11.577-8.431c0.195-0.151,0.393-0.299,0.588-0.451c1.017-0.792,2.025-1.597,3.028-2.404 c0.407-0.327,0.815-0.653,1.221-0.983c0.93-0.758,1.853-1.523,2.771-2.294c0.467-0.391,0.932-0.784,1.395-1.179 c0.883-0.752,1.762-1.508,2.634-2.272c0.481-0.421,0.957-0.848,1.434-1.273c0.858-0.764,1.715-1.526,2.561-2.302 c0.445-0.408,0.884-0.823,1.326-1.234c1.824-1.695,3.625-3.416,5.397-5.165c0.247-0.243,0.498-0.481,0.743-0.726 c0.709-0.705,1.404-1.422,2.104-2.136c0.581-0.593,1.164-1.183,1.739-1.782c0.657-0.684,1.306-1.376,1.954-2.067 c0.608-0.648,1.215-1.297,1.816-1.951c0.618-0.673,1.231-1.351,1.843-2.031c0.626-0.697,1.247-1.398,1.865-2.102 c0.576-0.657,1.152-1.315,1.723-1.979c0.659-0.768,1.311-1.542,1.96-2.318c0.517-0.616,1.037-1.229,1.547-1.851 c0.814-0.991,1.615-1.993,2.414-2.997c0.333-0.419,0.674-0.832,1.004-1.253c1.101-1.402,2.184-2.818,3.254-4.244 c0.393-0.522,0.775-1.053,1.162-1.578c0.706-0.957,1.41-1.915,2.102-2.882c0.426-0.594,0.844-1.193,1.265-1.792 c0.645-0.917,1.284-1.838,1.917-2.765c0.418-0.614,0.834-1.23,1.247-1.848c0.631-0.943,1.254-1.892,1.872-2.845 c0.388-0.597,0.776-1.193,1.158-1.794c0.664-1.043,1.316-2.094,1.965-3.148c0.317-0.515,0.64-1.026,0.953-1.543 c0.938-1.548,1.86-3.106,2.764-4.676c0.016-0.026,0.031-0.052,0.046-0.077c0.001-0.001,0.001-0.003,0.002-0.004 c19.162-33.328,30.691-71.595,32.253-112.416c0.026-0.665,0.054-1.329,0.075-1.996c0.023-0.777,0.044-1.554,0.061-2.332 c0.038-1.728,0.065-3.459,0.065-5.196C490,243.059,489.972,241.124,489.927,239.193z M255,76.606l61.818-44.913 c5.309,1.79,10.563,3.783,15.756,5.98C359.365,49.005,383.43,65.23,404.1,85.9c11.277,11.278,21.222,23.573,29.78,36.764 l-21.575,68.122l-64.304,21.111L255,144.33V76.606z M85.901,85.9c20.67-20.67,44.734-36.895,71.525-48.227 c5.192-2.196,10.446-4.19,15.757-5.98L235,76.606v67.724l-93.498,67.93l-63.704-21.152l-21.677-68.443 C64.68,109.474,74.624,97.178,85.901,85.9z M125.224,388.634l-61.027-9.667c-10.638-14.319-19.519-29.834-26.522-46.395 c-11.47-27.116-17.394-55.897-17.649-85.572l51.564-36.881l63.743,21.165l36.109,111.131L125.224,388.634z M342.379,447.901 c-3.227,1.549-6.494,3.024-9.805,4.425C304.848,464.054,275.384,470,245,470c-30.383,0-59.848-5.946-87.573-17.674 c-3.724-1.575-7.39-3.255-11.007-5.018l-7.053-44.533l49.84-49.84h118.586l42.842,42.841L342.379,447.901z M452.326,332.573 c-5.737,13.564-12.734,26.427-20.922,38.507l-66.629,10.552l-44.498-44.499l34.584-106.44l63.272-20.773l51.842,37.079 C469.72,276.676,463.796,305.457,452.326,332.573z",
		 "Trophy" : "M24.651,0l0.034,0.725c0.021,0.416-0.084,0.734-0.317,0.975c-0.314,0.322-0.824,0.484-1.252,0.557 	c0.016-0.371,0.031-0.745,0.043-1.132c-0.619,0-3.891,0-7.155,0c-0.003,0-0.005,0-0.008,0c-3.265,0-6.535,0-7.154,0 	C8.854,1.512,8.87,1.886,8.886,2.257C8.457,2.184,7.948,2.021,7.633,1.699C7.398,1.459,7.293,1.14,7.314,0.724L7.349,0H3.558 	l0.013,0.704c0.21,12.111,5.337,15.043,7.684,15.75l-0.385,0.547L12,17.798l0.386-0.551c0.772,1.438,1.445,2.356,1.732,3.09h-0.524 	v1.097h0.64c-0.259,1.694-3.684,3.656-3.684,3.656v1.034H9.71V32h6.285h0.008h6.285v-5.876H21.45V25.09 	c0,0-3.426-1.962-3.685-3.656h0.64v-1.097h-0.523c0.287-0.733,0.96-1.649,1.732-3.09l0.385,0.551l1.132-0.797l-0.386-0.547 	c2.348-0.707,7.475-3.639,7.685-15.75L28.442,0H24.651z M4.971,1.383h1.011C6.077,1.88,6.302,2.317,6.648,2.67 	C7.34,3.375,8.333,3.588,8.965,3.654c0.369,5.33,1.352,8.889,2.373,11.373C9.329,14.291,5.323,11.553,4.971,1.383z M20.661,15.027 	c1.021-2.484,2.004-6.043,2.373-11.373c0.633-0.066,1.625-0.279,2.316-0.984c0.348-0.353,0.572-0.79,0.667-1.287h1.011 	C26.678,11.553,22.671,14.291,20.661,15.027z",
		 "Phone" : "M266.003,0H101.63C86.293,0,73.816,12.476,73.816,27.812v312.01c0,15.335,12.477,27.812,27.813,27.812h164.373 c15.337,0,27.814-12.477,27.814-27.812V27.812C293.816,12.476,281.34,0,266.003,0z M194.844,338.736 c0,2.175-1.763,3.938-3.938,3.938h-14.18c-2.175,0-3.938-1.763-3.938-3.938v-12.604c0-1.279,0.622-2.481,1.669-3.219l7.09-4.993 c1.362-0.959,3.175-0.959,4.537,0l7.09,4.993c1.047,0.737,1.669,1.939,1.669,3.219V338.736z M260.732,300.516H106.9V42.299h153.832 V300.516z",
		 "Antivirus" : "M 25.009766 0.5 C 16.257442 8.872401 4.5 7.6972656 4.5 7.6972656 C 4.5 7.6972656 4.6257553 25.957446 5.2851562 30.185547 C 6.8765661 40.389848 21.515286 50.535363 25.009766 49.414062 C 39.534556 44.753262 42.09247 35.149648 44.060547 29.623047 C 46.028634 24.096346 45.40625 7.921875 45.40625 7.921875 C 36.035319 8.4960751 25.009766 0.5 25.009766 0.5 z M 30.052734 18.40625 L 33.103516 21.300781 L 23.121094 31.59375 L 16.300781 24.75 L 19.240234 21.689453 L 23.066406 25.417969 L 30.052734 18.40625 z ",
		 "Airplane" : "M571.771,123.555c25.121-33.626,40.157-68.538,40.23-93.48c-0.031-8.077-1.651-14.389-4.733-19.091 	c-0.324-0.575-1.212-2.08-2.779-3.563c-1.558-1.546-2.958-2.372-3.261-2.539c-4.932-3.292-11.274-4.88-19.353-4.88 	c-24.88,0.042-59.802,15.068-93.438,40.23c-27.188,20.345-54.378,48.997-92.017,88.673c-6.385,6.729-13.104,13.804-20.21,21.223 	l-72.905-21.85l0.219-0.209c3.03-3.062,4.755-7.273,4.713-11.411c0.042-4.368-1.724-8.579-4.765-11.609l-13.166-13.187 	c-3.041-3.062-7.242-4.817-11.588-4.817c-4.389,0-8.485,1.693-11.547,4.786l-19.697,19.708l-10.429-3.114 	c2.247-2.853,3.49-6.416,3.448-9.927c0.042-4.431-1.672-8.558-4.754-11.62l-13.229-13.229c-3.02-3.03-7.2-4.765-11.588-4.765 	c-4.368,0-8.454,1.704-11.484,4.786l-18.077,18.067l-74.128-22.205c-1.661-0.491-3.417-0.752-5.298-0.752 	c-5.266,0.063-10.146,2.017-13.709,5.549l-26.061,26.071c-2.958,2.957-4.619,6.959-4.587,10.752 	c-0.094,5.59,2.999,10.752,7.952,13.406l155.884,87.085c0.763,0.428,2.968,2.059,3.783,2.874l44.441,44.431 	c-41.568,43.793-78.601,86.208-107.461,123.104c-2.696,3.428-5.246,6.771-7.754,10.084L33.827,381.185 	c-0.585-0.073-1.244-0.126-2.08-0.126c-5.528,0.115-10.93,2.3-14.942,6.176L4.652,399.377c-2.999,2.937-4.692,6.907-4.65,10.742 	c-0.094,5.852,3.448,11.264,8.767,13.636l84.838,40.293c0.731,0.366,2.633,1.714,3.25,2.33l7.043,6.991 	c-2.205,6.207-3.323,11.588-3.386,16.312c-0.021,6.321,2.017,11.734,5.915,15.632l0.303,0.262l0.083,0.062 	c4.002,3.877,9.185,5.852,15.601,5.852c4.619-0.073,9.948-1.17,16.176-3.364l7.147,7.137c0.554,0.585,1.881,2.445,2.226,3.187 	l40.209,84.651c2.456,5.402,7.753,8.902,13.521,8.902h0.083c3.992,0,7.806-1.599,10.721-4.524l12.445-12.487 	c3.688-3.887,5.862-9.247,5.945-14.9c0-0.689-0.031-1.223-0.052-1.516l-10.982-121.035c3.302-2.487,6.646-5.047,10.083-7.722 	c36.949-28.903,79.374-65.968,123.083-107.473l44.473,44.515c0.721,0.689,2.403,2.895,2.895,3.814l86.918,155.602 	c2.654,5.026,7.764,8.13,13.428,8.13c4.044,0,7.889-1.599,10.836-4.566l26.248-26.229c3.407-3.562,5.319-8.401,5.371-13.688 	c0-1.776-0.25-3.5-0.71-5.12l-22.205-74.149l18.066-18.098c3.041-3.021,4.766-7.221,4.766-11.536c0-4.337-1.683-8.412-4.744-11.516 	l-13.25-13.239c-3.03-3.041-7.221-4.775-11.536-4.775c-3.657,0-7.23,1.223-10.021,3.428l-3.104-10.387l19.718-19.718 	c3.03-3.041,4.755-7.242,4.755-11.568c0-4.357-1.683-8.442-4.755-11.504l-13.188-13.188c-3.041-3.083-7.262-4.828-11.599-4.828 	c-4.357,0-8.579,1.766-11.557,4.807l-0.136,0.125l-21.84-72.895c7.545-7.189,14.702-14.034,21.547-20.481 	C522.932,177.766,551.479,150.681,571.771,123.555z",
		 "Truck" : "M37.409,18.905l-4.946-7.924c-0.548-0.878-1.51-1.411-2.545-1.411H3c-1.657,0-3,1.343-3,3v16.86c0,1.657,1.343,3,3,3h0.787 	c0.758,1.618,2.391,2.75,4.293,2.75s3.534-1.132,4.292-2.75h20.007c0.758,1.618,2.391,2.75,4.293,2.75 	c1.9,0,3.534-1.132,4.291-2.75h0.787c1.656,0,3-1.343,3-3v-2.496C44.75,22.737,41.516,19.272,37.409,18.905z M8.087,32.395 	c-1.084,0-1.963-0.879-1.963-1.963s0.879-1.964,1.963-1.964s1.963,0.88,1.963,1.964S9.171,32.395,8.087,32.395z M26.042,21.001 	V15.57v-2.999h3.876l5.264,8.43H26.042z M36.671,32.395c-1.084,0-1.963-0.879-1.963-1.963s0.879-1.964,1.963-1.964 	s1.963,0.88,1.963,1.964S37.755,32.395,36.671,32.395z",
		 "Car" : "M43.782,17.795h-0.113L38.994,6.935C38.67,6.18,37.93,5.695,37.109,5.695H8.727c-0.82,0-1.56,0.485-1.883,1.239 		L2.165,17.795H2.051C0.917,17.795,0,18.712,0,19.846v3.398v8.996c0,1.133,0.917,2.051,2.051,2.051h0.771v3.797 		c0,1.134,0.916,2.053,2.051,2.053h4.93c1.132,0,2.051-0.919,2.051-2.053v-3.797H33.98v3.797c0,1.134,0.918,2.053,2.051,2.053h4.93 		c1.137,0,2.053-0.919,2.053-2.053v-3.797h0.771c1.134,0,2.052-0.918,2.052-2.051v-8.996v-3.398 		C45.834,18.712,44.916,17.795,43.782,17.795z M10.075,9.795h25.684l3.445,8H6.631L10.075,9.795z M8.879,30.049 		c-2.213,0-4.009-1.795-4.009-4.006c0-2.213,1.796-4.008,4.009-4.008c2.214,0,4.008,1.795,4.008,4.008 		C12.887,28.254,11.093,30.049,8.879,30.049z M36.91,30.049c-2.213,0-4.01-1.795-4.01-4.006c0-2.213,1.797-4.008,4.01-4.008 		c2.214,0,4.008,1.795,4.008,4.008C40.918,28.254,39.124,30.049,36.91,30.049z",
		 "Umbrella" : "M45.267,23.391C42.9,14.003,37.203,2.994,24.535,2.182V1.504C24.535,0.673,23.859,0,23.027,0 		c-0.83,0-1.506,0.673-1.506,1.504v0.673C8.235,2.944,3.166,13.982,0.793,23.391c-0.135,0.531,0.551,0.852,0.896,0.426 		c1.403-1.73,3.54-2.839,5.945-2.839c3.328,0,6.166,2.114,7.242,5.07c0.158,0.438,0.752,0.438,0.91,0 		c0.91-2.502,3.063-4.4,5.734-4.924v19.187c0,1.513-1.216,2.742-2.817,2.742c-1.515,0-2.73-1.229-2.73-2.742v-1.916 		c0-0.831-0.675-1.504-1.506-1.504s-1.507,0.673-1.507,1.504v1.916c0,3.173,2.571,5.75,5.83,5.75c3.173,0,5.744-2.577,5.744-5.75 		V21.126c2.668,0.529,4.829,2.424,5.737,4.921c0.159,0.439,0.769,0.439,0.928,0c1.076-2.957,3.915-5.07,7.243-5.07 		c2.405,0,4.534,1.109,5.938,2.839C44.727,24.242,45.403,23.922,45.267,23.391z",
		 "Drop" : "M41.834,0c0,0-28.514,39.405-28.514,55.151c0,15.749,12.767,28.518,28.514,28.518c15.749,0,28.514-12.769,28.514-28.518 	C70.348,39.405,41.834,0,41.834,0z M23.37,43.167c0,0-0.703,13.895,14.291,32.265C37.661,75.432,14.438,65.008,23.37,43.167z",
		 "Like" : "M457.575,325.1c9.8-12.5,14.5-25.9,13.9-39.7c-0.6-15.2-7.4-27.1-13-34.4c6.5-16.2,9-41.7-12.7-61.5c-15.9-14.5-42.9-21-80.3-19.2c-26.3,1.2-48.3,6.1-49.2,6.3h-0.1c-5,0.9-10.3,2-15.7,3.2c-0.4-6.4,0.7-22.3,12.5-58.1c14-42.6,13.2-75.2-2.6-97c-16.6-22.9-43.1-24.7-50.9-24.7c-7.5,0-14.4,3.1-19.3,8.8c-11.1,12.9-9.8,36.7-8.4,47.7c-13.2,35.4-50.2,122.2-81.5,146.3c-0.6,0.4-1.1,0.9-1.6,1.4c-9.2,9.7-15.4,20.2-19.6,29.4c-5.9-3.2-12.6-5-19.8-5h-61c-23,0-41.6,18.7-41.6,41.6v162.5c0,23,18.7,41.6,41.6,41.6h61c8.9,0,17.2-2.8,24-7.6l23.5,2.8c3.6,0.5,67.6,8.6,133.3,7.3c11.9,0.9,23.1,1.4,33.5,1.4c17.9,0,33.5-1.4,46.5-4.2c30.6-6.5,51.5-19.5,62.1-38.6c8.1-14.6,8.1-29.1,6.8-38.3c19.9-18,23.4-37.9,22.7-51.9C461.275,337.1,459.475,330.2,457.575,325.1z M48.275,447.3c-8.1,0-14.6-6.6-14.6-14.6V270.1c0-8.1,6.6-14.6,14.6-14.6h61c8.1,0,14.6,6.6,14.6,14.6v162.5c0,8.1-6.6,14.6-14.6,14.6h-61V447.3z M431.975,313.4c-4.2,4.4-5,11.1-1.8,16.3c0,0.1,4.1,7.1,4.6,16.7c0.7,13.1-5.6,24.7-18.8,34.6c-4.7,3.6-6.6,9.8-4.6,15.4c0,0.1,4.3,13.3-2.7,25.8c-6.7,12-21.6,20.6-44.2,25.4c-18.1,3.9-42.7,4.6-72.9,2.2c-0.4,0-0.9,0-1.4,0c-64.3,1.4-129.3-7-130-7.1h-0.1l-10.1-1.2c0.6-2.8,0.9-5.8,0.9-8.8V270.1c0-4.3-0.7-8.5-1.9-12.4c1.8-6.7,6.8-21.6,18.6-34.3c44.9-35.6,88.8-155.7,90.7-160.9c0.8-2.1,1-4.4,0.6-6.7c-1.7-11.2-1.1-24.9,1.3-29c5.3,0.1,19.6,1.6,28.2,13.5c10.2,14.1,9.8,39.3-1.2,72.7c-16.8,50.9-18.2,77.7-4.9,89.5c6.6,5.9,15.4,6.2,21.8,3.9c6.1-1.4,11.9-2.6,17.4-3.5c0.4-0.1,0.9-0.2,1.3-0.3c30.7-6.7,85.7-10.8,104.8,6.6c16.2,14.8,4.7,34.4,3.4,36.5c-3.7,5.6-2.6,12.9,2.4,17.4c0.1,0.1,10.6,10,11.1,23.3C444.875,295.3,440.675,304.4,431.975,313.4z",
		 "Dislike" : "M457.525,153.074c1.9-5.1,3.7-12,4.2-20c0.7-14.1-2.8-33.9-22.7-51.9c1.3-9.2,1.3-23.8-6.8-38.3   c-10.7-19.2-31.6-32.2-62.2-38.7c-20.5-4.4-47.4-5.3-80-2.8c-65.7-1.3-129.7,6.8-133.3,7.3l-23.5,2.8c-6.8-4.8-15.1-7.6-24-7.6h-61   c-23,0-41.6,18.7-41.6,41.6v162.5c0,23,18.7,41.6,41.6,41.6h61c7.2,0,13.9-1.8,19.8-5c4.2,9.2,10.4,19.7,19.6,29.4   c0.5,0.5,1,1,1.6,1.4c31.4,24.1,68.4,110.9,81.5,146.3c-1.3,11-2.6,34.8,8.4,47.7c4.9,5.7,11.7,8.8,19.3,8.8   c7.7,0,34.3-1.8,50.9-24.7c15.7-21.8,16.6-54.4,2.6-97c-11.8-35.8-12.9-51.7-12.5-58.1c5.4,1.2,10.7,2.3,15.8,3.2h0.1   c0.9,0.2,22.9,5.1,49.2,6.3c37.4,1.8,64.5-4.7,80.3-19.2c21.8-19.9,19.2-45.3,12.7-61.5c5.6-7.3,12.4-19.2,13-34.4   C471.925,178.974,467.325,165.674,457.525,153.074z M109.225,222.674h-61c-8.1,0-14.6-6.6-14.6-14.6v-162.5   c0-8.1,6.6-14.6,14.6-14.6h61c8.1,0,14.6,6.6,14.6,14.6v162.5C123.825,216.174,117.325,222.674,109.225,222.674z M430.925,232.374   c0,0.1,3.5,5.6,4.7,13.1c1.5,9.3-1.1,17-8.1,23.4c-19.1,17.4-74.1,13.4-104.8,6.6c-0.4-0.1-0.8-0.2-1.3-0.3   c-5.5-1-11.4-2.2-17.4-3.5c-6.4-2.3-15.2-2-21.8,3.9c-13.3,11.8-11.8,38.6,4.9,89.5c11,33.4,11.4,58.6,1.2,72.7   c-8.6,11.9-22.8,13.4-28.2,13.5c-2.4-4-3.1-17.7-1.3-29c0.3-2.2,0.1-4.5-0.6-6.7c-1.9-5.1-45.8-125.3-90.7-160.9   c-11.7-12.7-16.8-27.6-18.6-34.3c1.2-3.9,1.9-8.1,1.9-12.4v-162.4c0-3-0.3-6-0.9-8.8l10.1-1.2h0.1c0.6-0.1,65.7-8.5,130-7.1   c0.4,0,0.9,0,1.4,0c30.3-2.4,54.8-1.7,72.9,2.2c22.4,4.8,37.2,13.2,44,25.1c7.1,12.3,3.2,25,2.9,26.2c-2.1,5.6-0.2,11.7,4.6,15.3   c29.6,22.2,16,48.1,14.2,51.3c-3.3,5.2-2.5,11.8,1.8,16.3c8.6,9,12.8,18,12.5,26.8c-0.4,13.1-10.5,22.9-11.2,23.5   C428.225,219.474,427.325,226.774,430.925,232.374z",
		 "UpArrow" : "M.512 .32l-.480 .480h.288v.512h.384v-.512h.288z",
		 "DownArrow" : "M.512 .992l.480-.480h-.288v-.512h-.384v.512h-.288z",
		 "marker" : "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z",
		 "Happy" : "M60,2.5C28.2,2.5,2.5,28.2,2.5,60s25.7,57.5,57.5,57.5s57.5-25.7,57.5-57.5S91.7,2.5,60,2.5z M90.2,25.7c0,0-12.1-12.6-25.7,0.8C64.6,26.5,76.7,0.5,90.2,25.7z M77.8,32.4c8,0,14.6,6.5,14.6,14.6s-6.5,14.6-14.6,14.6S63.2,55,63.2,47S69.8,32.4,77.8,32.4z M52.2,26.7c0,0-12.1-12.6-25.7,0.8C26.6,27.5,38.7,1.5,52.2,26.7z M39.8,32.4c8,0,14.6,6.5,14.6,14.6s-6.5,14.6-14.6,14.6S25.2,55,25.2,47S31.8,32.4,39.8,32.4z M12.1,56.3c0,0,45.3,49.3,95.1-0.3C107.2,56,62.9,178.6,12.1,56.3z",
		 "Angry" : "M60,2.5C28.2,2.5,2.5,28.2,2.5,60s25.7,57.5,57.5,57.5s57.5-25.7,57.5-57.5S91.7,2.5,60,2.5z M25.2,41.9c0-7.8,6.3-14.1,14.1-14.1s14.1,6.3,14.1,14.1S47.1,56,39.3,56S25.2,49.7,25.2,41.9z M34.2,84.7c28.4-38,52.2,3.3,52.2,3.3C61.5,70.8,34.2,84.7,34.2,84.7z M79.3,56c-7.8,0-14.1-6.3-14.1-14.1s6.3-14.1,14.1-14.1s14.1,6.3,14.1,14.1S87.1,56,79.3,56z",
		 "Depressed" : "M246.613,0.001C110.412,0.001,0,110.412,0,246.613c0,64.084,24.448,122.452,64.518,166.304v0.002h0.002    c45.094,49.346,109.976,80.305,182.092,80.305c136.2,0,246.613-110.412,246.613-246.613S382.812,0.001,246.613,0.001z     M343.238,128.734c21.127,0,38.256,17.128,38.256,38.256s-17.129,38.256-38.256,38.256s-38.256-17.128-38.256-38.256    S322.111,128.734,343.238,128.734z M146.495,128.734c21.127,0,38.256,17.128,38.256,38.256s-17.129,38.256-38.256,38.256    s-38.256-17.128-38.256-38.256S125.368,128.734,146.495,128.734z M354.124,370.564c-26.055-30.125-64.557-49.186-107.512-49.186    s-81.456,19.061-107.512,49.186H92.013c31.553-52.393,88.981-87.441,154.6-87.441s123.046,35.048,154.6,87.441H354.124z",
		 "Nervous" : "M239.062,0C107.1,0,0,107.1,0,239.062c0,131.963,107.1,239.062,239.062,239.062c131.963,0,239.062-107.1,239.062-239.062   C478.125,107.1,371.025,0,239.062,0z M97.538,156.825l63.112-42.075l11.475,15.3L107.1,172.125L97.538,156.825z M172.125,191.25   c0,11.475-7.65,19.125-19.125,19.125s-19.125-7.65-19.125-19.125s7.65-19.125,19.125-19.125S172.125,179.775,172.125,191.25z    M344.25,363.375c0,0-38.25-38.25-105.188-38.25s-105.188,38.25-105.188,38.25V344.25c0,0,38.25-38.25,105.188-38.25   s105.188,38.25,105.188,38.25V363.375z M325.125,210.375c-11.475,0-19.125-7.65-19.125-19.125s7.65-19.125,19.125-19.125   s19.125,7.65,19.125,19.125S336.6,210.375,325.125,210.375z M371.025,172.125l-63.113-42.075l11.476-15.3l63.112,42.075   L371.025,172.125z",
		 "Sad" : "M60,2.5C28.2,2.5,2.5,28.2,2.5,60s25.7,57.5,57.5,57.5s57.5-25.7,57.5-57.5S91.7,2.5,60,2.5z M25.1,61.2c-4.3-2.3,0.3-11.1,0.3-11.1C31.6,61.3,25.1,61.2,25.1,61.2z M27.2,51.2c-1.2-2.1-1.8-4.5-1.8-7c0-7.9,6.4-14.4,14.4-14.4c7.9,0,14.4,6.4,14.4,14.4c0,2.5-0.7,4.9-1.8,7c-2.5-4.4-7.2-7.4-12.6-7.4C34.3,43.8,29.6,46.8,27.2,51.2z M33.4,82.2c29.7-37.1,52.9,4,52.9,4C66.9,68.6,33.4,82.2,33.4,82.2z M77.7,43.8c-5.4,0-10.1,3-12.6,7.4c-1.2-2.1-1.8-4.5-1.8-7c0-7.9,6.4-14.4,14.4-14.4c7.9,0,14.4,6.4,14.4,14.4c0,2.5-0.7,4.9-1.8,7C87.8,46.8,83.1,43.8,77.7,43.8z M94.9,75.2c-8.4,0.6-1.6-23.5-1.6-23.5C102.6,75.4,94.9,75.2,94.9,75.2z",
		 "Alert" : "M60,2.5C28.2,2.5,2.5,28.2,2.5,60s25.7,57.5,57.5,57.5s57.5-25.7,57.5-57.5C117.5,28.3,91.7,2.5,60,2.5zM92.9,23.8C81.5,12.7,67,24.6,67,24.6C81-0.2,92.9,23.8,92.9,23.8z M51.9,23.8C40.5,12.7,26,24.6,26,24.6C40-0.2,51.9,23.8,51.9,23.8z M40.8,31.4c8,0,14.6,6.5,14.6,14.6s-6.5,14.6-14.6,14.6S26.2,54.1,26.2,46S32.8,31.4,40.8,31.4zM90.3,87.7h-61v-8h61V87.7z M79.8,60.5c-8,0-14.6-6.5-14.6-14.6s6.5-14.6,14.6-14.6s14.6,6.5,14.6,14.6S87.8,60.5,79.8,60.5z",
		 "Calm" : "M60,2.5C28.2,2.5,2.5,28.2,2.5,60s25.7,57.5,57.5,57.5s57.5-25.7,57.5-57.5S91.7,2.5,60,2.5z M40.6,29.3c8.1,0,14.6,6.5,14.6,14.6s-6.5,14.6-14.6,14.6S26,52,26,43.9C26,35.9,32.5,29.3,40.6,29.3z M90.8,84.2h-62v-7h62V84.2z M79.6,58.5C71.5,58.5,65,52,65,43.9s6.5-14.6,14.6-14.6s14.6,6.5,14.6,14.6S87.7,58.5,79.6,58.5z"
 };
 var svg_set = {
		 'angry' : '<svg xmlns:dc=\"http:\/\/purl.org\/dc\/elements\/1.1\/\" xmlns:cc=\"http:\/\/creativecommons.org\/ns#\" xmlns:rdf=\"http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#\" xmlns:svg=\"http:\/\/www.w3.org\/2000\/svg\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:sodipodi=\"http:\/\/sodipodi.sourceforge.net\/DTD\/sodipodi-0.dtd\" xmlns:inkscape=\"http:\/\/www.inkscape.org\/namespaces\/inkscape\" width=\"500\" height=\"500\" id=\"svg11996\" version=\"1.1\" inkscape:version=\"0.48.5 r10040\" sodipodi:docname=\"angry.svg\"><defs id=\"defs11998\" \/><sodipodi:namedview id=\"base\" pagecolor=\"#ffffff\" bordercolor=\"#666666\" borderopacity=\"1.0\" inkscape:pageopacity=\"0.0\" inkscape:pageshadow=\"2\" inkscape:zoom=\"0.4\" inkscape:cx=\"425.81035\" inkscape:cy=\"164.93976\" inkscape:document-units=\"px\" inkscape:current-layer=\"layer1\" showgrid=\"false\" inkscape:window-width=\"1366\" inkscape:window-height=\"706\" inkscape:window-x=\"-8\" inkscape:window-y=\"-8\" inkscape:window-maximized=\"1\" \/><metadata id=\"metadata12001\"><rdf:RDF><cc:Work rdf:about=\"\"><dc:format>image\/svg+xml<\/dc:format><dc:type rdf:resource=\"http:\/\/purl.org\/dc\/dcmitype\/StillImage\" \/><dc:title><\/dc:title><\/cc:Work><\/rdf:RDF><\/metadata><g inkscape:label=\"Layer 1\" inkscape:groupmode=\"layer\" id=\"layer1\" transform=\"translate(0,-552.36218)\"><path sodipodi:type=\"arc\" style=\"fill:#cb16cd;fill-opacity:1;fill-rule:evenodd;stroke:none\" id=\"path12572\" sodipodi:cx=\"-546.32031\" sodipodi:cy=\"247.6154\" sodipodi:rx=\"287.78\" sodipodi:ry=\"255.46246\" d=\"m -258.54031,247.6154 a 287.78,255.46246 0 1 1 -575.56,0 287.78,255.46246 0 1 1 575.56,0 z\" transform=\"matrix(0.81619453,0,0,0.91943238,699.20034,577.55963)\" \/><path sodipodi:nodetypes=\"sssssssssssssssssss\" style=\"fill:none;stroke:none;stroke-width:9.83306598999999970;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;fill-opacity:1\" id=\"path3111-1\" d=\"m 254.2852,579.18507 c -126.99959,0 -230.32355,103.32294 -230.32355,230.32251 0,126.99448 103.32396,230.31742 230.32355,230.31742 126.99957,0 230.32458,-103.32192 230.32458,-230.32355 0,-126.99957 -103.32501,-230.31638 -230.32458,-230.31638 z m 0,437.73683 c -114.36728,0 -207.419438,-93.04501 -207.419438,-207.41943 0,-114.37442 93.052158,-207.41329 207.419438,-207.41329 114.36931,0 207.41844,93.045 207.41844,207.41944 0,114.36827 -93.05016,207.41328 -207.41844,207.41328 z m 95.56001,-86.2909 c 0,4.74249 -3.83607,8.58879 -8.58775,8.58879 -4.74249,0 -8.58879,-3.84734 -8.58879,-8.58879 0,-40.25949 -33.66226,-62.34179 -77.75783,-62.34179 -44.09558,0 -80.76879,22.0823 -80.76879,62.34179 0,4.74249 -3.84527,8.58879 -8.5898,8.58879 -4.74759,0 -8.58878,-3.84734 -8.58878,-8.58879 0,-49.73116 44.38216,-79.51935 97.94737,-79.51935 53.56521,0 94.93437,29.78819 94.93437,79.51935 z\" inkscape:connector-curvature=\"0\" \/><g transform=\"matrix(0.62352854,0,0,0.62352854,99.459473,666.82165)\" id=\"g3109\" style=\"fill:#ffffff;stroke:#ffffff;stroke-width:6.41510344;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none\"><path inkscape:connector-curvature=\"0\" d=\"m 63.764561,162.97797 c 0,-31.09793 9.663208,-57.7992 23.506009,-69.582499 C 46.51953,72.403278 7.8734281,42.501682 4.479612,3.6536675 3.8048868,-4.1267036 9.5526699,-10.990055 17.341454,-11.668145 25.110047,-12.320996 31.981811,-6.5984519 32.663267,1.180237 37.090204,51.93942 148.62008,91.57826 191.22367,102.57073 c 0.29109,0.0774 0.55021,0.20695 0.82952,0.30287 0.47114,0.16153 0.94395,0.30791 1.38647,0.51655 0.42402,0.18846 0.81943,0.40383 1.21485,0.62089 0.3954,0.23051 0.78409,0.4644 1.16941,0.71847 0.39709,0.28604 0.75549,0.59396 1.11556,0.90692 0.32979,0.281 0.64949,0.57545 0.96246,0.89347 0.34997,0.36848 0.65621,0.7639 0.97086,1.16941 0.17667,0.22715 0.38532,0.42401 0.55694,0.66463 0.0706,0.11778 0.11778,0.24398 0.19686,0.36176 0.27091,0.42738 0.48796,0.87159 0.70334,1.32253 0.20022,0.39541 0.3954,0.78241 0.55694,1.18792 0.16153,0.42233 0.26417,0.85981 0.38868,1.30233 0.12283,0.45094 0.26081,0.89179 0.3382,1.35786 0.0673,0.41561 0.0824,0.84636 0.12115,1.28047 0.0387,0.493 0.0858,0.98096 0.0774,1.46387 -0.0101,0.39541 -0.0774,0.79083 -0.12451,1.18792 -0.0555,0.54853 -0.1262,1.0735 -0.24566,1.60184 -0.0269,0.12451 -0.0186,0.24398 -0.0539,0.36849 -0.0319,0.13293 -0.12619,0.22547 -0.16153,0.34998 -0.39709,1.38647 -0.96244,2.72919 -1.77178,3.95077 -0.0387,0.064 -0.0976,0.10936 -0.13292,0.17835 -0.7454,1.06341 -1.66915,2.02586 -2.71742,2.8823 -0.19686,0.16994 -0.37858,0.33148 -0.57376,0.48291 -0.15648,0.10937 -0.28099,0.25239 -0.44421,0.36849 l -40.66354,-6.72706 c -6.64799,-2.18571 -14.08679,-4.79711 -21.96643,-7.76691 5.911,13.30437 9.50673,30.56454 9.50673,49.47031 0,41.98439 -17.61521,76.03361 -39.34944,76.03361 -21.735904,-0.002 -39.349426,-34.04922 -39.349426,-76.04371 z M 478.38567,3.6536675 c -3.38709,38.8412835 -42.03992,68.7597055 -82.79096,89.7418035 13.84617,11.784979 23.5161,38.486249 23.5161,69.582499 0,41.99449 -17.62361,76.04203 -39.35279,76.04203 -21.72918,0 -39.34439,-34.04754 -39.34439,-76.04203 0,-18.90577 3.60583,-36.16594 9.51178,-49.47031 -7.87964,2.9698 -15.31845,5.57784 -21.96643,7.76524 l -40.67196,6.72537 c -0.15648,-0.11442 -0.28435,-0.25576 -0.44084,-0.36681 -0.1935,-0.15143 -0.38532,-0.31296 -0.5805,-0.48291 -1.05162,-0.85644 -1.97201,-1.81048 -2.70731,-2.8823 -0.0353,-0.0706 -0.0976,-0.11442 -0.13797,-0.18004 -0.80934,-1.21989 -1.37133,-2.55419 -1.77684,-3.94908 -0.037,-0.1161 -0.10768,-0.21537 -0.15648,-0.34157 -0.0302,-0.12451 -0.0302,-0.24397 -0.0555,-0.36849 -0.1161,-0.52834 -0.1935,-1.05331 -0.24903,-1.60183 -0.0353,-0.39542 -0.10937,-0.79083 -0.11778,-1.18792 -0.007,-0.49132 0.0269,-0.98097 0.0824,-1.46388 0.0202,-0.43243 0.0353,-0.86485 0.11273,-1.28046 0.0807,-0.4644 0.22211,-0.90692 0.34662,-1.35786 0.11947,-0.44253 0.22211,-0.88001 0.38531,-1.30234 0.15817,-0.4055 0.37018,-0.79251 0.55695,-1.18792 0.22042,-0.45093 0.43243,-0.89346 0.69997,-1.32253 0.079,-0.11946 0.1161,-0.24397 0.19686,-0.36176 0.17162,-0.24061 0.38363,-0.43579 0.55526,-0.66462 0.31633,-0.40551 0.62425,-0.80093 0.97422,-1.16941 0.31466,-0.31633 0.6293,-0.60238 0.95741,-0.89347 0.37186,-0.31296 0.73867,-0.61247 1.12398,-0.90692 0.3685,-0.2524 0.77232,-0.48796 1.16268,-0.71848 0.40046,-0.21706 0.78747,-0.44252 1.21148,-0.62088 0.46103,-0.19855 0.92039,-0.35503 1.38983,-0.51657 0.28941,-0.0976 0.54349,-0.22546 0.83121,-0.30286 42.59855,-10.994149 154.13515,-50.631305 158.55535,-101.3904884 0.68314,-7.7803721 7.55154,-13.5113286 15.32014,-12.8483816 7.79214,0.679773 13.54161,7.5448064 12.85848,15.3251775 z M 403.86136,432.33463 c 0,7.80898 -6.31651,14.14231 -14.14063,14.14231 -7.80897,0 -14.14231,-6.33502 -14.14231,-14.14231 0,-66.29132 -59.06957,-120.20875 -131.6774,-120.20875 -72.60782,0 -131.67067,53.91743 -131.67067,120.20875 0,7.80898 -6.33164,14.14231 -14.143986,14.14231 -7.817389,0 -14.142306,-6.33502 -14.142306,-14.14231 0,-81.88739 71.756422,-148.49337 159.956962,-148.49337 88.20054,0 159.96034,66.60598 159.96034,148.49337 z\" id=\"path3111\" style=\"fill:#ffffff;stroke:#ffffff;stroke-width:16.19113922;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none\" sodipodi:nodetypes=\"scccccccccccccccccccccccccccccccscsccsssccccccccccccccccccccccccccccccsssssssss\" \/><\/g><\/g><\/svg>',
		 'happy' : '<svg id=\"svg11996\" xmlns:inkscape=\"http:\/\/www.inkscape.org\/namespaces\/inkscape\" xmlns:rdf=\"http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" sodipodi:docname=\"happy.svg\" viewBox=\"0 0 500 500\" version=\"1.1\" xmlns:cc=\"http:\/\/creativecommons.org\/ns#\" xmlns:dc=\"http:\/\/purl.org\/dc\/elements\/1.1\/\" inkscape:version=\"0.48.5 r10040\" xmlns:sodipodi=\"http:\/\/sodipodi.sourceforge.net\/DTD\/sodipodi-0.dtd\"><sodipodi:namedview id=\"base\" bordercolor=\"#666666\" inkscape:pageshadow=\"2\" inkscape:window-y=\"-8\" pagecolor=\"#ffffff\" inkscape:window-height=\"706\" inkscape:window-maximized=\"1\" inkscape:zoom=\"0.2\" inkscape:window-x=\"-8\" showgrid=\"false\" borderopacity=\"1.0\" inkscape:current-layer=\"layer1\" inkscape:cx=\"327.64055\" inkscape:cy=\"137.27022\" inkscape:window-width=\"1366\" inkscape:pageopacity=\"0.0\" inkscape:document-units=\"px\"\/><metadata id=\"metadata12001\"><rdf:RDF><cc:Work rdf:about=\"\"><dc:format>image\/svg+xml<\/dc:format><dc:type rdf:resource=\"http:\/\/purl.org\/dc\/dcmitype\/StillImage\"\/><dc:title\/><\/cc:Work><\/rdf:RDF><\/metadata><g id=\"layer1\" inkscape:label=\"Layer 1\" inkscape:groupmode=\"layer\" transform=\"translate(0,-552.36218)\"><path id=\"path12572\" sodipodi:rx=\"287.78\" sodipodi:ry=\"255.46246\" sodipodi:type=\"arc\" d=\"m-258.54,247.62c0,141.09-128.84,255.46-287.78,255.46s-287.78-114.37-287.78-255.46,128.84-255.46,287.78-255.46,287.78,114.37,287.78,255.46z\" fill-rule=\"evenodd\" transform=\"matrix(0.81619453,0,0,0.91943238,699.20034,577.55963)\" sodipodi:cy=\"247.6154\" sodipodi:cx=\"-546.32031\" fill=\"#0daea7\"\/><path id=\"path3111-1\" d=\"m254.29,579.19c-127,0-230.32,103.32-230.32,230.32,0,126.99,103.32,230.32,230.32,230.32s230.32-103.32,230.32-230.32-103.33-230.32-230.32-230.32zm0,437.74c-114.37,0-207.42-93.045-207.42-207.42,0-114.37,93.052-207.41,207.42-207.41s207.42,93.045,207.42,207.42c0,114.37-93.05,207.41-207.42,207.41zm95.56-86.291c0,4.7425-3.8361,8.5888-8.5878,8.5888-4.7425,0-8.5888-3.8473-8.5888-8.5888,0-40.259-33.662-62.342-77.758-62.342s-80.769,22.082-80.769,62.342c0,4.7425-3.8453,8.5888-8.5898,8.5888-4.7476,0-8.5888-3.8473-8.5888-8.5888,0-49.731,44.382-79.519,97.947-79.519s94.934,29.788,94.934,79.519z\" sodipodi:nodetypes=\"sssssssssssssssssss\" inkscape:connector-curvature=\"0\" fill=\"none\"\/><g id=\"g4447\" fill-rule=\"evenodd\" transform=\"translate(422.29841,170.19693)\" stroke=\"#FFF\" stroke-miterlimit=\"4\" stroke-dasharray=\"none\" stroke-width=\"4\" fill=\"#FFF\"><path id=\"path4549\" sodipodi:rx=\"18.354431\" sodipodi:ry=\"27.848101\" sodipodi:type=\"arc\" d=\"m654.43,260.76c0,15.38-8.2176,27.848-18.354,27.848-10.137,0-18.354-12.468-18.354-27.848s8.2176-27.848,18.354-27.848c10.137,0,18.354,12.468,18.354,27.848z\" transform=\"matrix(1.8845447,0,0,1.8205129,-1472.4599,51.489403)\" sodipodi:cy=\"260.75949\" sodipodi:cx=\"636.07593\"\/><path id=\"path4551\" sodipodi:rx=\"18.354431\" sodipodi:ry=\"27.848101\" sodipodi:type=\"arc\" d=\"m654.43,260.76c0,15.38-8.2176,27.848-18.354,27.848-10.137,0-18.354-12.468-18.354-27.848s8.2176-27.848,18.354-27.848c10.137,0,18.354,12.468,18.354,27.848z\" transform=\"matrix(1.8845447,0,0,1.8205129,-1272.2034,51.489403)\" sodipodi:cy=\"260.75949\" sodipodi:cx=\"636.07593\"\/><\/g><g id=\"g3027\" fill=\"#FFF\" transform=\"matrix(1.109375,0,0,1.109375,995.73301,490.26469)\"><path id=\"path3029-9\" d=\"m-672.21,305.92c57.975,0,113.12-15.403,160-42.46-7.287,89.219-76.564,159.08-160,159.08-83.434,0-152.71-69.936-160-159.15,46.885,27.056,102.02,42.532,160,42.532z\" sodipodi:nodetypes=\"scscs\" inkscape:connector-curvature=\"0\" fill=\"#FFF\"\/><\/g><\/g><\/svg>',
		 'relax' : '<svg id=\"svg11996\" xmlns:inkscape=\"http:\/\/www.inkscape.org\/namespaces\/inkscape\" xmlns:rdf=\"http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" sodipodi:docname=\"relax.svg\" viewBox=\"0 0 500 500\" version=\"1.1\" xmlns:cc=\"http:\/\/creativecommons.org\/ns#\" xmlns:dc=\"http:\/\/purl.org\/dc\/elements\/1.1\/\" inkscape:version=\"0.48.5 r10040\" xmlns:sodipodi=\"http:\/\/sodipodi.sourceforge.net\/DTD\/sodipodi-0.dtd\"><sodipodi:namedview id=\"base\" bordercolor=\"#666666\" inkscape:pageshadow=\"2\" inkscape:window-y=\"-8\" pagecolor=\"#ffffff\" inkscape:window-height=\"706\" inkscape:window-maximized=\"1\" inkscape:zoom=\"0.27718586\" inkscape:window-x=\"-8\" showgrid=\"false\" borderopacity=\"1.0\" inkscape:current-layer=\"layer1\" inkscape:cx=\"402.01484\" inkscape:cy=\"112.24501\" inkscape:window-width=\"1366\" inkscape:pageopacity=\"0.0\" inkscape:document-units=\"px\"\/><metadata id=\"metadata12001\"><rdf:RDF><cc:Work rdf:about=\"\"><dc:format>image\/svg+xml<\/dc:format><dc:type rdf:resource=\"http:\/\/purl.org\/dc\/dcmitype\/StillImage\"\/><dc:title\/><\/cc:Work><\/rdf:RDF><\/metadata><g id=\"layer1\" inkscape:label=\"Layer 1\" inkscape:groupmode=\"layer\" transform=\"translate(0,-552.36218)\"><path id=\"path12572\" sodipodi:rx=\"287.78\" sodipodi:ry=\"255.46246\" sodipodi:type=\"arc\" d=\"m-258.54,247.62c0,141.09-128.84,255.46-287.78,255.46s-287.78-114.37-287.78-255.46,128.84-255.46,287.78-255.46,287.78,114.37,287.78,255.46z\" fill-rule=\"evenodd\" transform=\"matrix(0.81619453,0,0,0.91943238,699.20034,577.55963)\" sodipodi:cy=\"247.6154\" sodipodi:cx=\"-546.32031\" fill=\"#464692\"\/><path id=\"path3111-1\" d=\"m254.29,579.19c-127,0-230.32,103.32-230.32,230.32,0,126.99,103.32,230.32,230.32,230.32s230.32-103.32,230.32-230.32-103.33-230.32-230.32-230.32zm0,437.74c-114.37,0-207.42-93.045-207.42-207.42,0-114.37,93.052-207.41,207.42-207.41s207.42,93.045,207.42,207.42c0,114.37-93.05,207.41-207.42,207.41zm95.56-86.291c0,4.7425-3.8361,8.5888-8.5878,8.5888-4.7425,0-8.5888-3.8473-8.5888-8.5888,0-40.259-33.662-62.342-77.758-62.342s-80.769,22.082-80.769,62.342c0,4.7425-3.8453,8.5888-8.5898,8.5888-4.7476,0-8.5888-3.8473-8.5888-8.5888,0-49.731,44.382-79.519,97.947-79.519s94.934,29.788,94.934,79.519z\" sodipodi:nodetypes=\"sssssssssssssssssss\" inkscape:connector-curvature=\"0\" fill=\"none\"\/><path id=\"path3111-1-5\" d=\"m104.72,867.54c-3.3009,29.748,17.216,63.274,27.807,69.601,10.591,6.3274,17.226-11.254,10.43-16.924-6.7954-5.6692-20.227-29.07-17.759-51.31,2.3647-21.311,16.225-38.707,23.502-42.681,7.2769-3.9732,1.2314-14.395-9.776-10.425-11.007,3.9694-31.018,23.036-34.203,51.738z\" sodipodi:nodetypes=\"szzszzs\" inkscape:connector-curvature=\"0\" fill=\"#FFF\"\/><path id=\"path4681\" d=\"m223.21,668.92c-25.062,19.233-35.589,59.361-32.665,72.05,2.9244,12.689,22.685,8.3527,22.034-0.96523-0.65115-9.318,5.6195-38.706,24.356-53.085,17.954-13.778,42.153-14.887,50.498-12.251,8.3445,2.6359,20.914-13.232,9.8458-18.711-11.069-5.4788-49.889-5.5944-74.069,12.962z\" sodipodi:nodetypes=\"szzszzs\" inkscape:connector-curvature=\"0\" fill=\"#FFF\"\/><rect id=\"rect4705\" transform=\"matrix(0.51808014,-0.85533208,0.85533208,0.51808014,0,0)\" fill-rule=\"evenodd\" ry=\"15.026\" height=\"30.053\" width=\"86.151\" y=\"591\" x=\"-703.62\" fill=\"#FFF\"\/><rect id=\"rect4707\" transform=\"matrix(0.51808014,-0.85533208,0.85533208,0.51808014,0,0)\" fill-rule=\"evenodd\" ry=\"15.026\" height=\"30.053\" width=\"86.151\" y=\"591\" x=\"-523.15\" fill=\"#FFF\"\/><path id=\"path12574\" d=\"m378.77,907.71c30.982-42.57,13.88-100.75-8.2137-121.88-22.093-21.134-46.64-5.8459-30.284,13.258s34.898,50.093,7.0208,88.397c-26.113,35.879-60.354,38.789-81.875,32.408-21.521-6.3809-33.845,15.423-8.3971,27.253,25.448,11.831,90.767,3.1372,121.75-39.433z\" fill-rule=\"evenodd\" sodipodi:nodetypes=\"szzszzs\" inkscape:connector-curvature=\"0\" fill=\"#FFF\"\/><\/g><\/svg>',
		 'tension' : '<svg id=\"svg11996\" xmlns:inkscape=\"http:\/\/www.inkscape.org\/namespaces\/inkscape\" xmlns:rdf=\"http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" sodipodi:docname=\"tension.svg\" viewBox=\"0 0 500 500\" version=\"1.1\" xmlns:cc=\"http:\/\/creativecommons.org\/ns#\" xmlns:dc=\"http:\/\/purl.org\/dc\/elements\/1.1\/\" inkscape:version=\"0.48.5 r10040\" xmlns:sodipodi=\"http:\/\/sodipodi.sourceforge.net\/DTD\/sodipodi-0.dtd\"><sodipodi:namedview id=\"base\" bordercolor=\"#666666\" inkscape:pageshadow=\"2\" inkscape:window-y=\"-8\" pagecolor=\"#ffffff\" inkscape:window-height=\"706\" inkscape:window-maximized=\"1\" inkscape:zoom=\"0.20526726\" inkscape:window-x=\"-8\" showgrid=\"false\" borderopacity=\"1.0\" inkscape:current-layer=\"layer1\" inkscape:cx=\"312.07688\" inkscape:cy=\"219.87488\" inkscape:window-width=\"1366\" inkscape:pageopacity=\"0.0\" inkscape:document-units=\"px\"\/><metadata id=\"metadata12001\"><rdf:RDF><cc:Work rdf:about=\"\"><dc:format>image\/svg+xml<\/dc:format><dc:type rdf:resource=\"http:\/\/purl.org\/dc\/dcmitype\/StillImage\"\/><dc:title\/><\/cc:Work><\/rdf:RDF><\/metadata><g id=\"layer1\" inkscape:label=\"Layer 1\" inkscape:groupmode=\"layer\" transform=\"translate(0,-552.36218)\"><path id=\"path12572\" sodipodi:rx=\"287.78\" sodipodi:ry=\"255.46246\" sodipodi:type=\"arc\" d=\"m-258.54,247.62c0,141.09-128.84,255.46-287.78,255.46s-287.78-114.37-287.78-255.46,128.84-255.46,287.78-255.46,287.78,114.37,287.78,255.46z\" fill-rule=\"evenodd\" transform=\"matrix(0.81619453,0,0,0.91943238,699.20034,577.55963)\" sodipodi:cy=\"247.6154\" sodipodi:cx=\"-546.32031\" fill=\"#df2327\"\/><path id=\"path3111-1\" d=\"m254.29,579.19c-127,0-230.32,103.32-230.32,230.32,0,126.99,103.32,230.32,230.32,230.32s230.32-103.32,230.32-230.32-103.33-230.32-230.32-230.32zm0,437.74c-114.37,0-207.42-93.045-207.42-207.42,0-114.37,93.052-207.41,207.42-207.41s207.42,93.045,207.42,207.42c0,114.37-93.05,207.41-207.42,207.41zm95.56-86.291c0,4.7425-3.8361,8.5888-8.5878,8.5888-4.7425,0-8.5888-3.8473-8.5888-8.5888,0-40.259-33.662-62.342-77.758-62.342s-80.769,22.082-80.769,62.342c0,4.7425-3.8453,8.5888-8.5898,8.5888-4.7476,0-8.5888-3.8473-8.5888-8.5888,0-49.731,44.382-79.519,97.947-79.519s94.934,29.788,94.934,79.519z\" sodipodi:nodetypes=\"sssssssssssssssssss\" inkscape:connector-curvature=\"0\" fill=\"none\"\/><path id=\"path4407\" sodipodi:rx=\"12.630971\" sodipodi:ry=\"12.298577\" sodipodi:type=\"arc\" d=\"m230.02,270.4a12.631,12.299,0,1,1,-25.262,0,12.631,12.299,0,1,1,25.262,0z\" fill-rule=\"evenodd\" transform=\"matrix(2.8623652,0,0,2.9397262,-449.40842,-35.566626)\" sodipodi:cy=\"270.3952\" sodipodi:cx=\"217.38567\" fill=\"#FFF\"\/><path id=\"path4409\" sodipodi:rx=\"12.630971\" sodipodi:ry=\"12.298577\" sodipodi:type=\"arc\" d=\"m230.02,270.4a12.631,12.299,0,1,1,-25.262,0,12.631,12.299,0,1,1,25.262,0z\" fill-rule=\"evenodd\" transform=\"matrix(2.8623653,0,0,2.9397262,-300.56341,-35.566641)\" sodipodi:cy=\"270.3952\" sodipodi:cx=\"217.38567\" fill=\"#FFF\"\/><rect id=\"rect4434\" ry=\"15.045\" fill-rule=\"evenodd\" transform=\"matrix(0.53505237,0.84481889,-0.78955328,0.61368201,0,0)\" height=\"104.31\" width=\"30.639\" y=\"207.2\" x=\"632.87\" fill=\"#FFF\"\/><rect id=\"rect4440\" transform=\"matrix(0.63663123,-0.77116838,0.77116838,0.63663123,0,0)\" fill-rule=\"evenodd\" ry=\"15.104\" height=\"104.72\" width=\"29.708\" y=\"686.27\" x=\"-333.28\" fill=\"#FFF\"\/><path id=\"path12574\" d=\"m251.93,858.59c-52.612-2.028-95.113,40.691-100.36,70.811-5.2509,30.12,19.426,38.722,26.185,14.499,6.7598-24.224,27.246-55.317,74.585-53.492,44.343,1.7092,64.305,30.906,70.989,52.335,6.6844,21.429,29.799,18.855,25.454-8.8696-4.3445-27.725-44.238-73.254-96.85-75.282z\" fill-rule=\"evenodd\" sodipodi:nodetypes=\"szzszzs\" inkscape:connector-curvature=\"0\" fill=\"#FFF\"\/><\/g><\/svg>'
 };
