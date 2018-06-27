



var detection = (function() {
	var mod = {is:{}},
		d,
		ua = navigator.userAgent;
	mod.detect = {
		html5: function() {
			return document.createElement('canvas').getContext !== undefined;
		},
		touch: function() {
			var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
			return !!supportsTouch;
		},
		android: function() {
			return !!ua.match(/Android/i);
		},
		ios: function() {
			return !!ua.match(/iPhone|iPad|iPod/i);
		},
		ios7: function(){
			return mod.detect.ios && ua.match(/version\/7\./i);
		},
		bb10: function() {
			return !!ua.match(/BB10/i);
		},
		webkitVersion: function() {
			var regex = new RegExp(/AppleWebKit\/([\d.]+)/),
				result = regex.exec(ua),
				webkitVersion = result === null ? false : parseFloat(result[1]);
			return webkitVersion;
		},
		androidStockBrowser: function() {
			if (mod.is.android && mod.is.webkitVersion && mod.is.webkitVersion < 537) {
				return true;
			}
			return false;
		},
		standalone: function() {
			return !!window.navigator.standalone;
		},
		smartphone: function() {
			return (ua.match(/Android.*Mobile|iPhone|IEMobile|WPDesktop|BB10/i)) ? true : false;
		},
		tablet: function() {
			if(window.self != window.top)
				return false;
			// Android smartphones have the combination Android...Mobile, tablets only Android
			var androidTablet = (mod.is.android && !mod.is.smartphone),
				iPad = ua.match(/iPad/i) ? true : false;
			return (androidTablet || iPad);
		},
		pc: function() {
			return (!mod.is.smartphone && !mod.is.tablet);
		},
		phantom: function() {
			return !!(window.callPhantom || ua.match(/PhantomJS/));
		},
		iframe: function(){
			return window.self != window.top;
		}
	};

	for (d in mod.detect) {
		if (typeof mod.detect[d] === 'function') {
			mod.is[d] = mod.detect[d]();
		}
	}

	return mod;
})();



/* Zepto v1.1.2 - zepto event ajax form ie - zeptojs.com/license */


