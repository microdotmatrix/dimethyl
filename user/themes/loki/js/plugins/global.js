/*! cash-dom 1.3.5, https://github.com/kenwheeler/cash @license MIT */
(function (factory) {
   window.cash = factory();
 })(function () {
   var doc = document, win = window, ArrayProto = Array.prototype, slice = ArrayProto.slice, filter = ArrayProto.filter, push = ArrayProto.push;
 
   var noop = function () {}, isFunction = function (item) {
     // @see https://crbug.com/568448
     return typeof item === typeof noop && item.call;
   }, isString = function (item) {
     return typeof item === typeof "";
   };
 
   var idMatch = /^#[\w-]*$/, classMatch = /^\.[\w-]*$/, htmlMatch = /<.+>/, singlet = /^\w+$/;
 
   function find(selector, context) {
     context = context || doc;
     var elems = (classMatch.test(selector) ? context.getElementsByClassName(selector.slice(1)) : singlet.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
     return elems;
   }
 
   var frag;
   function parseHTML(str) {
     if (!frag) {
       frag = doc.implementation.createHTMLDocument(null);
       var base = frag.createElement("base");
       base.href = doc.location.href;
       frag.head.appendChild(base);
     }
 
     frag.body.innerHTML = str;
 
     return frag.body.childNodes;
   }
 
   function onReady(fn) {
     if (doc.readyState !== "loading") {
       fn();
     } else {
       doc.addEventListener("DOMContentLoaded", fn);
     }
   }
 
   function Init(selector, context) {
     if (!selector) {
       return this;
     }
 
     // If already a cash collection, don't do any further processing
     if (selector.cash && selector !== win) {
       return selector;
     }
 
     var elems = selector, i = 0, length;
 
     if (isString(selector)) {
       elems = (idMatch.test(selector) ?
       // If an ID use the faster getElementById check
       doc.getElementById(selector.slice(1)) : htmlMatch.test(selector) ?
       // If HTML, parse it into real elements
       parseHTML(selector) :
       // else use `find`
       find(selector, context));
 
       // If function, use as shortcut for DOM ready
     } else if (isFunction(selector)) {
       onReady(selector);return this;
     }
 
     if (!elems) {
       return this;
     }
 
     // If a single DOM element is passed in or received via ID, return the single element
     if (elems.nodeType || elems === win) {
       this[0] = elems;
       this.length = 1;
     } else {
       // Treat like an array and loop through each item.
       length = this.length = elems.length;
       for (; i < length; i++) {
         this[i] = elems[i];
       }
     }
 
     return this;
   }
 
   function cash(selector, context) {
     return new Init(selector, context);
   }
 
   var fn = cash.fn = cash.prototype = Init.prototype = { // jshint ignore:line
     cash: true,
     length: 0,
     push: push,
     splice: ArrayProto.splice,
     map: ArrayProto.map,
     init: Init
   };
 
   Object.defineProperty(fn, "constructor", { value: cash });
 
   cash.parseHTML = parseHTML;
   cash.noop = noop;
   cash.isFunction = isFunction;
   cash.isString = isString;
 
   cash.extend = fn.extend = function (target) {
     target = target || {};
 
     var args = slice.call(arguments), length = args.length, i = 1;
 
     if (args.length === 1) {
       target = this;
       i = 0;
     }
 
     for (; i < length; i++) {
       if (!args[i]) {
         continue;
       }
       for (var key in args[i]) {
         if (args[i].hasOwnProperty(key)) {
           target[key] = args[i][key];
         }
       }
     }
 
     return target;
   };
 
   function each(collection, callback) {
     var l = collection.length, i = 0;
 
     for (; i < l; i++) {
       if (callback.call(collection[i], collection[i], i, collection) === false) {
         break;
       }
     }
   }
 
   function matches(el, selector) {
     var m = el && (el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector);
     return !!m && m.call(el, selector);
   }
 
   function getCompareFunction(selector) {
     return (
     /* Use browser's `matches` function if string */
     isString(selector) ? matches :
     /* Match a cash element */
     selector.cash ? function (el) {
       return selector.is(el);
     } :
     /* Direct comparison */
     function (el, selector) {
       return el === selector;
     });
   }
 
   function unique(collection) {
     return cash(slice.call(collection).filter(function (item, index, self) {
       return self.indexOf(item) === index;
     }));
   }
 
   cash.extend({
     merge: function (first, second) {
       var len = +second.length, i = first.length, j = 0;
 
       for (; j < len; i++, j++) {
         first[i] = second[j];
       }
 
       first.length = i;
       return first;
     },
 
     each: each,
     matches: matches,
     unique: unique,
     isArray: Array.isArray,
     isNumeric: function (n) {
       return !isNaN(parseFloat(n)) && isFinite(n);
     }
 
   });
 
   var uid = cash.uid = "_cash" + Date.now();
 
   function getDataCache(node) {
     return (node[uid] = node[uid] || {});
   }
 
   function setData(node, key, value) {
     return (getDataCache(node)[key] = value);
   }
 
   function getData(node, key) {
     var c = getDataCache(node);
     if (c[key] === undefined) {
       c[key] = node.dataset ? node.dataset[key] : cash(node).attr("data-" + key);
     }
     return c[key];
   }
 
   function removeData(node, key) {
     var c = getDataCache(node);
     if (c) {
       delete c[key];
     } else if (node.dataset) {
       delete node.dataset[key];
     } else {
       cash(node).removeAttr("data-" + name);
     }
   }
 
   fn.extend({
     data: function (name, value) {
       if (isString(name)) {
         return (value === undefined ? getData(this[0], name) : this.each(function (v) {
           return setData(v, name, value);
         }));
       }
 
       for (var key in name) {
         this.data(key, name[key]);
       }
 
       return this;
     },
 
     removeData: function (key) {
       return this.each(function (v) {
         return removeData(v, key);
       });
     }
 
   });
 
   var notWhiteMatch = /\S+/g;
 
   function getClasses(c) {
     return isString(c) && c.match(notWhiteMatch);
   }
 
   function hasClass(v, c) {
     return (v.classList ? v.classList.contains(c) : new RegExp("(^| )" + c + "( |$)", "gi").test(v.className));
   }
 
   function addClass(v, c, spacedName) {
     if (v.classList) {
       v.classList.add(c);
     } else if (spacedName.indexOf(" " + c + " ")) {
       v.className += " " + c;
     }
   }
 
   function removeClass(v, c) {
     if (v.classList) {
       v.classList.remove(c);
     } else {
       v.className = v.className.replace(c, "");
     }
   }
 
   fn.extend({
     addClass: function (c) {
       var classes = getClasses(c);
 
       return (classes ? this.each(function (v) {
         var spacedName = " " + v.className + " ";
         each(classes, function (c) {
           addClass(v, c, spacedName);
         });
       }) : this);
     },
 
     attr: function (name, value) {
       if (!name) {
         return undefined;
       }
 
       if (isString(name)) {
         if (value === undefined) {
           return this[0] ? this[0].getAttribute ? this[0].getAttribute(name) : this[0][name] : undefined;
         }
 
         return this.each(function (v) {
           if (v.setAttribute) {
             v.setAttribute(name, value);
           } else {
             v[name] = value;
           }
         });
       }
 
       for (var key in name) {
         this.attr(key, name[key]);
       }
 
       return this;
     },
 
     hasClass: function (c) {
       var check = false, classes = getClasses(c);
       if (classes && classes.length) {
         this.each(function (v) {
           check = hasClass(v, classes[0]);
           return !check;
         });
       }
       return check;
     },
 
     prop: function (name, value) {
       if (isString(name)) {
         return (value === undefined ? this[0][name] : this.each(function (v) {
           v[name] = value;
         }));
       }
 
       for (var key in name) {
         this.prop(key, name[key]);
       }
 
       return this;
     },
 
     removeAttr: function (name) {
       return this.each(function (v) {
         if (v.removeAttribute) {
           v.removeAttribute(name);
         } else {
           delete v[name];
         }
       });
     },
 
     removeClass: function (c) {
       if (!arguments.length) {
         return this.attr("class", "");
       }
       var classes = getClasses(c);
       return (classes ? this.each(function (v) {
         each(classes, function (c) {
           removeClass(v, c);
         });
       }) : this);
     },
 
     removeProp: function (name) {
       return this.each(function (v) {
         delete v[name];
       });
     },
 
     toggleClass: function (c, state) {
       if (state !== undefined) {
         return this[state ? "addClass" : "removeClass"](c);
       }
       var classes = getClasses(c);
       return (classes ? this.each(function (v) {
         var spacedName = " " + v.className + " ";
         each(classes, function (c) {
           if (hasClass(v, c)) {
             removeClass(v, c);
           } else {
             addClass(v, c, spacedName);
           }
         });
       }) : this);
     } });
 
   fn.extend({
     add: function (selector, context) {
       return unique(cash.merge(this, cash(selector, context)));
     },
 
     each: function (callback) {
       each(this, callback);
       return this;
     },
 
     eq: function (index) {
       return cash(this.get(index));
     },
 
     filter: function (selector) {
       if (!selector) {
         return this;
       }
 
       var comparator = (isFunction(selector) ? selector : getCompareFunction(selector));
 
       return cash(filter.call(this, function (e) {
         return comparator(e, selector);
       }));
     },
 
     first: function () {
       return this.eq(0);
     },
 
     get: function (index) {
       if (index === undefined) {
         return slice.call(this);
       }
       return (index < 0 ? this[index + this.length] : this[index]);
     },
 
     index: function (elem) {
       var child = elem ? cash(elem)[0] : this[0], collection = elem ? this : cash(child).parent().children();
       return slice.call(collection).indexOf(child);
     },
 
     last: function () {
       return this.eq(-1);
     }
 
   });
 
   var camelCase = (function () {
     var camelRegex = /(?:^\w|[A-Z]|\b\w)/g, whiteSpace = /[\s-_]+/g;
     return function (str) {
       return str.replace(camelRegex, function (letter, index) {
         return letter[index === 0 ? "toLowerCase" : "toUpperCase"]();
       }).replace(whiteSpace, "");
     };
   }());
 
   var getPrefixedProp = (function () {
     var cache = {}, doc = document, div = doc.createElement("div"), style = div.style;
 
     return function (prop) {
       prop = camelCase(prop);
       if (cache[prop]) {
         return cache[prop];
       }
 
       var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1), prefixes = ["webkit", "moz", "ms", "o"], props = (prop + " " + (prefixes).join(ucProp + " ") + ucProp).split(" ");
 
       each(props, function (p) {
         if (p in style) {
           cache[p] = prop = cache[prop] = p;
           return false;
         }
       });
 
       return cache[prop];
     };
   }());
 
   cash.prefixedProp = getPrefixedProp;
   cash.camelCase = camelCase;
 
   fn.extend({
     css: function (prop, value) {
       if (isString(prop)) {
         prop = getPrefixedProp(prop);
         return (arguments.length > 1 ? this.each(function (v) {
           return v.style[prop] = value;
         }) : win.getComputedStyle(this[0])[prop]);
       }
 
       for (var key in prop) {
         this.css(key, prop[key]);
       }
 
       return this;
     }
 
   });
 
   function compute(el, prop) {
     return parseInt(win.getComputedStyle(el[0], null)[prop], 10) || 0;
   }
 
   each(["Width", "Height"], function (v) {
     var lower = v.toLowerCase();
 
     fn[lower] = function () {
       return this[0].getBoundingClientRect()[lower];
     };
 
     fn["inner" + v] = function () {
       return this[0]["client" + v];
     };
 
     fn["outer" + v] = function (margins) {
       return this[0]["offset" + v] + (margins ? compute(this, "margin" + (v === "Width" ? "Left" : "Top")) + compute(this, "margin" + (v === "Width" ? "Right" : "Bottom")) : 0);
     };
   });
 
   function registerEvent(node, eventName, callback) {
     var eventCache = getData(node, "_cashEvents") || setData(node, "_cashEvents", {});
     eventCache[eventName] = eventCache[eventName] || [];
     eventCache[eventName].push(callback);
     node.addEventListener(eventName, callback);
   }
 
   function removeEvent(node, eventName, callback) {
     var events = getData(node, "_cashEvents"), eventCache = (events && events[eventName]), index;
 
     if (!eventCache) {
       return;
     }
 
     if (callback) {
       node.removeEventListener(eventName, callback);
       index = eventCache.indexOf(callback);
       if (index >= 0) {
         eventCache.splice(index, 1);
       }
     } else {
       each(eventCache, function (event) {
         node.removeEventListener(eventName, event);
       });
       eventCache = [];
     }
   }
 
   fn.extend({
     off: function (eventName, callback) {
       return this.each(function (v) {
         return removeEvent(v, eventName, callback);
       });
     },
 
     on: function (eventName, delegate, callback, runOnce) {
       // jshint ignore:line
       var originalCallback;
       if (!isString(eventName)) {
         for (var key in eventName) {
           this.on(key, delegate, eventName[key]);
         }
         return this;
       }
 
       if (isFunction(delegate)) {
         callback = delegate;
         delegate = null;
       }
 
       if (eventName === "ready") {
         onReady(callback);
         return this;
       }
 
       if (delegate) {
         originalCallback = callback;
         callback = function (e) {
           var t = e.target;
           while (!matches(t, delegate)) {
             if (t === this || t === null) {
               return (t = false);
             }
 
             t = t.parentNode;
           }
 
           if (t) {
             originalCallback.call(t, e);
           }
         };
       }
 
       return this.each(function (v) {
         var finalCallback = callback;
         if (runOnce) {
           finalCallback = function () {
             callback.apply(this, arguments);
             removeEvent(v, eventName, finalCallback);
           };
         }
         registerEvent(v, eventName, finalCallback);
       });
     },
 
     one: function (eventName, delegate, callback) {
       return this.on(eventName, delegate, callback, true);
     },
 
     ready: onReady,
 
     /**
      * Modified
      * Triggers browser event
      * @param String eventName
      * @param Object data - Add properties to event object
      */
     trigger: function (eventName, data) {
       if (document.createEvent) {
         let evt = document.createEvent('HTMLEvents');
         evt.initEvent(eventName, true, false);
         evt = this.extend(evt, data);
         return this.each(function (v) {
           return v.dispatchEvent(evt);
         });
       }
     }
 
   });
 
   function encode(name, value) {
     return "&" + encodeURIComponent(name) + "=" + encodeURIComponent(value).replace(/%20/g, "+");
   }
 
   function getSelectMultiple_(el) {
     var values = [];
     each(el.options, function (o) {
       if (o.selected) {
         values.push(o.value);
       }
     });
     return values.length ? values : null;
   }
 
   function getSelectSingle_(el) {
     var selectedIndex = el.selectedIndex;
     return selectedIndex >= 0 ? el.options[selectedIndex].value : null;
   }
 
   function getValue(el) {
     var type = el.type;
     if (!type) {
       return null;
     }
     switch (type.toLowerCase()) {
       case "select-one":
         return getSelectSingle_(el);
       case "select-multiple":
         return getSelectMultiple_(el);
       case "radio":
         return (el.checked) ? el.value : null;
       case "checkbox":
         return (el.checked) ? el.value : null;
       default:
         return el.value ? el.value : null;
     }
   }
 
   fn.extend({
     serialize: function () {
       var query = "";
 
       each(this[0].elements || this, function (el) {
         if (el.disabled || el.tagName === "FIELDSET") {
           return;
         }
         var name = el.name;
         switch (el.type.toLowerCase()) {
           case "file":
           case "reset":
           case "submit":
           case "button":
             break;
           case "select-multiple":
             var values = getValue(el);
             if (values !== null) {
               each(values, function (value) {
                 query += encode(name, value);
               });
             }
             break;
           default:
             var value = getValue(el);
             if (value !== null) {
               query += encode(name, value);
             }
         }
       });
 
       return query.substr(1);
     },
 
     val: function (value) {
       if (value === undefined) {
         return getValue(this[0]);
       }
 
       return this.each(function (v) {
         return v.value = value;
       });
     }
 
   });
 
   function insertElement(el, child, prepend) {
     if (prepend) {
       var first = el.childNodes[0];
       el.insertBefore(child, first);
     } else {
       el.appendChild(child);
     }
   }
 
   function insertContent(parent, child, prepend) {
     var str = isString(child);
 
     if (!str && child.length) {
       each(child, function (v) {
         return insertContent(parent, v, prepend);
       });
       return;
     }
 
     each(parent, str ? function (v) {
       return v.insertAdjacentHTML(prepend ? "afterbegin" : "beforeend", child);
     } : function (v, i) {
       return insertElement(v, (i === 0 ? child : child.cloneNode(true)), prepend);
     });
   }
 
   fn.extend({
     after: function (selector) {
       cash(selector).insertAfter(this);
       return this;
     },
 
     append: function (content) {
       insertContent(this, content);
       return this;
     },
 
     appendTo: function (parent) {
       insertContent(cash(parent), this);
       return this;
     },
 
     before: function (selector) {
       cash(selector).insertBefore(this);
       return this;
     },
 
     clone: function () {
       return cash(this.map(function (v) {
         return v.cloneNode(true);
       }));
     },
 
     empty: function () {
       this.html("");
       return this;
     },
 
     html: function (content) {
       if (content === undefined) {
         return this[0].innerHTML;
       }
       var source = (content.nodeType ? content[0].outerHTML : content);
       return this.each(function (v) {
         return v.innerHTML = source;
       });
     },
 
     insertAfter: function (selector) {
       var _this = this;
 
 
       cash(selector).each(function (el, i) {
         var parent = el.parentNode, sibling = el.nextSibling;
         _this.each(function (v) {
           parent.insertBefore((i === 0 ? v : v.cloneNode(true)), sibling);
         });
       });
 
       return this;
     },
 
     insertBefore: function (selector) {
       var _this2 = this;
       cash(selector).each(function (el, i) {
         var parent = el.parentNode;
         _this2.each(function (v) {
           parent.insertBefore((i === 0 ? v : v.cloneNode(true)), el);
         });
       });
       return this;
     },
 
     prepend: function (content) {
       insertContent(this, content, true);
       return this;
     },
 
     prependTo: function (parent) {
       insertContent(cash(parent), this, true);
       return this;
     },
 
     remove: function () {
       return this.each(function (v) {
         if (!!v.parentNode) {
           return v.parentNode.removeChild(v);
         }
       });
     },
 
     text: function (content) {
       if (content === undefined) {
         return this[0].textContent;
       }
       return this.each(function (v) {
         return v.textContent = content;
       });
     }
 
   });
 
   var docEl = doc.documentElement;
 
   fn.extend({
     position: function () {
       var el = this[0];
       return {
         left: el.offsetLeft,
         top: el.offsetTop
       };
     },
 
     offset: function () {
       var rect = this[0].getBoundingClientRect();
       return {
         top: rect.top + win.pageYOffset - docEl.clientTop,
         left: rect.left + win.pageXOffset - docEl.clientLeft
       };
     },
 
     offsetParent: function () {
       return cash(this[0].offsetParent);
     }
 
   });
 
   fn.extend({
     children: function (selector) {
       var elems = [];
       this.each(function (el) {
         push.apply(elems, el.children);
       });
       elems = unique(elems);
 
       return (!selector ? elems : elems.filter(function (v) {
         return matches(v, selector);
       }));
     },
 
     closest: function (selector) {
       if (!selector || this.length < 1) {
         return cash();
       }
       if (this.is(selector)) {
         return this.filter(selector);
       }
       return this.parent().closest(selector);
     },
 
     is: function (selector) {
       if (!selector) {
         return false;
       }
 
       var match = false, comparator = getCompareFunction(selector);
 
       this.each(function (el) {
         match = comparator(el, selector);
         return !match;
       });
 
       return match;
     },
 
     find: function (selector) {
       if (!selector || selector.nodeType) {
         return cash(selector && this.has(selector).length ? selector : null);
       }
 
       var elems = [];
       this.each(function (el) {
         push.apply(elems, find(selector, el));
       });
 
       return unique(elems);
     },
 
     has: function (selector) {
       var comparator = (isString(selector) ? function (el) {
         return find(selector, el).length !== 0;
       } : function (el) {
         return el.contains(selector);
       });
 
       return this.filter(comparator);
     },
 
     next: function () {
       return cash(this[0].nextElementSibling);
     },
 
     not: function (selector) {
       if (!selector) {
         return this;
       }
 
       var comparator = getCompareFunction(selector);
 
       return this.filter(function (el) {
         return !comparator(el, selector);
       });
     },
 
     parent: function () {
       var result = [];
 
       this.each(function (item) {
         if (item && item.parentNode) {
           result.push(item.parentNode);
         }
       });
 
       return unique(result);
     },
 
     parents: function (selector) {
       var last, result = [];
 
       this.each(function (item) {
         last = item;
 
         while (last && last.parentNode && last !== doc.body.parentNode) {
           last = last.parentNode;
 
           if (!selector || (selector && matches(last, selector))) {
             result.push(last);
           }
         }
       });
 
       return unique(result);
     },
 
     prev: function () {
       return cash(this[0].previousElementSibling);
     },
 
     siblings: function (selector) {
       var collection = this.parent().children(selector), el = this[0];
 
       return collection.filter(function (i) {
         return i !== el;
       });
     }
 
   });
 
 
   return cash;
 });
 
 class Component {
   /**
    * Generic constructor for all components
    * @constructor
    * @param {Element} el
    * @param {Object} options
    */
   constructor(classDef, el, options) {
     // Display error if el is valid HTML Element
     if (!(el instanceof Element)) {
       console.error(Error(el + ' is not an HTML Element'));
     }
 
     // If exists, destroy and reinitialize in child
     let ins = classDef.getInstance(el);
     if (!!ins) {
       ins.destroy();
     }
 
     this.el = el;
     this.$el = cash(el);
   }
 
   /**
    * Initializes components
    * @param {class} classDef
    * @param {Element | NodeList | jQuery} els
    * @param {Object} options
    */
   static init(classDef, els, options) {
     let instances = null;
     if (els instanceof Element) {
       instances = new classDef(els, options);
     } else if (!!els && (els.jquery || els.cash || els instanceof NodeList)) {
       let instancesArr = [];
       for (let i = 0; i < els.length; i++) {
         instancesArr.push(new classDef(els[i], options));
       }
       instances = instancesArr;
     }
 
     return instances;
   }
 }
 

// Required for Meteor package, the use of window prevents export by Meteor
(function(window) {
   if (window.Package) {
     M = {};
   } else {
     window.M = {};
   }
 
   // Check for jQuery
   M.jQueryLoaded = !!window.jQuery;
 })(window);
 
 // AMD
 if (typeof define === 'function' && define.amd) {
   define('M', [], function() {
     return M;
   });
 
   // Common JS
 } else if (typeof exports !== 'undefined' && !exports.nodeType) {
   if (typeof module !== 'undefined' && !module.nodeType && module.exports) {
     exports = module.exports = M;
   }
   exports.default = M;
 }
 
 M.version = '1.0.0';
 
 M.keys = {
   TAB: 9,
   ENTER: 13,
   ESC: 27,
   ARROW_UP: 38,
   ARROW_DOWN: 40
 };
 
 /**
  * TabPress Keydown handler
  */
 M.tabPressed = false;
 M.keyDown = false;
 let docHandleKeydown = function(e) {
   M.keyDown = true;
   if (e.which === M.keys.TAB || e.which === M.keys.ARROW_DOWN || e.which === M.keys.ARROW_UP) {
     M.tabPressed = true;
   }
 };
 let docHandleKeyup = function(e) {
   M.keyDown = false;
   if (e.which === M.keys.TAB || e.which === M.keys.ARROW_DOWN || e.which === M.keys.ARROW_UP) {
     M.tabPressed = false;
   }
 };
 let docHandleFocus = function(e) {
   if (M.keyDown) {
     document.body.classList.add('keyboard-focused');
   }
 };
 let docHandleBlur = function(e) {
   document.body.classList.remove('keyboard-focused');
 };
 document.addEventListener('keydown', docHandleKeydown, true);
 document.addEventListener('keyup', docHandleKeyup, true);
 document.addEventListener('focus', docHandleFocus, true);
 document.addEventListener('blur', docHandleBlur, true);
 
 /**
  * Initialize jQuery wrapper for plugin
  * @param {Class} plugin  javascript class
  * @param {string} pluginName  jQuery plugin name
  * @param {string} classRef  Class reference name
  */
 M.initializeJqueryWrapper = function(plugin, pluginName, classRef) {
   jQuery.fn[pluginName] = function(methodOrOptions) {
     // Call plugin method if valid method name is passed in
     if (plugin.prototype[methodOrOptions]) {
       let params = Array.prototype.slice.call(arguments, 1);
 
       // Getter methods
       if (methodOrOptions.slice(0, 3) === 'get') {
         let instance = this.first()[0][classRef];
         return instance[methodOrOptions].apply(instance, params);
       }
 
       // Void methods
       return this.each(function() {
         let instance = this[classRef];
         instance[methodOrOptions].apply(instance, params);
       });
 
       // Initialize plugin if options or no argument is passed in
     } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
       plugin.init(this, arguments[0]);
       return this;
     }
 
     // Return error if an unrecognized  method name is passed in
     jQuery.error(`Method ${methodOrOptions} does not exist on jQuery.${pluginName}`);
   };
 };
 
 /**
  * Automatically initialize components
  * @param {Element} context  DOM Element to search within for components
  */
 M.AutoInit = function(context) {
   // Use document.body if no context is given
   let root = !!context ? context : document.body;
 
   let registry = {
     Autocomplete: root.querySelectorAll('.autocomplete:not(.no-autoinit)'),
     Carousel: root.querySelectorAll('.carousel:not(.no-autoinit)'),
     Chips: root.querySelectorAll('.chips:not(.no-autoinit)'),
     Collapsible: root.querySelectorAll('.collapsible:not(.no-autoinit)'),
     Datepicker: root.querySelectorAll('.datepicker:not(.no-autoinit)'),
     Dropdown: root.querySelectorAll('.dropdown-trigger:not(.no-autoinit)'),
     Materialbox: root.querySelectorAll('.materialboxed:not(.no-autoinit)'),
     Modal: root.querySelectorAll('.modal:not(.no-autoinit)'),
     Parallax: root.querySelectorAll('.parallax:not(.no-autoinit)'),
     Pushpin: root.querySelectorAll('.pushpin:not(.no-autoinit)'),
     ScrollSpy: root.querySelectorAll('.scrollspy:not(.no-autoinit)'),
     FormSelect: root.querySelectorAll('select:not(.no-autoinit)'),
     Sidenav: root.querySelectorAll('.sidenav:not(.no-autoinit)'),
     Tabs: root.querySelectorAll('.tabs:not(.no-autoinit)'),
     TapTarget: root.querySelectorAll('.tap-target:not(.no-autoinit)'),
     Timepicker: root.querySelectorAll('.timepicker:not(.no-autoinit)'),
     Tooltip: root.querySelectorAll('.tooltipped:not(.no-autoinit)'),
     FloatingActionButton: root.querySelectorAll('.fixed-action-btn:not(.no-autoinit)')
   };
 
   for (let pluginName in registry) {
     let plugin = M[pluginName];
     plugin.init(registry[pluginName]);
   }
 };
 
 /**
  * Generate approximated selector string for a jQuery object
  * @param {jQuery} obj  jQuery object to be parsed
  * @returns {string}
  */
 M.objectSelectorString = function(obj) {
   let tagStr = obj.prop('tagName') || '';
   let idStr = obj.attr('id') || '';
   let classStr = obj.attr('class') || '';
   return (tagStr + idStr + classStr).replace(/\s/g, '');
 };
 
 // Unique Random ID
 M.guid = (function() {
   function s4() {
     return Math.floor((1 + Math.random()) * 0x10000)
       .toString(16)
       .substring(1);
   }
   return function() {
     return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
   };
 })();
 
 /**
  * Escapes hash from special characters
  * @param {string} hash  String returned from this.hash
  * @returns {string}
  */
 M.escapeHash = function(hash) {
   return hash.replace(/(:|\.|\[|\]|,|=|\/)/g, '\\$1');
 };
 
 M.elementOrParentIsFixed = function(element) {
   let $element = $(element);
   let $checkElements = $element.add($element.parents());
   let isFixed = false;
   $checkElements.each(function() {
     if ($(this).css('position') === 'fixed') {
       isFixed = true;
       return false;
     }
   });
   return isFixed;
 };
 
 /**
  * @typedef {Object} Edges
  * @property {Boolean} top  If the top edge was exceeded
  * @property {Boolean} right  If the right edge was exceeded
  * @property {Boolean} bottom  If the bottom edge was exceeded
  * @property {Boolean} left  If the left edge was exceeded
  */
 
 /**
  * @typedef {Object} Bounding
  * @property {Number} left  left offset coordinate
  * @property {Number} top  top offset coordinate
  * @property {Number} width
  * @property {Number} height
  */
 
 /**
  * Escapes hash from special characters
  * @param {Element} container  Container element that acts as the boundary
  * @param {Bounding} bounding  element bounding that is being checked
  * @param {Number} offset  offset from edge that counts as exceeding
  * @returns {Edges}
  */
 M.checkWithinContainer = function(container, bounding, offset) {
   let edges = {
     top: false,
     right: false,
     bottom: false,
     left: false
   };
 
   let containerRect = container.getBoundingClientRect();
   // If body element is smaller than viewport, use viewport height instead.
   let containerBottom =
     container === document.body
       ? Math.max(containerRect.bottom, window.innerHeight)
       : containerRect.bottom;
 
   let scrollLeft = container.scrollLeft;
   let scrollTop = container.scrollTop;
 
   let scrolledX = bounding.left - scrollLeft;
   let scrolledY = bounding.top - scrollTop;
 
   // Check for container and viewport for each edge
   if (scrolledX < containerRect.left + offset || scrolledX < offset) {
     edges.left = true;
   }
 
   if (
     scrolledX + bounding.width > containerRect.right - offset ||
     scrolledX + bounding.width > window.innerWidth - offset
   ) {
     edges.right = true;
   }
 
   if (scrolledY < containerRect.top + offset || scrolledY < offset) {
     edges.top = true;
   }
 
   if (
     scrolledY + bounding.height > containerBottom - offset ||
     scrolledY + bounding.height > window.innerHeight - offset
   ) {
     edges.bottom = true;
   }
 
   return edges;
 };
 
 M.checkPossibleAlignments = function(el, container, bounding, offset) {
   let canAlign = {
     top: true,
     right: true,
     bottom: true,
     left: true,
     spaceOnTop: null,
     spaceOnRight: null,
     spaceOnBottom: null,
     spaceOnLeft: null
   };
 
   let containerAllowsOverflow = getComputedStyle(container).overflow === 'visible';
   let containerRect = container.getBoundingClientRect();
   let containerHeight = Math.min(containerRect.height, window.innerHeight);
   let containerWidth = Math.min(containerRect.width, window.innerWidth);
   let elOffsetRect = el.getBoundingClientRect();
 
   let scrollLeft = container.scrollLeft;
   let scrollTop = container.scrollTop;
 
   let scrolledX = bounding.left - scrollLeft;
   let scrolledYTopEdge = bounding.top - scrollTop;
   let scrolledYBottomEdge = bounding.top + elOffsetRect.height - scrollTop;
 
   // Check for container and viewport for left
   canAlign.spaceOnRight = !containerAllowsOverflow
     ? containerWidth - (scrolledX + bounding.width)
     : window.innerWidth - (elOffsetRect.left + bounding.width);
   if (canAlign.spaceOnRight < 0) {
     canAlign.left = false;
   }
 
   // Check for container and viewport for Right
   canAlign.spaceOnLeft = !containerAllowsOverflow
     ? scrolledX - bounding.width + elOffsetRect.width
     : elOffsetRect.right - bounding.width;
   if (canAlign.spaceOnLeft < 0) {
     canAlign.right = false;
   }
 
   // Check for container and viewport for Top
   canAlign.spaceOnBottom = !containerAllowsOverflow
     ? containerHeight - (scrolledYTopEdge + bounding.height + offset)
     : window.innerHeight - (elOffsetRect.top + bounding.height + offset);
   if (canAlign.spaceOnBottom < 0) {
     canAlign.top = false;
   }
 
   // Check for container and viewport for Bottom
   canAlign.spaceOnTop = !containerAllowsOverflow
     ? scrolledYBottomEdge - (bounding.height - offset)
     : elOffsetRect.bottom - (bounding.height + offset);
   if (canAlign.spaceOnTop < 0) {
     canAlign.bottom = false;
   }
 
   return canAlign;
 };
 
 M.getOverflowParent = function(element) {
   if (element == null) {
     return null;
   }
 
   if (element === document.body || getComputedStyle(element).overflow !== 'visible') {
     return element;
   }
 
   return M.getOverflowParent(element.parentElement);
 };
 
 /**
  * Gets id of component from a trigger
  * @param {Element} trigger  trigger
  * @returns {string}
  */
 M.getIdFromTrigger = function(trigger) {
   let id = trigger.getAttribute('data-target');
   if (!id) {
     id = trigger.getAttribute('href');
     if (id) {
       id = id.slice(1);
     } else {
       id = '';
     }
   }
   return id;
 };
 
 /**
  * Multi browser support for document scroll top
  * @returns {Number}
  */
 M.getDocumentScrollTop = function() {
   return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
 };
 
 /**
  * Multi browser support for document scroll left
  * @returns {Number}
  */
 M.getDocumentScrollLeft = function() {
   return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
 };
 
 /**
  * @typedef {Object} Edges
  * @property {Boolean} top  If the top edge was exceeded
  * @property {Boolean} right  If the right edge was exceeded
  * @property {Boolean} bottom  If the bottom edge was exceeded
  * @property {Boolean} left  If the left edge was exceeded
  */
 
 /**
  * @typedef {Object} Bounding
  * @property {Number} left  left offset coordinate
  * @property {Number} top  top offset coordinate
  * @property {Number} width
  * @property {Number} height
  */
 
 /**
  * Get time in ms
  * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
  * @type {function}
  * @return {number}
  */
 let getTime =
   Date.now ||
   function() {
     return new Date().getTime();
   };
 
 /**
  * Returns a function, that, when invoked, will only be triggered at most once
  * during a given window of time. Normally, the throttled function will run
  * as much as it can, without ever going more than once per `wait` duration;
  * but if you'd like to disable the execution on the leading edge, pass
  * `{leading: false}`. To disable execution on the trailing edge, ditto.
  * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
  * @param {function} func
  * @param {number} wait
  * @param {Object=} options
  * @returns {Function}
  */
 M.throttle = function(func, wait, options) {
   let context, args, result;
   let timeout = null;
   let previous = 0;
   options || (options = {});
   let later = function() {
     previous = options.leading === false ? 0 : getTime();
     timeout = null;
     result = func.apply(context, args);
     context = args = null;
   };
   return function() {
     let now = getTime();
     if (!previous && options.leading === false) previous = now;
     let remaining = wait - (now - previous);
     context = this;
     args = arguments;
     if (remaining <= 0) {
       clearTimeout(timeout);
       timeout = null;
       previous = now;
       result = func.apply(context, args);
       context = args = null;
     } else if (!timeout && options.trailing !== false) {
       timeout = setTimeout(later, remaining);
     }
     return result;
   };
 };
 