var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
    document = window.document,
    elementDisplay = {}, classCache = {},
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,
    capitalRE = /([A-Z])/g,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    classSelectorRE = /^\.([\w-]+)$/,
    idSelectorRE = /^#([\w-]*)$/,
    simpleSelectorRE = /^[\w-]*$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div'),
    propMap = {
      'tabindex': 'tabIndex',
      'readonly': 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      'maxlength': 'maxLength',
      'cellspacing': 'cellSpacing',
      'cellpadding': 'cellPadding',
      'rowspan': 'rowSpan',
      'colspan': 'colSpan',
      'usemap': 'useMap',
      'frameborder': 'frameBorder',
      'contenteditable': 'contentEditable'
    }

  zepto.matches = function(element, selector) {
    if (!selector || !element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
  }
  function isArray(value) { return value instanceof Array }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    var dom, nodes, container

    // A special case optimization for a single tag
    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

    if (!dom) {
      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
      if (!(name in containers)) name = '*'

      container = containers[name]
      container.innerHTML = '' + html
      dom = $.each(slice.call(container.childNodes), function(){
        container.removeChild(this)
      })
    }

    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }

    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. Note that `__proto__` is not supported on Internet
  // Explorer. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    dom = dom || []
    dom.__proto__ = $.fn
    dom.selector = selector || ''
    return dom
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    var dom
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // Optimize for string selectors
    else if (typeof selector == 'string') {
      selector = selector.trim()
      // If it's a html fragment, create nodes from it
      // Note: In both Chrome 21 and Firefox 15, DOM error 12
      // is thrown if the fragment doesn't begin with <
      if (selector[0] == '<' && fragmentRE.test(selector))
        dom = zepto.fragment(selector, RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // If it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, just return it
    else if (zepto.isZ(selector)) return selector
    else {
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes.
      else if (isObject(selector))
        dom = [selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // create a new Zepto collection from the nodes found
    return zepto.Z(dom, selector)
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found,
        maybeID = selector[0] == '#',
        maybeClass = !maybeID && selector[0] == '.',
        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
        isSimple = simpleSelectorRE.test(nameOnly)
    return (isDocument(element) && isSimple && maybeID) ?
      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
      slice.call(
        isSimple && !maybeID ?
          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
          element.getElementsByTagName(selector) : // Or a tag
          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
      )
  }

  function filtered(nodes, selector) {
    return selector == null ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = function(parent, node) {
    return parent !== node && parent.contains(node)
  }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className,
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    var num
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          !/^0/.test(value) && !isNaN(num = Number(value)) ? num :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) {
    return str == null ? "" : String.prototype.trim.call(str)
  }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      // need to check if document.body exists for IE as that browser reports
      // document ready when it hasn't yet created the body element
      if (readyRE.test(document.readyState) && document.body) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var node = this[0], collection = false
      if (typeof selector == 'object') collection = $(selector)
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = '')
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return arguments.length === 0 ?
        (this.length > 0 ? this[0].innerHTML : null) :
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        })
    },
    text: function(text){
      return arguments.length === 0 ?
        (this.length > 0 ? this[0].textContent : null) :
        this.each(function(){ this.textContent = (text === undefined) ? '' : ''+text })
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && value === undefined) ?
        (this.length == 0 || this[0].nodeType !== 1 ? undefined :
          (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
    },
    prop: function(name, value){
      name = propMap[name] || name
      return (value === undefined) ?
        (this[0] && this[0][name]) :
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        })
    },
    data: function(name, value){
      var data = this.attr('data-' + name.replace(capitalRE, '-$1').toLowerCase(), value)
      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      return arguments.length === 0 ?
        (this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
           this[0].value)
        ) :
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        })
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (this.length==0) return null
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2) {
        var element = this[0], computedStyle = getComputedStyle(element, '')
        if(!element) return
        if (typeof property == 'string')
          return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
        else if (isArray(property)) {
          var props = {}
          $.each(isArray(property) ? property: [property], function(_, prop){
            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
          })
          return props
        }
      }

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      if (!name) return false
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      if (!name) return this
      return this.each(function(idx){
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      if (!name) return this
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(value){
      if (!this.length) return
      var hasScrollTop = 'scrollTop' in this[0]
      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
      return this.each(hasScrollTop ?
        function(){ this.scrollTop = value } :
        function(){ this.scrollTo(this.scrollX, value) })
    },
    scrollLeft: function(value){
      if (!this.length) return
      var hasScrollLeft = 'scrollLeft' in this[0]
      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
      return this.each(hasScrollLeft ?
        function(){ this.scrollLeft = value } :
        function(){ this.scrollTo(value, this.scrollY) })
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    var dimensionProperty =
      dimension.replace(/./, function(m){ return m[0].toUpperCase() })

    $.fn[dimension] = function(value){
      var offset, el = this[0]
      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          traverseNode(parent.insertBefore(node, target), function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src)
              window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)

;(function($){
  var $$ = $.zepto.qsa, _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj){ return typeof obj == 'string' },
      handlers = {},
      specialEvents={},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || (focusinSupported && focus[type]) || type
  }

  function add(element, events, fn, data, selector, delegator, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    events.split(/\s/).forEach(function(event){
      if (event == 'ready') return $(document).ready(fn)
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = delegator
      var callback  = delegator || fn
      handler.proxy = function(e){
        e = compatible(e)
        if (e.isImmediatePropagationStopped()) return
        e.data = data
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      if ('addEventListener' in element)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    ;(events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
      if ('removeEventListener' in element)
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    if (isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {
      return $.proxy(fn[context], fn)
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, data, callback){
    return this.on(event, data, callback)
  }
  $.fn.unbind = function(event, callback){
    return this.off(event, callback)
  }
  $.fn.one = function(event, selector, data, callback){
    return this.on(event, selector, data, callback, 1)
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }

  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      $.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name]
        event[name] = function(){
          this[predicate] = returnTrue
          return sourceMethod && sourceMethod.apply(source, arguments)
        }
        event[predicate] = returnFalse
      })

      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
          source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue
    }
    return event
  }

  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    return compatible(proxy, event)
  }

  $.fn.delegate = function(selector, event, callback){
    return this.on(event, selector, callback)
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.off(event, selector, callback)
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, data, callback, one){
    var autoRemove, delegator, $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined
    if (isFunction(data) || data === false)
      callback = data, data = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(_, element){
      if (one) autoRemove = function(e){
        remove(element, e.type, callback)
        return callback.apply(this, arguments)
      }

      if (selector) delegator = function(e){
        var evt, match = $(e.target).closest(selector, element).get(0)
        if (match && match !== element) {
          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
        }
      }

      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }
  $.fn.off = function(event, selector, callback){
    var $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.off(type, selector, fn)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.trigger = function(event, args){
    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
    event._args = args
    return this.each(function(){
      // items in the collection might not be DOM elements
      if('dispatchEvent' in this) this.dispatchEvent(event)
      else $(this).triggerHandler(event, args)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, args){
    var e, result
    this.each(function(i, element){
      e = createProxy(isString(event) ? $.Event(event) : event)
      e._args = args
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return callback ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  ;['focus', 'blur'].forEach(function(name) {
    $.fn[name] = function(callback) {
      if (callback) this.bind(name, callback)
      else this.each(function(){
        try { this[name]() }
        catch(e) {}
      })
      return this
    }
  })

  $.Event = function(type, props) {
    if (!isString(type)) props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    return compatible(event)
  }

})(Zepto)

;(function($){
  var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.isDefaultPrevented()
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings, deferred) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    if (deferred) deferred.resolveWith(context, [data, status, xhr])
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings, deferred) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    if (deferred) deferred.rejectWith(context, [xhr, type, error])
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options, deferred){
    if (!('type' in options)) return $.ajax(options)

    var _callbackName = options.jsonpCallback,
      callbackName = ($.isFunction(_callbackName) ?
        _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
      script = document.createElement('script'),
      originalCallback = window[callbackName],
      responseData,
      abort = function(errorType) {
        $(script).triggerHandler('error', errorType || 'abort')
      },
      xhr = { abort: abort }, abortTimeout

    if (deferred) deferred.promise(xhr)

    $(script).on('load error', function(e, errorType){
      clearTimeout(abortTimeout)
      $(script).off().remove()

      if (e.type == 'error' || !responseData) {
        ajaxError(null, errorType || 'error', xhr, options, deferred)
      } else {
        ajaxSuccess(responseData[0], xhr, options, deferred)
      }

      window[callbackName] = originalCallback
      if (responseData && $.isFunction(originalCallback))
        originalCallback(responseData[0])

      originalCallback = responseData = undefined
    })

    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort')
      return xhr
    }

    window[callbackName] = function(){
      responseData = arguments
    }

    script.src = options.url.replace(/=\?/, '=' + callbackName)
    document.head.appendChild(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
      abort('timeout')
    }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    // IIS returns Javascript as "application/x-javascript"
    accepts: {
      script: 'text/javascript, application/javascript, application/x-javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0,
    // Whether data should be serialized to string
    processData: true,
    // Whether the browser should be allowed to cache GET responses
    cache: true
  }

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    if (query == '') return url
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data), options.data = undefined
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {}),
        deferred = $.Deferred && $.Deferred()
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
      RegExp.$2 != window.location.host

    if (!settings.url) settings.url = window.location.toString()
    serializeData(settings)
    if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

    var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url)
    if (dataType == 'jsonp' || hasPlaceholder) {
      if (!hasPlaceholder)
        settings.url = appendQuery(settings.url,
          settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
      return $.ajaxJSONP(settings, deferred)
    }

    var mime = settings.accepts[dataType],
        headers = { },
        setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(),
        nativeSetHeader = xhr.setRequestHeader,
        abortTimeout

    if (deferred) deferred.promise(xhr)

    if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
    setHeader('Accept', mime || '*/*')
    if (mime = settings.mimeType || mime) {
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
      setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

    if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
    xhr.setRequestHeader = setHeader

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            // http://perfectionkills.com/global-eval-what-are-the-options/
            if (dataType == 'script')    (1,eval)(result)
            else if (dataType == 'xml')  result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
          } catch (e) { error = e }

          if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
          else ajaxSuccess(result, xhr, settings, deferred)
        } else {
          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
        }
      }
    }

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      ajaxError(null, 'abort', xhr, settings, deferred)
      return xhr
    }

    if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async, settings.username, settings.password)

    for (name in headers) nativeSetHeader.apply(xhr, headers[name])

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings, deferred)
      }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    var hasData = !$.isFunction(data)
    return {
      url:      url,
      data:     hasData  ? data : undefined,
      success:  !hasData ? data : $.isFunction(success) ? success : undefined,
      dataType: hasData  ? dataType || success : success
    }
  }

  $.get = function(url, data, success, dataType){
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function(url, data, success, dataType){
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function(url, data, success){
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }

  $.fn.load = function(url, data, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    options.success = function(response){
      self.html(selector ?
        $('<div>').html(response.replace(rscript, "")).find(selector)
        : response)
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
    $.each(obj, function(key, value) {
      type = $.type(value)
      if (scope) key = traditional ? scope :
        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
    serialize(params, obj, traditional)
    return params.join('&').replace(/%20/g, '+')
  }
})(Zepto)

;(function($){
  $.fn.serializeArray = function() {
    var result = [], el
    $([].slice.call(this.get(0).elements)).each(function(){
      el = $(this)
      var type = el.attr('type')
      if (this.nodeName.toLowerCase() != 'fieldset' &&
        !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
        ((type != 'radio' && type != 'checkbox') || this.checked))
        result.push({
          name: el.attr('name'),
          value: el.val()
        })
    })
    return result
  }

  $.fn.serialize = function(){
    var result = []
    this.serializeArray().forEach(function(elm){
      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
    })
    return result.join('&')
  }

  $.fn.submit = function(callback) {
    if (callback) this.bind('submit', callback)
    else if (this.length) {
      var event = $.Event('submit')
      this.eq(0).trigger(event)
      if (!event.isDefaultPrevented()) this.get(0).submit()
    }
    return this
  }

})(Zepto)

;(function($){
  // __proto__ doesn't exist on IE<11, so redefine
  // the Z function to use object extension instead
  if (!('__proto__' in {})) {
    $.extend($.zepto, {
      Z: function(dom, selector){
        dom = dom || []
        $.extend(dom, $.fn)
        dom.selector = selector || ''
        dom.__Z = true
        return dom
      },
      // this is a kludge but works
      isZ: function(object){
        return $.type(object) === 'array' && '__Z' in object
      }
    })
  }

  // getComputedStyle shouldn't freak out when called
  // without a valid element as argument
  try {
    getComputedStyle(undefined)
  } catch(e) {
    var nativeGetComputedStyle = getComputedStyle;
    window.getComputedStyle = function(element){
      try {
        return nativeGetComputedStyle(element)
      } catch(e) {
        return null
      }
    }
  }
})(Zepto)




// see https://github.com/blai/fashionista/issues/2
;(function ($) {
	$.getScript = function(src, func) {
		var script = document.createElement('script');
		script.async = "async";
		script.src = src;
		if (func) {
			script.onload = func;
		}
		document.getElementsByTagName("head")[0].appendChild( script );
	}
})(Zepto);



faZepto = Zepto;



fg_api.prototype.adsModule = function() {
	var self = this,
		M;

	function module(){ }

	module.prototype.init = function() {
		M.timeoutActive = null;

		self.config.ads = faZepto.extend(self.config.ads || {}, {
			"off": (self.config.gameParams.ad_type === "off"),
			"show_initial": !self.hasFeature("highscores") && (self.config.gameParams.ad_type === "timed" || self.config.gameParams.ad_type === "initial"),
			"show_timed": self.config.gameParams.ad_type === "timed",
			"show_timed_ms": 120000
		});

		// For Google AdSense Review
		if (self.getUrlParams()['google_adsense'] && self.getUrlParams()['google_adsense'] === '1') {
			self.config.features["ads"] = 1;
			self.config.ads.off = false;
		}

		if (self.config.ads.off) {
			return;
		}

		faZepto.getScript("http://imasdk.googleapis.com/js/sdkloader/ima3.js", function() {

			if (self.config.ads.show_initial) {
				M.showAd();
			} else if (!self.debug) {
				M.delayNextAdModal(true);
			}

			if (self.config.ads.show_timed) {
				M.showTimed(self.config.ads.show_timed_ms);
			}
		});
	};

	module.prototype.showAd = function(callback){
		return M.showAdsense(callback);
	};

	module.prototype.forceAd = function(callback){
		return M.showAdsense(callback, true);
	};

	module.prototype.showAdsense = function(callback, force){
		if (self.adapters.run("ads", "show", callback)) {
			return false;
		}

		if (!M.initAdModal({"returnCallback": callback, "force": force})) {
			return false;
		}

		// @see https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/quickstart

		var adContainerElement = M.adContainerElement = document.createElement('div');
		adContainerElement.id = 'fg-ad-container';
		// adContainerElement.style.position = 'absolute';
		adContainerElement.style.overflow = 'hidden';
		self.rootElement.appendChild(adContainerElement);
		var adDisplayContainer = M.adDisplayContainer = new google.ima.AdDisplayContainer(adContainerElement);

		adDisplayContainer.initialize();
		M.adsLoader = new google.ima.AdsLoader(adDisplayContainer);

		M.showAdModal({"returnCallback": callback});

		self.spinner.show();

		module.prototype.onAdsManagerLoaded = function(adsManagerLoadedEvent){
			self.log("adsManagerLoadedEvent", adsManagerLoadedEvent);

			// Get the ads manager.
			M.adsManager = adsManagerLoadedEvent.getAdsManager({"duration": 0, "currentTime": 0});

			M.adsManager.init(300, 250, google.ima.ViewMode.NORMAL);
			M.adsManager.start();
			
			// Listen to any additional events, if necessary.
			faZepto.each(['LOADED', 'IMPRESSION', 'USER_CLOSE', 'SKIPPED', 'COMPLETE', 'ALL_ADS_COMPLETED'], function(key, value) {
				M.adsManager.addEventListener(google.ima.AdEvent.Type[value], M.onAdEvent);
			});
		};

		module.prototype.onAdEvent = function(adEvent){
			var ad = adEvent.getAd();
			self.log("adEvent", adEvent);
			self.log("Ad", ad);
			self.log("Ad.isLinear()", ad.isLinear());
			self.log("width", ad.getWidth());
			self.log("height", ad.getHeight());
			self.log("duration", ad.getDuration());
			self.log(adEvent.type);

			self.tracking.trackEvent("Ad event", "AdSense", adEvent.type);
			switch (adEvent.type) {
				case google.ima.AdEvent.Type.LOADED:
					self.spinner.hide();
					if (!ad.isLinear()) {
						self.modal.setDimensions(Math.max(300, ad.getWidth()), Math.max(250, ad.getHeight()));
					}
					break;
				case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
				case google.ima.AdEvent.Type.COMPLETE:
				case google.ima.AdEvent.Type.SKIPPED:
				case google.ima.AdEvent.Type.USER_CLOSE:
					self.modal.close();

					if (M.adsLoader)
						M.adsLoader.destroy();
					if (M.adDisplayContainer)
						M.adDisplayContainer.destroy();
					if (M.adsManager)
						M.adsManager.destroy();
					break;
			}
		};

		module.prototype.onAdError = function(adErrorEvent){
			self.log(adErrorEvent, adErrorEvent.getError());
			// M.adsManager.destroy();
		};
		
		module.prototype.remainingTimeChangedHandler = function(event){
			self.log("remainingTime", M.adsManager.remainingTime);
		};

		// Add event listeners
		M.adsLoader.addEventListener(
			google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
			M.onAdsManagerLoaded,
			false);
		M.adsLoader.addEventListener(
			google.ima.AdErrorEvent.Type.AD_ERROR,
			M.onAdError,
			false);
		M.adsLoader.addEventListener(
			google.ima.AdsManagerLoadedEvent.Type.REMAINING_TIME_CHANGED,
			M.remainingTimeChangedHandler,
			false);

		google.ima.AdsRenderingSettings.AUTO_SCALE = true;
		google.ima.AdsRenderingSettings.autoAlign = true;
		google.ima.AdsRenderingSettings.useStyledNonLinearAds = true;

		var adsRequest = new google.ima.AdsRequest();
		adsRequest.disableCompanionAds = true;
		var myadTagUrl = "";
		/*
		Here is a test AFG pub ID you can use so we can review: ca-games-pub-4968145218643279. 
		Once we have a live implementation with this pub ID we can then create one for the a/c pub-8700401253704627. 
		*/
		var publisherId="ca-games-pub-8700401253704627";
		var descriptionUrl=encodeURIComponent("http://html5games.com/Game/-/" + self.config.uuid);
		var age="";
		var gender="";
		var adtest=self.debug ? "on" : "";
		var channel=self.config.ads.adsense_channels.join('+');
		var adType="image"; //video_text_image_flash
		var duration=40000;
		var language=self.gametranslation.getUserLang();
		var slotname="";

		if (myadTagUrl == "")
		{
			// @see https://support.google.com/adsense/answer/3112148?hl=en
			myadTagUrl = "http://googleads.g.doubleclick.net/pagead/ads?client=" + publisherId + "&videoad_start_delay=0&overlay=0";
			if (adType != "")
			{
				myadTagUrl = myadTagUrl + ("&ad_type=" + adType);
			}
			if (duration != "")
			{
				myadTagUrl = myadTagUrl + ("&max_ad_duration=" + duration);
			}
			else
			{
				myadTagUrl = myadTagUrl + "&max_ad_duration=100000";
			}
			if (age != null)
			{
				myadTagUrl = myadTagUrl + ("&cust_age=" + age);
			}
			if (gender != "")
			{
				myadTagUrl = myadTagUrl + ("&cust_gender=" + gender);
			}
			if (adtest != "")
			{
				myadTagUrl = myadTagUrl + ("&adtest=" + adtest);
			}
			if (language != "")
			{
				myadTagUrl = myadTagUrl + ("&hl=" + language);
			}
			if (slotname != "")
			{
				myadTagUrl = myadTagUrl + ("&slotname=" + slotname);
			}
			if (channel != "")
			{
				myadTagUrl = myadTagUrl + ("&channel=" + channel);
			}
			if (descriptionUrl != "")
			{
				myadTagUrl = myadTagUrl + ("&description_url=" + descriptionUrl);
			}
		}

		// adsRequest.adTagUrl = "http://pubads.g.doubleclick.net/gampad/ads?sz=640x360&iu=/6062/iab_vast_samples/skippable&ciu_szs=300x250,728x90&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]";
		// adsRequest.adTagUrl = "http://googleads.g.doubleclick.net/pagead/ads?ad_type=image&client=ca-games-pub-4968145218643279&description_url=http%3A%2F%2Fhtml5games.com%2FGame%2F-%2Fd8f24956-dc91-4902-9096-a46cb1353b6f";

		adsRequest.adTagUrl = myadTagUrl;

		// Specify the linear and nonlinear slot sizes. This helps the SDK to
		// select the correct creative if multiple are returned.
		// var c = window.getComputedStyle(self.bodyElement, null);
		// self.log("getComputedStyle", {"w": c.w, "h": c.h});
		adsRequest.linearAdSlotWidth = 640;
		adsRequest.linearAdSlotHeight = 400;

		adsRequest.nonLinearAdSlotWidth = 300;
		adsRequest.nonLinearAdSlotHeight = 250;

		M.adsLoader.requestAds(adsRequest);
	};

	module.prototype.showTimed = function(ms){
		function startTimer() {
			setTimeout(function() {
				startTimer();
				M.showAd();
			}, ms);
		}
		startTimer();
	};

	module.prototype.show = function(width, height, options){
		var opts = faZepto.extend({
			mode: "ad",
			showCloseBtn: true,
			format: width + "x" + height, // e.g. "200x200"
			min_s_between: (+self.config.ads.min_s_between > 0) ? +self.config.ads.min_s_between : 30000,
			returnCallback: function() {}
		}, options);

		if (!self.hasFeature("ads") || self.config.ads.off){
			self.log("ads disabled");
			opts.returnCallback();
			return false;
		}

		self.log(M.timeoutActive);
		if (M.timeoutActive) {
			self.log("skipped ad");
			opts.returnCallback();
			return false;
		}

		// disable all Ads for X seconds
		self.log(opts.min_s_between);
		M.timeoutActive = true;
		setTimeout(function() {
			M.timeoutActive = false;
		}, opts.min_s_between * 1000);

		// show iframe with custom dimensions
		var url = "/ads/ingame?uuid=" + self.config.uuid + "&pid=" + self.config.pid + "&format=" + opts.format;
		opts.width = width;
		opts.height = height;
		self.iframe.show(url, opts);
		self.modal.setHeader(self.translate("api.ad_modal_header"));
		self.modal.setCloseCallback(opts.returnCallback);
		self.modal.updateCloseBtn(true);

		return self;
	};

	module.prototype.initAdModal = function(options){
		var opts = faZepto.extend({
			force: false,
			returnCallback: function() {}
		}, options);

		if (!M.isAdvertisingActive() || M.delayNextAdModal(opts.force)) {
			self.modal.setCloseCallback(opts.returnCallback);
			return false;
		}

		return true;
	};

	module.prototype.showAdModal = function(options){
		var opts = faZepto.extend({
			mode: "ad",
			showCloseBtn: true,
			width: 300,
			height: 250,
			returnCallback: function() {}
		}, options);

		M.delayNextAdModal(true);

		self.modal.create(opts);
		self.modal.setHeader(self.translate("api.ad_modal_header"));
		self.modal.updateCloseBtn(true);
		self.modal.setCloseBtnTimer(15);
		self.modal.setDimensions(opts.width, -1);
		self.modal.setContent(M.adContainerElement);
		self.modal.setCloseCallback(opts.returnCallback);

		return self;
	};

	module.prototype.delayNextAdModal = function(isSetter) {
		// check if Ads are enabled
		if (!self.hasFeature("ads") || self.config.ads.off){
			self.log("ads disabled");
			return true;
		}

		// disable all Ads for X seconds
		if (isSetter) {
			var min_s_between = (+self.config.ads.min_s_between > 0) ? +self.config.ads.min_s_between : 30000;

			self.log(min_s_between);
			M.timeoutActive = true;
			setTimeout(function() {
				M.timeoutActive = false;
			}, min_s_between * 1000);
		} else if (M.timeoutActive) {
			self.log("skipped ad");
			return true;
		}
		
		return false;
	};

	module.prototype.isAdvertisingActive = function() {
		if (window.top !== window.self) {
			self.log("ads disabled in <iframe>");
			return false;
		}
		return true;
	};

	M = new module();
	M.init();

	return M;
};

// show ad programmatically
fg_api.prototype.showAd = function(callback) {
	this.ads.showAd(callback);
};
fg_api.prototype.forceAd = function(callback) {
	this.ads.forceAd(callback);
};



fg_api.prototype.adaptersModule = function() {
	var self = this,
		M;

	function module(){ // define private vars
		this.adapters = {
			ads: {
				show: undefined
			},
			highscore: {
				show: undefined,
				submit: undefined
			},
			screenshot: {
				submit: undefined
			}
		};
		this.adapter_templates = {
			ads: {
				show: function(callback) { /**/}
			},
			highscore: {
				show: function(level) { /**/},
				submit: function(level, score) { /**/}
			},
			screenshot: {
				submit: function(screenshot_url, options) { /**/}
			}
		};
	}

	var adaptersPrototype = module.prototype;

	adaptersPrototype.init = function() {
		var section = "",
			subsection = "";
		if (typeof famobi_adapters !== "undefined") {
			for (section in famobi_adapters) {
				self.log(section);
				for (subsection in famobi_adapters[section]) {
					self.log(subsection);
					this.add(section, subsection, famobi_adapters[section][subsection]);
				}
			}
		}
	};

	adaptersPrototype.list = function(){
		self.log("available adapters: ", this.adapters);
		self.log("adapter templates: ", this.adapter_templates);
	};

	adaptersPrototype.add = function(section, subsection, callback){
		self.log("adding adapter: ", section + "." + subsection, callback);
		if (section in this.adapters && subsection in this.adapters[section] && callback) {
			this.adapters[section][subsection] = callback;
		} else {
			self.log("adapters.add: invalid (sub-)section or missing callback");
		}
		return this;
	};

	adaptersPrototype.has = function(section, subsection){
		if (this.adapters[section] && this.adapters[section][subsection]) {
			return typeof this.adapters[section][subsection] === "function";
		}
		return false;
	};

	adaptersPrototype.run = function(section, subsection){
		var args = arguments ? Array.prototype.slice.call(arguments, 2) : [];
		if (this.has(section, subsection)) {
			self.log("args", args);
			this.adapters[section][subsection].apply(this, args);
			return true;
		}
		// self.log("adapters.run: invalid (sub-)section or missing callback");
		return false;
	};

	M = new module();
	M.init();

	return M;
};



/* http://updates.html5rocks.com/2014/07/Web-Audio-Changes-in-m36 */
window.AudioContext = window.AudioContext || window.webkitAudioContext;



function fg_api(config, queue) {
	config = config || {};
	queue = queue || [];

	var i = 0, j = queue.length, self = this;

	self.config = config;
	self.debug = false;

	faZepto(function() {
		self.init();

		while(i < j){
			self.push(queue[i++]);
		}
	});
}

/**
 * Log function
 */
fg_api.prototype.log = function() {
	if (this.debug){
		if (window.console)
			console.log.apply(console, arguments);
	}
};

faZepto.fn.preventClick = function() {
	this.each(function() {
		faZepto(this).on("click touchstart touchmove touchcancel touchend", function(e) {
			e.stopPropagation();
			return false;
		});
	});

	return this;
};

fg_api.prototype.hasFeature = function(feature) {
	return feature in this.config.features && this.config.features[feature];
};

fg_api.prototype.createElement = function(type, attributes){
	var element = document.createElement(type);
	for(var key in attributes) {
		if(attributes.hasOwnProperty(key)){
			element.setAttribute(key, attributes[key]);
		}
	}
	return element;
};

fg_api.prototype.handleClick = function(element, callback){
	//var events = ["click", "touchstart", "touchend", "touchmove", "touchcancel"];

	if(typeof callback == 'function'){
		element.addEventListener(detection.is.pc ? "click" : "touchstart", function(e){
			callback.call(this, e);
			e.cancelBubble = true;
			e.stopPropagation();
			return false;
		});
	}

	/*for(var x in events){
		element.addEventListener(events[x], function(e){
			e.cancelBubble = true;
			e.stopPropagation();
			return false;
		});
	}*/

	return element;
};

fg_api.prototype.getUrlParams = function(a, b, c) {
	a = /[?&]?([^=]+)=([^&]*)/g, b = document.location && document.location.search ? document.location.search.split("+").join(" ") : "";
	for (var d = {}; c = a.exec(b);) d[decodeURIComponent(c[1])] = decodeURIComponent(c[2]);
	return d;
};

fg_api.prototype.str = function(chrs) {
	var str = '';
	function chr(n){return String.fromCharCode(n);}
	for (var i = 0; i < chrs.length; i++) {
		str += chr(Number(chrs[i]));
	}
	return str;
};

fg_api.prototype.getShortLink = function() {
	return this.config.short_url;
};

fg_api.prototype.guid = function(){
	function s4() {
    	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  	}
  	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

if (!window.console){
	console = {
		log: function() {},
		debug: function() {},
		info: function() {},
		warn: function() {}
	};
}



fg_api.prototype.getMoreGamesButtonImage = function () {
	return window.famobi.__("more_games_image");
};



fg_api.prototype.storageModule = function(type) {
	var self = this,
		M;

	function module(){ // define private vars

	}

	var storagePrototype = module.prototype;

	storagePrototype.init = function(storageType) {
		this.localStorage = {};
		this.sessionStorage = {};
		this.storage = {}; // one of the above

		if (storageType == 'localStorage' ||
			storageType == 'sessionStorage') {
				M.setStorageType(storageType)
				M.createStorage(storageType);
		}
	};

	storagePrototype.setStorageType = function(storageType) {
		M.storageType = storageType;
	}

	storagePrototype.getStorageType = function() {
		return M.storageType;
	}

	storagePrototype.createStorage = function(storageType) {
		if (testStorage(storageType)) {
			M.storage = createProxyStorage(storageType);
		} else {
			M.storage = createFallbackStorage(storageType);
		}
	}

	function testStorage(storageType) {
		if (!window[storageType]) {
			return false;
		}
		var storage = window[storageType];
		try {
			storage.setItem('test', 1);
			storage.removeItem('test');
			return true;
		} catch (e) {
			return false;
		}
	}

	// Create a storage proxy (same api like local-/sessionStorage) with double the data!
	function createProxyStorage(storageType) {
		return {
			data: {},
			getItem: function (key) {
				key = famobi_gameID + ':' + key;
				return window[storageType].getItem(key);
			},
			getProxyItem: function (key) {
				key = famobi_gameID + ':' + key;
				return this.data[key];
			},
			setItem: function (key, value) {
				key = famobi_gameID + ':' + key;
				this.data[key] = value;
				window[storageType].setItem(key, value);
			},
			removeItem: function (key) {
				key = famobi_gameID + ':' + key;
				try {
					delete this.data[key];
				} catch (e) {
				}
				window[storageType].removeItem(key);
			},
			clear: function () {
				this.data = {};
				window[storageType].clear();
			}
		};
	}

	// Create a storage stub (same api like local-/sessionStorage)
	function createFallbackStorage(storageType) {
		return {
			data: {},
			getItem: function (key) {
				key = famobi_gameID + ':' + key;
				return this.data[key];
			},
			setItem: function (key, value) {
				key = famobi_gameID + ':' + key;
				this.data[key] = value;
			},
			removeItem: function (key) {
				key = famobi_gameID + ':' + key;
				try {
					delete this.data[key];
				} catch (e) {
				}
			},
			clear: function () {
				this.data = {};
			}
		};
	}

	storagePrototype.getStorage = function() {
		return M.storage;
	};

	storagePrototype.getItem = function(key) {
		var value = M.getStorage().getItem(key);
		return value;
		/*
		try {
			return JSON.parse(value+"");
		} catch (e) {
			return value;
		}*/
	};

	storagePrototype.setItem = function(key, value) {
		/*
		if (typeof value == "object") {
			value = JSON.stringify(value);
		}
		// type cast
		key+="";
		value+="";*/
		return M.getStorage().setItem(key, value);
	};

	storagePrototype.setMaxItem = function(key, value) {
		var old_value = parseInt(M.getStorage().getItem(key), 10);

		if(!old_value || parseInt(value, 10) > old_value){
			M.getStorage().setItem(key, value);
			return true;
		} else {
			return false;
		}
	};

	storagePrototype.removeItem = function(key) {
		return M.getStorage().removeItem(key);
	};

	storagePrototype.clear = function() {
		return M.getStorage().clear();
	};

	M = new module();
	M.init(type);

	return M;
};



fg_api.prototype.loginModule = function() {
	var self = this,
		M;

	function module(){ // define private vars

	}

	var loginPrototype = module.prototype;

	loginPrototype.init = function() {
	};

	loginPrototype.show = function() {
		self.iframe.show("/account/index?ingameMode=true", {mode: "seamless"});
	};

	loginPrototype.setLoginStatus = function(loginStatus){
		self.config.loginStatus = loginStatus;
		return self;
	};

	loginPrototype.isLoggedIn = function(){
		return self.config.loginStatus;
	};

	//create new instace of Module
	M = new module();
	//initialize Module
	M.init();

	return M;
};

fg_api.prototype.showLoginScreen = function() {
	return this.login.show();
};

fg_api.prototype.postLogin = function(){
	this.navigation.reload();
	this.navigation.hideAll();
};

fg_api.prototype.setLoginStatus = function(loginStatus){
	this.login.setLoginStatus(loginStatus);
};





fg_api.prototype.highscoresModule = function() {
	var self = this,
		M;

	function module(){ // define private vars

	}

	var highscoresPrototype = module.prototype;

	highscoresPrototype.init = function () {
		
	};

	highscoresPrototype.submit = function(level, score) {
		level = (level.length || level > 0) ? level : "0";
		score = parseInt(score, 10);

		self.tracking.data({'level': level, 'score': score});

		self.tracking.trackEvent('Highscore event', 'submit', famobi_gameID + ':level:' + level);

		if (!self.hasFeature("highscores")){
			self.showAd();

			return self;
		}

		self.showAd(function() {

			// Run Adapter if possible
			if (self.adapters.run("highscore", "submit", level, score)) {
				return self;
			}

			function doSubmit(score) {
				// POST to iframe
				self.iframe.postData("/gameapi/highscore/" + self.config.uuid, {
					"score": score
				});
			}

			if(!self.login.isLoggedIn()){
				// Save local
				self.sessionStorage.setMaxItem("famobi:level", level);
				if (self.sessionStorage.setMaxItem("famobi:score", score)) {
					doSubmit(score);
				}
			}else{
				doSubmit(score);
			}

		});

		return self;
	};

	highscoresPrototype.show = function(level){
		if (self.hasFeature("highscores")){
			// Run Adapter if possible
			if (self.adapters.run("highscore", "show", level)) {
				return self;
			}

			// Business as usual
			self.iframe.show("/gameapi/highscore/" + self.config.uuid);
		}

		return self;
	};

	highscoresPrototype.get = function(){
		return self.sessionStorage.getItem("famobi:score");
	};

	highscoresPrototype.del = function(){
		self.sessionStorage.delItem("famobi:score");
	};

	highscoresPrototype.submitHighscoreCallback = function() {
		M.del();
		faZepto(self.rootElement).trigger("fg_api.submitHighscore");
	};

	M = new module();
	M.init();

	return M;
};

fg_api.prototype.submitHighscore = function(level, score){
	if (this.hasFeature("highscores")){
		this.highscores.submit(level, score);
	}
};

fg_api.prototype.showHighscore = function(){
	this.highscores.show();
};

fg_api.prototype.getHighscore = function(){
	return this.highscores.get();
};

fg_api.prototype.submitHighscoreCallback = function(){
	this.highscores.submitHighscoreCallback();
};



fg_api.prototype.screenshotModule = function() {

	// http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata

	var self = this,
		M;

	function module() {

		this.clipClicked = false;
		this.options = {
			width: 480,
			height: 640
		};

		this.savingTryoutsNum = 5;
		this.savingTryoutsInterval = 3000;
		this.savingLocked = false;
		this.savingInterval = null;
		this.releaseSavingTimeout = null;
		this.releaseTimeout = 20000;
	}

	function getCameraIcon() {
		return '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve"><g id="CAMERA_1_" enable-background="new    "><g id="CAMERA"><g><path d="M32,22c-6.627,0-12,5.372-12,12c0,6.627,5.373,12,12,12s12-5.373,12-12S38.627,22,32,22z M61,12H48.243l-5.095-5.094l-0.002,0.003C42.602,6.35,41.843,6,41,6H23c-0.976,0-1.835,0.474-2.383,1.196L15.813,12H3c-1.657,0-3,1.343-3,3v40c0,1.657,1.343,3,3,3h58c1.657,0,3-1.343,3-3V15C64,13.343,62.657,12,61,12z M32,52c-9.941,0-18-8.059-18-18c0-9.941,8.059-18,18-18c9.941,0,18,8.059,18,18C50,43.941,41.941,52,32,52z"/></g></g></g></svg>';
	}

	function initClip() {
		var fgFotoshootOverlay = self.createElement("div", {
			id: "fg-fotoshoot-overlay"
		});

		if(self.config.gameParams.screenshot && self.config.gameParams.screenshot.camera) {
			fgFotoshootOverlay.style.top = "auto"; //reset css
			fgFotoshootOverlay.style.right = "auto"; //reset css

			var cameraConfig = self.config.gameParams.screenshot.camera;
			for (var idx in cameraConfig.position) {
				if (cameraConfig.position[idx]) {
					var direction = cameraConfig.position[idx];
					switch (direction) {
						case "top":
						case "bottom":
							fgFotoshootOverlay.style[direction] = cameraConfig.y + '%';
							break;
						case "right":
						case "left":
							fgFotoshootOverlay.style[direction] = cameraConfig.x + '%';
							break;
					}
				}
			}
		}

		fgFotoshootOverlay.innerHTML = getCameraIcon();

		self.rootElement.appendChild(fgFotoshootOverlay);

		self.handleClick(fgFotoshootOverlay, takeScreenshot);
	}

	function getScreenshotParam(name) {
		if (self.config.gameParams.screenshot[name]) {
			return self.config.gameParams.screenshot[name];
		}
	}

	module.prototype.init = function () {

		// is feature disabled
		if (!self.hasFeature("screenshot")) {
			return;
		}

		// hasn't special screenshot settings configured
		// or screenshot feature is disabled (again???)
		// or no screenshot areas defined
		if (!self.config.gameParams.screenshot ||
			!self.config.gameParams.screenshot.active ||
			!Object.keys(self.config.gameParams.screenshot.areas).length
		) {
			return false;
		}

		initClip();
	};

	module.prototype.listen = function(){
		// Use postMessage API for "secure" cross-domain message-passing
		window.addEventListener("message", M.receive, false);
	};

	module.prototype.receive = function(e){

		if (e.origin !== self.config.urlRoot) {
			return;
		}

		var messageObject = e.data;

		if (messageObject.type){
			if (messageObject.type === "action" && messageObject.action){
				self[messageObject.action](messageObject.data);
			}
		}
	};

	function discardScreenshotUpload(event) {
		self.tracking.trackEvent('Screenshot event', 'discard', famobi_gameID);
		self.modal.close();
	}

	function releaseUploadLock() {
		M.savingLocked = false;
	}

	function lockUpload() {
		M.releaseSavingTimeout = setTimeout(function(){
			releaseUploadLock();
		}, M.releaseTimeout);

		M.savingLocked = true;
	}

	function uploadScreenshot(imageSrc) {
		if (M.savingLocked) {
			return false;
		}

		self.tracking.trackEvent('Screenshot event', 'save', famobi_gameID);

		M.fgSaveScreenshot.classList.add('fg-screenshot-btn-loading');

		lockUpload();

		// POST to iframe
		self.iframe.postData("/gameapi/screenshot/", {
			"uuid" : self.config.uuid,
			"txid": M.txid,
			"base64String": imageSrc
		});

		return self;
	}

	module.prototype.handleScreenshotSave = function(data){
		var countTryouts = 0;
		var image;

		if(!data.url || !data.txid){
			return false; //Unknown error
		}

		// store transaction id from server
		M.txid = data.txid;

		image = new Image();

		image.onload = function () {
			imageLoaded(true);
		};
		image.onerror = function () {
			countTryouts++;
			if (countTryouts >= M.savingTryoutsNum) {
				imageLoaded(false);
			}
		};

		M.savingInterval = setInterval(function() {
			image.src = data.url+"?foc="+Math.random()*10000000000000000;
		}, M.savingTryoutsInterval);

		function imageLoaded(imageHasLoaded) {
			self.tracking.trackEvent('Screenshot event', 'uploaded:' + (imageHasLoaded ? '1':'0'), famobi_gameID);

			clearInterval(M.savingInterval);
			clearTimeout(M.releaseSavingTimeout);
			releaseUploadLock();

			if (imageHasLoaded) {
				self.modal.close();
				M.fgSaveScreenshot.classList.add('fg-screenshot-btn-loading-complete');

				self.forceAd(function() {
					// Run Adapter if possible
					self.adapters.run("screenshot", "submit", data.url , {
						width: M.options.width,
						height: M.options.height
					});
				});
			}else{
				self.modal.shake();
				M.fgSaveScreenshot.classList.add('fg-screenshot-btn-loading-fail');
				setTimeout(function(){
					M.fgSaveScreenshot.classList.remove('fg-screenshot-btn-loading-fail');
					M.fgSaveScreenshot.classList.remove('fg-screenshot-btn-loading');
				}, 1500);
			}
		}
	};

	function getCanvas(canvasID) {
		return canvasID ? document.getElementById(canvasID) : document.getElementsByTagName("canvas")[0];
	}

	function createImageFromCanvas(canvas, area) {
		var image = new Image();
		image.src =  canvas.toDataURL('image/jpeg');
		var targetHeight = 0,
			targetWidth = 0;

		// calculate based on percentage configured in screenshot params
		var slicing = {
			width: image.width / 100 * area.width,
			height: image.height / 100 * area.height,
			x: image.width / 100 * area.x,
			y: image.height / 100 * area.y
		};

		slicing.aspectRatio = slicing.width / slicing.height;

		var aspectRatioCanvas = M.options.width / M.options.height;

		// rotate target canvas
		if (Math.floor(slicing.aspectRatio) !== Math.floor(aspectRatioCanvas)) {
			var tmp = M.options.height;
			M.options.height = M.options.width;
			M.options.width = tmp;
			aspectRatioCanvas = M.options.width / M.options.height;
		}

		function byHeight() {
			targetHeight = M.options.height;
			targetWidth = M.options.height * slicing.aspectRatio;
		}
		function byWidth() {
			targetWidth = M.options.width;
			targetHeight = M.options.width / slicing.aspectRatio;
		}

		if(slicing.aspectRatio > 1){
			byHeight();
		} else {
			byWidth();
		}

		if(targetWidth > M.options.width){
			byWidth();
		}
		if(targetHeight > M.options.height){
			byHeight();
		}

		// find center postion of image
		var positionX = (M.options.width - targetWidth) / 2;
		var positionY = (M.options.height - targetHeight) / 2;

		return {
			element: image,
			slicing: slicing,
			positionX: parseInt(positionX),
			positionY: parseInt(positionY),
			targetWidth: parseInt(targetWidth),
			targetHeight: parseInt(targetHeight),
			createTemporaryCanvas: function() {
				return self.createElement('canvas', {'width': M.options.width, 'height': M.options.height});
			}
		};
	}

	function getCanvasContext(canvas) {
		return canvas.getContext('2d');
	}

	function cropImage(canvas, area) {
		var image = createImageFromCanvas(canvas, area);
		var tempCanvas = image.createTemporaryCanvas();
		var ctx = getCanvasContext(tempCanvas);

		ctx.drawImage(
			image.element,
			image.slicing.x,
			image.slicing.y,
			image.slicing.width,
			image.slicing.height,
			image.positionX,
			image.positionY,
			image.targetWidth,
			image.targetHeight
		);
		var imageSrc = canvas.toDataURL('image/jpeg', 0.7);
		image = null;
		tempCanvas = null;
		ctx = null;

		return imageSrc;
	}

	function displayScreenshotOverlay(imageSrc) {
		self.modal.create({
			showCloseBtn: false,
			transparent: true
		});

		// screenshot container
		var fgScreenshot = self.createElement("div", {
			"class": "fg-screenshot"
		});

		// upload screenshot image (link)
		M.fgSaveScreenshot = self.createElement("a", {
			"class": "fg-screenshot-btn-upload"
		});
		M.fgSaveScreenshot.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><polygon id="check-mark-icon" points="398.218,92.985 199.729,291.475 113.754,205.476 50,269.242 199.733,419.015 462,156.726 "/></svg>';
		self.handleClick(M.fgSaveScreenshot, function() {
			uploadScreenshot(imageSrc);
		});
		fgScreenshot.appendChild(M.fgSaveScreenshot);

		// discard screenshot image (link)
		var fgDiscardScreenshot = self.createElement("a", {
			"class": "fg-screenshot-btn-discard"
		});
		fgDiscardScreenshot.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><polygon id="x-mark-icon" points="438.393,374.595 319.757,255.977 438.378,137.348 374.595,73.607 255.995,192.225 137.375,73.622 73.607,137.352 192.246,255.983 73.622,374.625 137.352,438.393 256.002,319.734 374.652,438.378 "/></svg>';
		self.handleClick(fgDiscardScreenshot, discardScreenshotUpload);
		fgScreenshot.appendChild(fgDiscardScreenshot);

		var fgScreenshotImage = self.createElement("img", {"src": imageSrc});
		fgScreenshot.appendChild(fgScreenshotImage);

		self.modal.setContent(faZepto(fgScreenshot).get(0));
		self.modal.setDimensions(M.options.width, M.options.height);
		self.modal.setCloseCallback(function() {
			self.clipClicked = false;
		});
	}

	function takeScreenshot(area) {
		if (self.clipClicked) {
			return false;
		}
		self.clipClicked = true;
		// reset transaction id
		M.txid = null;
		self.tracking.trackEvent('Screenshot event', 'shoot', famobi_gameID);

		if (getScreenshotParam('areas')) {
			if (area && getScreenshotParam('areas')[area]) {
				area = getScreenshotParam('areas')[area];
			} else if(getScreenshotParam('areas')['default']) {
				area = getScreenshotParam('areas')['default'];
			} else {
				area = null;
			}
		}

		if (!area) {
			throw Error('No areas defined');
		}

		var originalCanvas = getCanvas(M.canvasID);
		var imageSrc = cropImage(originalCanvas, area);
		displayScreenshotOverlay(imageSrc);
	}

	M = new module();
	M.init();

	return M;
};

fg_api.prototype.handleScreenshotSave = function(data) {
	data = data || {};
	this.screenshot.handleScreenshotSave(data);
};




fg_api.prototype.navigationModule = function() {
	var self = this,
		M;

	function module(){ // define private vars

	}

	var navigationPrototype = module.prototype;

	navigationPrototype.init = function(){
		self.fgNavigation = document.createElement("nav");
		self.fgNavigation.style.position = "relative";
		self.fgNavigation.setAttribute("id", "fg-navigation");
		faZepto(self.headElement).append(self.config.style);
		self.fgOverlay.innerHTML = self.config.headerHtml;
		self.fgOverlay.appendChild(self.fgNavigation);
		self.fgOverlay_visible = false;
		self.fgHeader = document.getElementById("fg-header");

		faZepto("#fg-clip, #fg-logo").each(function(){
			self.handleClick(this, toggleOverlay);
		});

		function toggleOverlay(e){
			if(self.fgOverlay_visible){
				M.hideAll();
			}else{
				M.show();
			}
			e.stopPropagation();
			return false;
		}

		// Init Left-Hand-Navigation
		if (self.hasFeature('menu')) {
			M.setHtml(self.config.menuHtml);
		}

		return self;
	};

	navigationPrototype.bindEvents = function() {
		faZepto("[data-switch-lang]").each(function() {
			var $this = faZepto(this),
				lang = faZepto(this).attr("data-switch-lang");

			$this.removeClass('fg-lang-selected');

			if (lang === self.gametranslation.curLangString) {
				$this.addClass('fg-lang-selected');
			}

			self.handleClick(this, function() {
				if (lang.length) {
					M.switchLanguage(lang);
				}
			});
		});

		faZepto("[data-famobi-href]").css("cursor", "pointer").each(function() {
			var callback = function() {
				var link = faZepto(this).attr("data-famobi-href");

				M.hideAll();

				switch (link) {
					case 'moreGames':
						return self.moreGamesLink();
					case 'more':
						return self.moreGamesOverlay();
					case 'back':
						return self.backLink();
				}
			};

			self.handleClick(this, callback);
		});

		faZepto("[data-famobi-fullscreen]").each(function() {
			self.handleClick(this, M.switchFullscreen);
		});

		faZepto("[data-famobi-screenshot]").each(function() {
			if (!self.debug) {
				faZepto(this).remove();
			}
			else{
				self.handleClick(this, M.takeScreenshot);
			}
		});
	};

	navigationPrototype.switchLanguage = function(lang) {
		var params = self.getUrlParams(),
			qs = '';

		M.hideAll();
		params.locale = lang;
		qs = faZepto.param(params);
		document.location.replace(document.location.pathname + "?" + qs + (document.location.hash ? "#" + document.location.hash : ""));
	};

	navigationPrototype.switchFullscreen = function () {
		M.hideAll();

		self.fullscreen.toggle();

		return true;
	}

	navigationPrototype.takeScreenshot = function() {

		self.screenshot.shoot();
	};

	navigationPrototype.show = function() {
		M.hideAll();

		self.fgOverlay_visible = true;
		faZepto(self.fgOverlay).addClass("navigation-view");
		self.fgNavigation.style.display = "";

		return self;
	};

	navigationPrototype.hide = function() {
		self.fgOverlay_visible = false;
		self.fgNavigation.style.display = "none";

		return self;
	};

	// hide all views (navigation, iframe, maybe more) call before you want to display a new "view"
	navigationPrototype.hideAll = function() {
		$fgOverlay = faZepto(self.fgOverlay);
		$fgOverlay.removeClass("iframe-view navigation-view");
		M.hide(); // hide navigation
		self.modal.close(); // close modals

		return self;
	};

	navigationPrototype.reload = function() {

	};

	navigationPrototype.setHtml = function(html) {
		self.fgNavigation.innerHTML = html;

		M.bindEvents();

		self.gametranslation.translateHtml(faZepto(self.fgNavigation));
	};

	M = new module();

	M.init();

	return M;
};

fg_api.prototype.backLink = function() {
	var self = this;

	// Fallback to previous page
	if (history.length > 1) {
		window.history.go(-1);
	} else {
		if (window.opener) {
			try {
				// iOS8 is missing window.close support, thanks AAPL
				window.close();
			} catch (ex) {
				// SecurityError
			}
		}
		
		// Fallback to more games url
		self.moreGamesLink(false);
	}

	return false;
};

fg_api.prototype.moreGamesLink = function(popup) {
	var moreGamesLink = window.famobi.__("more_games_url");

	if (!moreGamesLink) {
		return false;
	}

	if (typeof popup == "undefined" || !popup || !window.open(moreGamesLink, "")) {
		window.location.href = moreGamesLink;
	}
};

fg_api.prototype.moreGamesOverlay = function(popup) {
	this.iframe.show('http://m.games1.com/');
};

fg_api.prototype.updateMenu = function(html){
	this.navigation.setHtml(html);
};



fg_api.prototype.spinnerModule = function() {
	var self = this,
		M;

	function module(){ // define private vars
		this.spinner = "";
		this.timeout = 15000;
		this.maxTimeout = null;
		this.stateTimeout = null;
	}

	var spinnerPrototype = module.prototype;

	spinnerPrototype.init = function() {
		M.spinner = self.createElement("div", {"class": "fg-spinner"});
		M.spinner.innerHTML = '<div class="fg-dot1"></div><div class="fg-dot2"></div><div class="fg-dot3"></div><div class="fg-dot4"></div><div class="fg-dot5"></div><div class="fg-dot6"></div><div class="fg-dot7"></div>';

		self.rootElement.appendChild(M.spinner);

		return this;
	};

	spinnerPrototype.show = function(timeout){

		M.spinnerState = "new";
		M.spinner.style.visibility = "visible";
		M.spinner.style.left = "50%";
		M.spinner.style.opacity = 1;

		// custom timeout
		if (timeout) {
			M.timeout = timeout;
		}

		M.stateTimeout = setTimeout(function(){
			if(M.spinnerState == "tryhide"){
				M.spinnerState = "closeable";
				M.hide();
			}else{
				M.spinnerState = "closeable";
			}
		}, 1000);

		//show spinner max 15sec
		M.maxTimeout = setTimeout(function(){
			M.hide();
		}, M.timeout);

		return this;
	};

	spinnerPrototype.hide = function(){

		if (M.spinnerState && M.spinnerState == "closeable") {
			M.spinner.style.opacity = 0;

			var timeoutHide = setTimeout(function(){
				M.spinner.style.visibility = "hidden";
				M.spinner.style.left = "-80px";
			}, 1000);

			clearTimeout(M.maxTimeout);
			clearTimeout(M.stateTimeout);
			clearTimeout(timeoutHide);

		} else {
			M.spinnerState = "tryhide";
		}
		return this;
	};

	M = new module();
	M.init();

	return M;
};



fg_api.prototype.modalModule = function() {
	var self = this,
		M;

	function module(){ // define private vars
		this.element = "";
		this.closing = false;
		this.closeCallbacks = [];
	}

	var modalPrototype = module.prototype;

	modalPrototype.init = function() {
		M.listen();
	};

	modalPrototype.create = function(options){
		var opts = faZepto.extend({
			showCloseBtn: true
		}, options);

		if (!M.closing) {
			M.close(); // close all other window - it's a MODAL
		}

		var className = "";
		if(opts.mode){
			className = opts.mode + "-mode";
		}

		M.element = self.createElement('div', {'class': 'fg-modal fg-fade fg-show ' + className});

		M.overlay = self.createElement('div', {'class': 'fg-modal-overlay'});
		self.rootElement.appendChild(M.overlay);

		M.header = self.createElement('header', {});
		M.element.appendChild(M.header);

		M.body = self.createElement('div', {'class': 'fg-modal-body'});
		M.element.appendChild(M.body);

		self.rootElement.appendChild(M.element);
		
		if (opts.showCloseBtn !== false) {
			M.showCloseBtn();
		}

		if (opts.transparent){
			M.body.classList.add('fg-modal-transparent');
		}
	};

	modalPrototype.listen = function(){
		// Use postMessage API for "secure" cross-domain message-passing
		window.addEventListener("message", M.receive, false);
	};

	modalPrototype.receive = function(e){
		if (e.origin !== self.config.urlRoot)
			return;

		var messageObject = e.data;

		switch (messageObject.type) {
			case "showModalCloseBtn":
				M.showCloseBtn();
			break;
			case "setModalHeader":
				M.setHeader(messageObject.title);
			break;
			case "setModalCloseBtnTimer":
				M.setCloseBtnTimer(messageObject.sec, messageObject.options);
			break;
		}
	};

	modalPrototype.showCloseBtn = function(){
		M.closeBtn = self.createElement('div', {
			'class': 'fg-modal-close icon-cancel'
		});
		M.element.appendChild(M.closeBtn);

		self.handleClick(M.closeBtn, function(){
			if(!this.getAttribute("data-disable"))
				M.close();
		});

		self.handleClick(M.overlay, function(){
			if(!M.closeBtn.getAttribute("data-disable"))
				M.close();
		});
	};

	modalPrototype.setCloseCallback = function(callback){
		if(M.element){
			M.closeCallbacks.push(callback);
			return true;
		}else{
			callback();
			return false;
		}
	};

	modalPrototype.updateCloseBtn = function(disable){
		var currentSec = M.closeBtnTimer ? M.closeBtnTimer.current : 0;

		if(disable){
			M.fallbackTimeout = setTimeout(M.updateCloseBtn, 5000);
		}else if(M.fallbackTimeout){
			clearTimeout(M.fallbackTimeout);
		}

		if(currentSec > 0 || disable){
			M.closeBtn.innerHTML = '<span class="counter">' + currentSec + '</span>' || '';
			M.closeBtn.setAttribute("data-disable", "true");
		}else{
			M.closeBtn.innerHTML = "";
			M.closeBtn.removeAttribute("data-disable");
		}
	};

	modalPrototype.setCloseBtnTimer = function(sec, options){
		if(!options)
			options = {};


		M.clearCloseBtnTimer();

		M.closeBtnTimer = {
			sec: sec,
			current: (options.faketime || sec)+1,
			timeout: 0,
			options: options
		};

		M.closeBtnTicker();
	};

	modalPrototype.clearCloseBtnTimer = function(){
		if(M.closeBtnTimer && M.closeBtnTimer.timeout){
			clearTimeout(M.closeBtnTimer.timeout);
		}
	};

	modalPrototype.closeBtnTicker = function(){
		var options = M.closeBtnTimer.options;
		M.closeBtnTimer.current = Math.max(--M.closeBtnTimer.current, 0);

		if (M.closeBtnTimer.current === 0) {
			M.close();
			return false;
		} else {
			M.updateCloseBtn();
		}

		var faketime = parseInt(options.faketime || M.closeBtnTimer.sec, 10);

		M.closeBtnTimer.timeout = setTimeout(M.closeBtnTicker, parseInt((M.closeBtnTimer.sec/faketime)*1000, 10));
	};

	modalPrototype.activateCloseBtn = function(state){

		M.closeBtn.style.display = state ? 'block' : 'none';

		if (state) {
			M.closeBtn.removeAttribute("data-disable");
		}
		else {
			M.closeBtn.setAttribute("data-disable", "true");
		}
	};

	modalPrototype.setContent = function(contentElement){
		if(contentElement){
			M.body.appendChild(contentElement);
		}
	};

	modalPrototype.setHeader = function(headline){
		headline = headline || '';

		if (!M.header) {
			return;
		}

		M.header.innerHTML = headline.length ? headline + "" : "";
		M.header.style.display = headline.length ? "block" : "none";
	};

	modalPrototype.setDimensions = function(width, height){
		if(!width || width === "")
			width = 480;

		if(!height || height === "")
			height = 500;

		M.element.style.maxHeight = parseInt(height, 10) + 60 + "px";
		M.element.style.maxWidth = parseInt(width, 10) + 20 + "px";
		M.element.style.display = "";
	};

	modalPrototype.close = function(){
		M.closing = true;

		M.clearCloseBtnTimer();

		if(M.element){
			M.element.parentNode.removeChild(M.element);
			delete M.element;
		} else {
			return false;
		}

		if(M.overlay){
			M.overlay.parentNode.removeChild(M.overlay);
			delete M.overlay;
		} else {
			return false;
		}

		faZepto.each(M.closeCallbacks, function(key, callback) {
			if (typeof callback === "function") {
				callback();
			}
		});
		M.closeCallbacks = [];

		self.spinner.hide();

		M.closing = false;
	};

	modalPrototype.shake = function(){
		M.element.classList.add('fg-modal-shake');

		setTimeout(function(){
			M.element.classList.remove('fg-modal-shake');
		}, 2000);
	};

	M = new module();
	M.init();

	return M;
};

// garbage collection
fg_api.prototype.GC = function(data) {
	data = data || {};

	if (data.hasOwnProperty("postCount")) {
		faZepto(this.rootElement).find("#fg-post-form" + data.postCount).remove();
		faZepto(this.fgOverlay).find("#fg-post-iframe" + data.postCount).remove();
	}
};



fg_api.prototype.iframeModule = function() {
	var self = this,
		M;

	function module(){ // define private vars

	}

	var iframePrototype = module.prototype;

	iframePrototype.init = function() {
		self.comIframe = self.createElement("iframe", {
			"id": "fg-com-iframe",
			"name": "fg-com-iframe",
			"src": ""
		});
		self.fgOverlay.appendChild(self.comIframe);

		M.listen();

		return self;
	};

	iframePrototype.listen = function(){
		// Use postMessage API for "secure" cross-domain message-passing
		window.addEventListener("message", M.receive, false);
	};

	iframePrototype.receive = function(e){
		if (e.origin !== self.config.urlRoot)
			return;

		var messageObject = e.data;

		if (messageObject.type){
			if (messageObject.type == "updateIframeSize"){
				M.updateSize();
			}
		}
	};

	iframePrototype.create = function(){
		self.iframeContainer = self.createElement("div", {"id": "fg-iframe-container"});

		self.iframeElement = self.createElement("iframe", {
			"id": "fg-iframe",
			"class": "fg-iframe",
			"name": "fg-iframe",
			"src": "",
			"seamless": "",
			"style": "bacfground: transparent none;"
		});
		self.iframeContainer.appendChild(self.iframeElement);

		return self;
	};

	iframePrototype.updateSize = function(){
		if(self.iframeElement){
			self.iframeElement.style.height = "0px";
			self.iframeElement.style.height = "100%";
		}

		return self;
	};

	/**
	 * Set the iframe's src="" attribute
	 */
	iframePrototype.load = function() {
	};

	/**
	 * Displays the iframe with the specified width/height dimensions
	 */
	iframePrototype.show = function(url, options) {
		var opts = faZepto.extend({
			width: "",
			height: ""
		}, options);

		if(!self.iframeContainer){ //create iframe if not exist
			M.create();
		}

		self.navigation.hideAll();

		self.modal.create(options);
		self.log("iframeContainer");
		self.log(self.iframeContainer);

		if (url.length){
			if (url.indexOf('/') === 0) {
				url = self.config.urlRoot + url;
			}
			self.iframeElement.setAttribute("src", url);
			self.spinner.show();

			self.iframeElement.onload = function(){
				self.spinner.hide();
			};
		} else {
			self.log("url not set");
		}

		if(opts.mode && opts.mode == "seamless")
			opts.height = "none";

		if(opts.mode && opts.mode == "ad")
			self.iframeElement.setAttribute("scrolling", "no");
		else
			self.iframeElement.setAttribute("scrolling", "yes");

		self.modal.setCloseCallback(function(){
			self.log("closeCallback");
			if (self.iframeElement) {
				self.iframeElement.setAttribute("src", "");
			}
		});

		self.modal.setContent(self.iframeContainer); //insert iframe into modal

		self.modal.setDimensions(opts.width, opts.height);

		return self;
	};

	iframePrototype.hide = function() {

		faZepto(self.fgOverlay).css({
			'max-width': '',
			'max-height': ''
		});

		return self;
	};

	iframePrototype.postData = function(url, dataObject) {
		var $formElement,
			k,
			v,
			$postIframe,
			postIframeName;
		self.postIframeCount = self.postIframeCount || 0;
		postIframeName = "fg-post-iframe" + self.postIframeCount;

		// create new iframe for each post
		$postIframe = faZepto("<iframe>", {
			"id": postIframeName,
			"name": postIframeName,
			"class": "fg-post-iframe",
			"src": ""
		});
		faZepto(self.fgOverlay).append($postIframe);
		// add post iframe counter to POST data so the server response is able to give that information back
		dataObject = dataObject || {};
		dataObject = faZepto.extend(dataObject, {"post_count": self.postIframeCount});


		$formElement = faZepto("<form>", {
			"id": "fg-post-form" + self.postIframeCount,
			"class": "fg-form",
			"action": self.config.urlRoot + url,
			"method": "POST",
			"style": "display:none",
			"target": postIframeName
		});
		self.postIframeCount++;
		faZepto(self.rootElement).append($formElement);

		for (k in dataObject){
			if (!dataObject.hasOwnProperty(k)){
				continue;
			}
			v = dataObject[k];

			$formElement.append(faZepto("<input>", {
				type: "hidden",
				name: k,
				value: v
			}));
		}
		$formElement.submit();

		return self;
	};

	//create new instace of Module
	M = new module();
	//initialize Module
	M.init();

	return M;
};

// garbage collection
fg_api.prototype.GC = function(data) {
	data = data || {};

	if (data.hasOwnProperty("postCount")) {
		faZepto(this.rootElement).find("#fg-post-form" + data.postCount).remove();
		faZepto(this.fgOverlay).find("#fg-post-iframe" + data.postCount).remove();
	}
};



fg_api.prototype.notificationsModule = function() {
	var self = this,
		M;

	function notificationsModule(){ // define private vars
		this.items = [];
	}

	notificationsModule.prototype.init = function() {
		self.notificationArea = self.createElement('div', {'id': 'fg-notifications'});

		self.notificationClose = self.createElement('div', {'class': 'fg-close-notifications'});
		self.notificationClose.innerHTML = self.translate("api.modal_close");
		self.notificationClose.style.display = 'none';

		self.handleClick(self.notificationClose, function(){
			M.closeAll();
		});

		self.notificationArea.appendChild(self.notificationClose);

		self.rootElement.appendChild(self.notificationArea);

		M.listen();
	};

	notificationsModule.prototype.listen = function(){
		// Use postMessage API for "secure" cross-domain message-passing
		window.addEventListener("message", M.receive, false);
	};

	notificationsModule.prototype.receive = function(e){
		if (e.origin !== self.config.urlRoot)
			return;

		var messageObject = e.data;

		if (messageObject.type){
			if (messageObject.type == "notice"){
				self.modal.setCloseCallback(function(){
					M.add(messageObject);
				});
			} else if (messageObject.type == "action" && messageObject.action){
				self[messageObject.action](messageObject.data);
			}
		}
	};

	notificationsModule.prototype.add = function(messageObject){
		if (!messageObject.type || !messageObject.text){
			return false;
		}

		M.closeByClass(messageObject.classes);

		var item = new self.notificationItem(messageObject);

		// Add to document
		self.notificationArea.insertBefore(item.element, self.notificationArea.firstChild);

		M.items.push(item);

		M.showClose();

		return self;
	};

	notificationsModule.prototype.removeFromList = function(item){
		var idx = M.items.indexOf(item);
		M.items.splice(idx, 1);
	};

	notificationsModule.prototype.closeAll = function(){
		while(M.items.length > 0){
			M.items[0].close();
		}
	};

	notificationsModule.prototype.showClose = function(){
		if(M.items.length > 1){
			self.notificationClose.style.opacity = 1;
			self.notificationClose.style.display = "block";
		}
	};

	notificationsModule.prototype.hideClose = function(){
		if(M.items.length <= 1){
			self.notificationClose.style.opacity = 0;
			self.notificationClose.style.display = "none";
		}
	};

	notificationsModule.prototype.closeByClass = function(classes){
		for(var i = 0; i < M.items.length; i++){
			if(M.items[i].classes == classes){
				M.items[i].close();
			}
		}
	};

	//create new instace of Module
	M = new notificationsModule();
	//initialize Module
	M.init();

	return M;
};

fg_api.prototype.notificationItem = function(messageObject) {
	var self = window.famobi,
		M;

	function module(){ // define private vars
		this.element = this.message = "";
	}

	var notificationPrototype = module.prototype;

	notificationPrototype.init = function(messageObject) {
		M.message = messageObject.text;
		M.classes = messageObject.classes;

		var ctaClass = "";
		if(messageObject.text.indexOf("btn-cta") > 0) // check if click to action button is inside
			ctaClass = " fg-notification-cta";

		M.element = document.createElement('div');
		M.element.setAttribute('class', 'fg-notification fg-fade fg-show ' + M.classes + ctaClass);

		var newMessage = document.createElement('div');
		newMessage.setAttribute('class', 'fg-message');
		newMessage.innerHTML = M.message;
		M.element.appendChild(newMessage);

		var closeBtn = document.createElement('div');
		closeBtn.setAttribute('class', 'fg-close-notification icon-cancel');
		M.element.appendChild(closeBtn);

		M.timeout = setTimeout(function(){
			M.close();
		}, 7000);

		if (messageObject.action){
			self.handleClick(M.element, function(){
				self[messageObject.action]();
				self.notifications.closeAll();
			});
		}

		self.handleClick(closeBtn, function(){
			M.close();
		});
	};

	notificationPrototype.close = function(){
		M.element.parentNode.removeChild(M.element);
		clearTimeout(M.timeout);
		self.notifications.removeFromList(M);
		self.notifications.hideClose();
	};

	//create new instace of Module
	M = new module();
	//initialize Module
	M.init(messageObject);

	return M;
};



fg_api.prototype.orientationModule = function() {
	var self = this,
		M;

	function module(){ // define private vars

	}

	var orientationPrototype = module.prototype;

	orientationPrototype.init = function(){
		if (typeof self.config.gameParams.orientation != 'undefined' && 
			!detection.is.pc && window.screen && window.screen.height !== window.screen.width) {
			self.rootElement.className = self.rootElement.className + ' fg-orientation-' + self.config.gameParams.orientation;

			var fgLandscapeOverlay = document.createElement("div");
			fgLandscapeOverlay.setAttribute("id", "fg-landscape-overlay");

			var fgLandscapeImage = document.createElement("img");
			fgLandscapeImage.setAttribute("src", "/html5games/gameapi/v1/images/RotateToLandscape.png");
			fgLandscapeImage.setAttribute("class", "fg-orientation-icon");
			fgLandscapeImage.setAttribute("alt", "switch to landscape");
			fgLandscapeOverlay.appendChild(fgLandscapeImage);

			self.rootElement.appendChild(fgLandscapeOverlay);

			var fgPortraitOverlay = document.createElement("div");
			fgPortraitOverlay.setAttribute("id", "fg-portrait-overlay");

			var fgPortraitImage = document.createElement("img");
			fgPortraitImage.setAttribute("src", "/html5games/gameapi/v1/images/RotateToPortrait.png");
			fgPortraitImage.setAttribute("class", "fg-orientation-icon");
			fgPortraitImage.setAttribute("alt", "switch to portrait");
			fgPortraitOverlay.appendChild(fgPortraitImage);

			self.rootElement.appendChild(fgPortraitOverlay);

			faZepto(fgLandscapeImage).preventClick();
			faZepto(fgPortraitOverlay).preventClick();
		}
		return self;
	};

	M = new module();
	M.init();

	return M;
};



fg_api.prototype.splashModule = function() {
	var self = this,
		M;

	function module(){ // define private vars

	}

	var splashPrototype = module.prototype;

	splashPrototype.init = function(){
		var fgSplash = document.createElement("div");
		fgSplash.setAttribute("id", "fg-splash-screen");
		fgSplash.setAttribute("style", "bacfground-image: url('"+ self.config.assetsPath +"/images/splashscreen_"+self.config.language+".png');");
		//self.rootElement.appendChild(fgSplash);

		faZepto(fgSplash).preventClick();

		setTimeout(function(){
			fgSplash.parentNode.removeChild(fgSplash);
		}, 2500);
		
		return self;
	};

	//create new instace of Module
	M = new module();
	//initialize Module
	M.init();

	return M;
};





fg_api.prototype.trackingModule = function() {
	var self = this,
		M;

	function module(){ // define private vars

	}

	var trackingPrototype = module.prototype;

	trackingPrototype.init = function() {
		famobi_dataLayer = window.famobi_dataLayer || window.dataLayer || [];

		// Use dataLayer variables
		famobi_dataLayer.push({
			'gameId': self.config.uuid,
			'packageId': window.famobi_gameID,
			'portalId': self.config.pid,
			'affiliateId': self.config.aid
		});

		// Track Gameplay after 30 seconds
		setTimeout(function() {
			M.trackEvent("Target", "Gameplay", famobi_gameID);

			// Track Highscore Session
			if (self.hasFeature("highscores")){
				M.trackPassiveEvent('Highscore event', 'start', famobi_gameID);
			}
		}, 30E3);
	};

	trackingPrototype.data = function(dataObject) {
		famobi_dataLayer.push(dataObject);
	}

	trackingPrototype.trackEvent = function(category, action, label, nonInteraction) {
		if (typeof nonInteraction === 'undefined')
			nonInteraction = false;

		famobi_dataLayer.push({
			'event': 'Ingame event', 
			'eventCategory': category, 
			'eventAction': action, 
			'eventLabel': label,
			'nonInteraction': nonInteraction
		});

		famobi_dataLayer.push({
			'event': undefined,
			'eventCategory': undefined,
			'eventAction': undefined,
			'eventLabel': undefined,
			'nonInteraction': undefined,
		});
	};

	trackingPrototype.trackPassiveEvent = function(category, action, label) {
		return M.trackEvent(category, action, label, true);
	};

	M = new module();
	M.init();

	return M;
};









/* Signals / Events received from the game */
fg_api.prototype.gameStarted = function() {
	this.log("Received gameStarted signal");
};

fg_api.prototype.gamePaused = function() {
	this.log("Received gamePaused signal");
};

fg_api.prototype.gameResumed = function() {
	this.log("Received gameResumed signal");
};

fg_api.prototype.gameOver = function() {
	this.ads.showAd();

	this.log("Received gameOver signal");
};

fg_api.prototype.levelUp = function() {
	this.ads.showAd();

	this.log("Received levelUp signal");
}

fg_api.prototype.setVolume = function(newVolume) {
	this.log("Received volume control signal");
};



fg_api.prototype.gametranslationModule = function() {
	var self = this,
		M;

	function module(){ // define private vars

	}

	var gameTranslationPrototype = module.prototype;

	gameTranslationPrototype.init = function() {
		M.curLangString = M.getUserLang();

		M.translationData = M.getGameTranslations();

		M.translateHtml(faZepto('body'));
	};

	gameTranslationPrototype.getSupportedLanguages = function() {
		return self.config.languages;
	};

	gameTranslationPrototype.getGameTranslations = function() {
		var i18n = self.config.game_i18n,
			lang = M.curLangString;

		if (i18n.current) {
			return i18n.current;
		}

		faZepto.each(i18n, function (language, translations) {
			faZepto.each(translations, function(key, value) {
				if(value == null){
					i18n[language][key] = "";
				} else {
					i18n[language][key] = value.replace(/\{lang\}/g, language);
				}
			});
		});

		if (i18n[lang]) {
			i18n.current = faZepto.extend(i18n["default"], i18n[lang]);
		} else {
			i18n.current = i18n["default"];
		}

		return (self.config.game_i18n.current = i18n.current);
	};

	gameTranslationPrototype.translateString = function(key){
		return M.translationData[key] || null;
	};

	gameTranslationPrototype.getNavigatorLocale = function() {
		var language = "";

		if (navigator.language) {
			language = navigator.language;
		} else if (navigator.userLanguage) {
			language = navigator.userLanguage;
		} else if (navigator.browserLanguage) {
			language = navigator.browserLanguage;
		}

		return language;
	};

	gameTranslationPrototype.getNavigatorLanguage = function() {
		return M.getNavigatorLocale().substr(0, 2);
	};

	gameTranslationPrototype.getUserLang = function() {
		var urlParams = self.getUrlParams(),
			supportedLangs = M.getSupportedLanguages(),
			lang = M.getNavigatorLanguage();

		if (urlParams.locale && faZepto.inArray(urlParams.locale, supportedLangs) > -1){
			return urlParams.locale;
		}

		switch (lang) {
			case "ch":
			case "at":
				return "de";
			case "de":
			case "en":
			case "tr":
				return lang;
			default:
				return faZepto.inArray(lang, supportedLangs) ? lang : "en";
		}
	};

	gameTranslationPrototype.translateHtml = function ($selector) {
		$selector.find('[data-i18n]').each(function() {
			var textkey = this.getAttribute('data-i18n');
			this.innerHTML = M.translateString(textkey);
		});
	};

	gameTranslationPrototype.translateXml = function (xml) {
		if (!xml) {
			return xml;
		}

		var $xml = jQuery(jQuery.parseXML(xml)),
			prefix = xml.substr(0, xml.indexOf("\n"));

		self.log($xml);

		$xml.find('[data-i18n]').each(function() {
			var textkey = this.getAttribute('data-i18n');
			jQuery(this).text(M.translateString(textkey));
		});

		var tagName = $xml.get(0).documentElement.tagName;
		try {
			xml = (new XMLSerializer()).serializeToString($xml.get(0));
		} catch (ex) {
			// xml = prefix + "\n" + "<" + tagName + ">" + $xml.get(0).documentElement + "</" + tagName + ">";
		}

		self.log(xml);

		return xml;
	};

	M = new module();

	M.init();

	return M;
};

fg_api.prototype.__ = function (key) {
	return this.gametranslation.translateString(key);
};

// Alias for __()
fg_api.prototype.translate = function(key) {
	return this.__(key);
};

fg_api.prototype.translateHtml = function() {
	return this.gametranslation.translateHtml.apply(this, arguments);
};

fg_api.prototype.translateXml = function() {
	return this.gametranslation.translateXml.apply(this, arguments);
};

fg_api.prototype.getCurrentLanguage = function () {
	return this.gametranslation.curLangString;
};



fg_api.prototype.gameModule = function() {
	var self = this,
		M;

	function module(){ // define private vars

	}

	var gamePrototype = module.prototype;

	gamePrototype.init = function() {
		(function executeScript(gameJS) {
			if (!gameJS.length) {
				faZepto(self.rootElement).trigger('faGame:loaded');
				self.spinner.hide();
				return;
			}
			var currentScript = gameJS.shift(),
				callback = function() {
					executeScript(gameJS);
				};

			if (typeof currentScript === "function") {
				currentScript();
				callback();
			} else {
				var scriptEl = document.createElement("script");
				scriptEl.src = currentScript;
				scriptEl.onload = callback;
				self.bodyElement.appendChild(scriptEl);
			}
		})(window.famobi_gameJS);
	};

	M = new module();
	M.init();

	return M;
};



fg_api.prototype.fullscreenModule = function() {
	var self = this,
		M;

	function module(){ // define private vars
		this.isSupported = false;
	}

	var fullscreenPrototype = module.prototype;

	fullscreenPrototype.init = function() {
		var elem = document.documentElement;

		try {
			if (!elem) {
				throw('documentElement not supported');
			}

			if (!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled)) {
				throw('Fullscreen mode not supported');
			}

			if (elem.requestFullscreen) {
				this.requestFullscreen = 'requestFullscreen';
			} else if (elem.webkitRequestFullscreen) {
				this.requestFullscreen = 'webkitRequestFullscreen';
			} else if (elem.mozRequestFullScreen) {
				this.requestFullscreen = 'mozRequestFullScreen';
			} else if (elem.msRequestFullscreen) {
				this.requestFullscreen = 'msRequestFullscreen';
			} else {
				throw('Fullscreen API not supported');
			}

			this.isSupported = this.requestFullscreen && !detection.is.pc;
		} catch (ex) {
			this.isSupported = false;
		} finally {
			if (!this.isSupported) {
				faZepto("[data-famobi-fullscreen]").remove();
			}
		}
	};

	fullscreenPrototype.isSupported = function() {
		return this.isSupported;
	}

	fullscreenPrototype.start = function() {
		var elem = document.documentElement;

		elem[this.requestFullscreen]();

		return true;
	}

	fullscreenPrototype.stop = function() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}

		return true;
	}

	fullscreenPrototype.toggle = function() {
		if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
			return M.start();
		} else {
			return M.stop();
		}
	}

	M = new module();
	M.init();

	return M;
};



fg_api.prototype.init = function() {
	var self = this;
	self.rootElement = document.getElementById("fg-root");
	self.bodyElement = document.getElementsByTagName("body")[0];
	self.headElement = document.getElementsByTagName("head")[0];

	if (!self.rootElement){
		self.log("could not find fg-root node (insert <div id=\"fg-root\"></div> before script tag)");
		self.rootElement = self.createElement("div", {
			"id": "fg-root",
			"class": "fg-root"
		});
		document.body.insertBefore(self.rootElement,document.body.firstChild);
	}

	self.fgOverlay = self.createElement("div", {"id": "fg-overlay"});

	if(self.config.gameParams.overlay_position)
		self.fgOverlay.className = 'overlay-' + self.config.gameParams.overlay_position + ' clip-' + self.config.gameParams.overlay_position;

	if(self.config.gameParams.overlay_distance && self.config.gameParams.overlay_distance !== ''){
		if(self.config.gameParams.overlay_position && self.config.gameParams.overlay_position == "bottom")
			self.fgOverlay.style.bottom = self.config.gameParams.overlay_distance + "px";
		else
			self.fgOverlay.style.top = self.config.gameParams.overlay_distance + "px";
	}

	self.rootElement.appendChild(self.fgOverlay);

	document.title = JSON.parse(self.config.name);

	function require(module) {
		return self[module + "Module"].call(self, Array.prototype.slice.call(arguments, 1));
	}

	function onloadCallback(){
		// keep order
		self.gametranslation= require("gametranslation");
		// navigation first, because event handlers and language switches otherwise don't work
		self.navigation 	= require("navigation");
		// spinner first, used by game
		self.spinner 		= require("spinner").show();
		self.game 			= require("game");
		self.tracking 		= require("tracking");
		self.modal          = require("modal");
		self.iframe 		= require("iframe");
		self.login 			= require("login");
		self.highscores 	= require("highscores");
		self.screenshot 	= require("screenshot");
		self.localStorage 	= require("storage", "localStorage");
		self.sessionStorage = require("storage", "sessionStorage");
		self.notifications 	= require("notifications");
		self.adapters 		= require("adapters");
		self.ads 			= require("ads");
		self.fullscreen		= require("fullscreen");
		self.orientation	= require("orientation");

		if (detection.is.pc && window.console) {
			console.log("%c HTML5Games.com ", "background: #e44c25; color: #fff; border-right: 100px solid #fc6; border-left: 10px solid #000;");
		}
	}

	var newStylesheet = document.createElement("link");
	newStylesheet.setAttribute("rel", "stylesheet");
	newStylesheet.setAttribute("type", "text/css");
	newStylesheet.setAttribute("href", self.config.assetsPath + "/css/play.css");
	// newStylesheet.onload = onloadCallback;
	self.onloadTimer = setTimeout(onloadCallback, 750);
	self.headElement.appendChild(newStylesheet);

	return self;
};
