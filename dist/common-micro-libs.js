!function(root, factory) {
    "object" === typeof exports && "object" === typeof module ? module.exports = factory() : "function" === typeof define && define.amd ? define([], factory) : "object" === typeof exports ? exports.CommonMicroLibs = factory() : root.CommonMicroLibs = factory();
}("undefined" !== typeof self ? self : this, function() {
    /******/
    return function(modules) {
        // webpackBootstrap
        /******/
        // The module cache
        /******/
        var installedModules = {};
        /******/
        /******/
        // The require function
        /******/
        function __webpack_require__(moduleId) {
            /******/
            /******/
            // Check if module is in cache
            /******/
            if (installedModules[moduleId]) /******/
            return installedModules[moduleId].exports;
            /******/
            // Create a new module (and put it into the cache)
            /******/
            var module = installedModules[moduleId] = {
                /******/
                i: moduleId,
                /******/
                l: false,
                /******/
                exports: {}
            };
            /******/
            /******/
            // Execute the module function
            /******/
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /******/
            /******/
            // Flag the module as loaded
            /******/
            module.l = true;
            /******/
            /******/
            // Return the exports of the module
            /******/
            return module.exports;
        }
        /******/
        /******/
        /******/
        // expose the modules object (__webpack_modules__)
        /******/
        __webpack_require__.m = modules;
        /******/
        /******/
        // expose the module cache
        /******/
        __webpack_require__.c = installedModules;
        /******/
        /******/
        // define getter function for harmony exports
        /******/
        __webpack_require__.d = function(exports, name, getter) {
            /******/
            __webpack_require__.o(exports, name) || /******/
            Object.defineProperty(exports, name, {
                /******/
                configurable: false,
                /******/
                enumerable: true,
                /******/
                get: getter
            });
        };
        /******/
        /******/
        // getDefaultExport function for compatibility with non-harmony modules
        /******/
        __webpack_require__.n = function(module) {
            /******/
            var getter = module && module.__esModule ? /******/
            function() {
                return module.default;
            } : /******/
            function() {
                return module;
            };
            /******/
            __webpack_require__.d(getter, "a", getter);
            /******/
            return getter;
        };
        /******/
        /******/
        // Object.prototype.hasOwnProperty.call
        /******/
        __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        /******/
        /******/
        // __webpack_public_path__
        /******/
        __webpack_require__.p = "";
        /******/
        /******/
        // Load entry module and return exports
        /******/
        return __webpack_require__(__webpack_require__.s = 40);
    }([ /* 0 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return dataStore;
        });
        // POLYFILL FOR WEAKMAP
        //  [pt] changed how "delete" is defined so that it can work in IE8
        /* jshint ignore:start */
        /**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
        "undefined" === typeof WeakMap && function() {
            var defineProperty = Object.defineProperty;
            var counter = Date.now() % 1e9;
            var WeakMap = function() {
                this.name = "__st" + (1e9 * Math.random() >>> 0) + counter++ + "__";
            };
            WeakMap.prototype = {
                set: function(key, value) {
                    var entry = key[this.name];
                    entry && entry[0] === key ? entry[1] = value : defineProperty(key, this.name, {
                        value: [ key, value ],
                        writable: true
                    });
                    return this;
                },
                get: function(key) {
                    var entry;
                    return (entry = key[this.name]) && entry[0] === key ? entry[1] : void 0;
                },
                // [pt] Quotes around the delete property needed for IE8
                delete: function(key) {
                    var entry = key[this.name];
                    if (!entry || entry[0] !== key) return false;
                    entry[0] = entry[1] = void 0;
                    return true;
                },
                has: function(key) {
                    var entry = key[this.name];
                    if (!entry) return false;
                    return entry[0] === key;
                }
            };
            window.WeakMap = WeakMap;
        }();
        /* jshint ignore:end */
        /**
 * Returns an object that contains an initialized WeakMap (`stash` property)
 * where data can be stored.
 *
 * @namespace dataStore
 *
 */
        var dataStore = /** @lends dataStore */ {
            /**
   * Stash data here.
   * @type WeakMap
   */
            stash: new WeakMap(),
            /**
   * Create a private data store and return it.
   * @return {WeakMap}
   */
            create: function() {
                return new WeakMap();
            }
        };
        /* harmony default export */
        __webpack_exports__.b = dataStore;
    }, /* 1 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = objectExtend;
        var OBJECT_TYPE = "[object Object]";
        var _toString = Function.call.bind(Object.prototype.toString);
        //============================================================
        /**
 * Extends an object with the properties of another.
 *
 * @param {Object|Boolean} mergeIntoObj
 *  The object that will have the properties of every other object provided
 *  on input merged into. This can also be a `Boolean`, in which case,
 *  a deep merge of objects will be done - argument number 2 will
 *  become the `mergeIntoObj`.
 * @param {...Object} mergeObjects
 *
 * @return {Object}
 */
        function objectExtend(mergeIntoObj) {
            var response = mergeIntoObj || {};
            for (var _len = arguments.length, mergeObjects = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) mergeObjects[_key - 1] = arguments[_key];
            var total = mergeObjects.length;
            var deepMerge = false;
            var i = void 0;
            var key = void 0;
            if ("boolean" === typeof mergeIntoObj) {
                deepMerge = mergeIntoObj;
                response = mergeObjects.shift() || {};
                total = mergeObjects.length;
            }
            for (i = 0; i < total; i++) {
                if (!mergeObjects[i]) continue;
                for (key in mergeObjects[i]) mergeObjects[i].hasOwnProperty(key) && (deepMerge && _toString(response[key]) === OBJECT_TYPE && _toString(mergeObjects[i][key]) === OBJECT_TYPE ? response[key] = objectExtend(true, response[key], mergeObjects[i][key]) : response[key] = mergeObjects[i][key]);
            }
            return response;
        }
        /* harmony default export */
        __webpack_exports__.a = objectExtend;
    }, /* 2 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = domAddClass;
        /**
 * Adds class to an element
 *
 * @function domAddClass
 *
 * @param {HTMLElement} el
 * @param {String} cssClass
 *  Multiple classes can be set using spaces as a delimiter
 */
        function domAddClass(el, cssClass) {
            var classNameList = String(cssClass).trim().split(/\s+/).map(function(className) {
                return className.trim();
            });
            el && classNameList.length && classNameList.forEach(function(cssClass) {
                return el.classList.add(cssClass);
            });
        }
        /* harmony default export */
        __webpack_exports__.a = domAddClass;
    }, /* 3 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return EventEmitter;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__Compose__ = __webpack_require__(16);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__dataStore__ = __webpack_require__(0);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_2__es6_Set__ = __webpack_require__(17);
        //----------------------------------------------------------------
        var PRIVATE = __WEBPACK_IMPORTED_MODULE_1__dataStore__.b.create();
        var arraySlice = Function.call.bind(Array.prototype.slice);
        var isFunction = function(fn) {
            return "function" === typeof fn;
        };
        var objectKeys = Object.keys;
        /**
 * Emits events. Use it to extend other modules and thus add events to them.
 *
 * @class EventEmitter
 * @extends Compose
 */
        var EventEmitter = __WEBPACK_IMPORTED_MODULE_0__Compose__.b.extend(/** @lends EventEmitter.prototype */ {
            /**
     * Add a callback to a given event name
     *
     * @param {String} evName
     *  The event name to be listened to or a list of event sperated by a space.
     *  The EventEmitter instance can be used as the `evName` as well which will
     *  essentially listen to all events.
     *  Note that this special event however, will change the arguments
     *  passed to the callback by pre-pending the Event Name (`String`) and
     *  appending the Component instance.
     *
     * @param {Function} callback
     *  A callback function to listen to the event. The callback function
     *  can cancel any queued event callbacks by returning `true` (boolean).
     *
     * @return {EventEmitter#EventListener}
     *
     * @example
     *
     * events.on("some-event", (...args) => {});
     *
     * // List to all events
     * events.on(events, (evNameTriggered, ...args) => {}
     */
            on: function(evName, callback) {
                var _this = this;
                var _getSetup$call = getSetup.call(this), all = _getSetup$call.all, listeners = _getSetup$call.listeners;
                var events = getEventNameList(evName).reduce(function(eventList, eventName) {
                    var off = void 0;
                    // If eventName is `this` then listen to all events
                    if (eventName === _this) {
                        all.add(callback);
                        off = function() {
                            return all.delete(callback);
                        };
                    } else {
                        eventName in listeners || (listeners[eventName] = new __WEBPACK_IMPORTED_MODULE_2__es6_Set__.c());
                        listeners[eventName].add(callback);
                        off = function() {
                            return listeners[eventName].delete(callback);
                        };
                    }
                    eventList[eventName] = {
                        off: off
                    };
                    return eventList;
                }, {});
                /**
         * EventEmitter Listener object, returned when one of the listener setter methods
         * (ex. `on()`, `once()`, `pipe`) are used.
         *
         * @typedef {Object} EventEmitter~EventListener
         *
         * @property {Object} listeners
         *  An object with the individual listeners. Each respective event listener
         *  has an `off()` method to turn that listener off.
         *
         * @property {Function} off
         *  Remove callback from event.
         */
                var response = {
                    off: function() {
                        objectKeys(events).forEach(function(eventName) {
                            return events[eventName].off();
                        });
                    }
                };
                response.listeners = events;
                return response;
            },
            /**
     * Remove a callback from a given event
     *
     * @param {String} evName
     * @param {Function} callback
     *
     */
            off: function(evName, callback) {
                var _getSetup$call2 = getSetup.call(this), all = _getSetup$call2.all, listeners = _getSetup$call2.listeners;
                if (evName === this) {
                    all.delete(callback);
                    return;
                }
                listeners[evName] && listeners.delete(callback);
            },
            /**
     * Add a callback to a given event name that is executed only once.
     *
     * @param {String} evName
     *  The event name. This can be a list of event delimited with a space. Each
     *  event listeners will be triggered at most once.
     * @param {Function} callback
     *
     * @return {EventEmitter#EventListener}
     */
            once: function(evName, callback) {
                var _this2 = this;
                var events = getEventNameList(evName).reduce(function(eventListeners, eventName) {
                    var eventNameListener = _this2.on(evName, function() {
                        eventNameListener.off();
                        callback.apply(void 0, arguments);
                    });
                    eventListeners[eventName] = eventNameListener;
                    return eventListeners;
                }, {});
                var response = {
                    off: function() {
                        objectKeys(events).forEach(function(eventName) {
                            return events[eventName].off();
                        });
                    }
                };
                response.listeners = events;
                return response;
            },
            /**
     * Emit an event and execute any callback listening. Any of the listening
     * events can cancel the calling of queued callbacks by returning `true`
     * (boolean)
     *
     * @param {String} evName
     *  The event name to be triggered. __NOTE__: can not be a `"*"` or the EventEmitter
     *  instance since they holds special meaning.
     *
     * @param {...*} callbackArgs
     */
            emit: function(evName) {
                if ("*" === evName || evName === this) {
                    console.log("EventEmitter#emit(): can not emit to events to '*'");
                    // jshint ignore:line
                    return;
                }
                var setup = getSetup.call(this);
                var eventListeners = setup.listeners;
                var eventPipes = setup.pipes;
                var eventAll = setup.all;
                var args = arraySlice(arguments, 1);
                var isCanceled = false;
                var callbackHandler = function(callback) {
                    if (isFunction(callback)) {
                        var response = callback.apply(callback, args);
                        // if a boolean true was returned, don't call any more listeners.
                        if (true === response) {
                            isCanceled = true;
                            return true;
                        }
                    }
                };
                // Regular event listeners
                if (eventListeners[evName] && eventListeners[evName].size) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = void 0;
                    try {
                        for (var _step, _iterator = eventListeners[evName][Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var cb = _step.value;
                            if (callbackHandler(cb)) break;
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            !_iteratorNormalCompletion && _iterator.return && _iterator.return();
                        } finally {
                            if (_didIteratorError) throw _iteratorError;
                        }
                    }
                }
                // Event listeners for all events
                if (!isCanceled && ("*" in eventListeners || eventAll.size)) {
                    // Special event "*": pass event name and instance
                    args = arraySlice(arguments, 0);
                    args.push(this);
                    if (eventListeners["*"] && eventListeners["*"].size) {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = void 0;
                        try {
                            for (var _step2, _iterator2 = eventListeners["*"][Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var _cb = _step2.value;
                                if (callbackHandler(_cb)) break;
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                !_iteratorNormalCompletion2 && _iterator2.return && _iterator2.return();
                            } finally {
                                if (_didIteratorError2) throw _iteratorError2;
                            }
                        }
                    }
                    if (eventAll.size) {
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = void 0;
                        try {
                            for (var _step3, _iterator3 = eventAll[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var _cb2 = _step3.value;
                                if (callbackHandler(_cb2)) break;
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                !_iteratorNormalCompletion3 && _iterator3.return && _iterator3.return();
                            } finally {
                                if (_didIteratorError3) throw _iteratorError3;
                            }
                        }
                    }
                    // set args back to original
                    args = arraySlice(arguments, 1);
                }
                if (eventPipes.size) {
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = void 0;
                    try {
                        for (var _step4, _iterator4 = eventPipes[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var pipe = _step4.value;
                            pipe && pipe(evName, args);
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            !_iteratorNormalCompletion4 && _iterator4.return && _iterator4.return();
                        } finally {
                            if (_didIteratorError4) throw _iteratorError4;
                        }
                    }
                }
            },
            /**
     * Emit the events from one instance of EventEmitter to another. Useful
     * for when multiple components are used together as part of a larger
     * component and have the need to emit events to a common EventEmitter.
     *
     * @param {EventEmitter} pipeTo
     *  The EventEmitter instance object to where events should be piped.
     *  Can also be an object/class having an `emit(evName, data)` method.
     *
     * @param {String} [prefix]
     *  If defined, prefix will be added to any event emited. Example:
     *  if defining `foo-` as the prefix, then every event emitted will
     *  prefixed wth this value. So a `click` event on the source will
     *  be piped as `foo-click`.
     *
     * @param {Boolean} [includeInstance=true]
     *  When set to `true` (default), the piped event will include the source
     *  instance as an additional argument to the event that is piped.
     *
     *  @return {EventListener}
     */
            pipe: function(pipeTo, prefix, includeInstance) {
                var _this3 = this;
                if (!pipeTo || !pipeTo.emit) return {
                    off: function() {}
                };
                var pipes = getSetup.call(this).pipes;
                var pipeEvToReceiver = function(triggeredEvName, args) {
                    prefix ? args.unshift(prefix + triggeredEvName) : args.unshift(triggeredEvName);
                    (includeInstance || "undefined" === typeof includeInstance) && args.push(_this3);
                    pipeTo.emit.apply(pipeTo, args);
                };
                pipes.add(pipeEvToReceiver);
                return {
                    off: function() {
                        pipes.delete(pipeEvToReceiver);
                    }
                };
            },
            /**
     * Returns a boolean indicating if the current EventEmitter has listener
     * @returns {Boolean}
     */
            hasListeners: function() {
                var _getSetup$call3 = getSetup.call(this), listeners = _getSetup$call3.listeners, pipes = _getSetup$call3.pipes;
                return objectKeys(listeners).some(function(evName) {
                    return !!listeners[evName].size;
                }) || !!pipes.size;
            },
            destroy: function() {
                __WEBPACK_IMPORTED_MODULE_0__Compose__.b.prototype.destroy.call(this, true);
            }
        });
        /**
 * Returns the instance setup object. Creates it if it does not have one.
 * @private
 * @this EventEmitter
 */
        function getSetup() {
            if (!PRIVATE.has(this)) {
                /*
            listeners: {
                'evName': Set[ Callbacks ]
            },
            pipes: Set[ Callbacks ]
            all: Set[ Callbacks ]
        */
                PRIVATE.set(this, {
                    listeners: {},
                    pipes: new __WEBPACK_IMPORTED_MODULE_2__es6_Set__.c(),
                    all: new __WEBPACK_IMPORTED_MODULE_2__es6_Set__.c()
                });
                // When this object is destroyed, remove all data
                this.onDestroy && this.onDestroy(function() {
                    PRIVATE.has(this) && PRIVATE.delete(this);
                }.bind(this));
            }
            return PRIVATE.get(this);
        }
        function getEventNameList(eventNamesStr) {
            if ("string" === typeof eventNamesStr) return eventNamesStr.split(/\s+/);
            return [ eventNamesStr ];
        }
        /**
 * Adds event emitter functionality to an object
 *
 * @param {Object} target
 */
        EventEmitter.mixin = function(target) {
            target && [ "on", "off", "emit", "once", "pipe" ].forEach(function(method) {
                Object.defineProperty(target, method, {
                    configurable: true,
                    value: EventEmitter.prototype[method].bind(target)
                });
            });
        };
        /* harmony default export */
        __webpack_exports__.b = EventEmitter;
    }, /* 4 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = parseHTML;
        var DOCUMENT = document;
        /**
 * Parses a string into native HTML element
 *
 * @function parseHTML
 *
 * @param {String} htmlString
 *
 * @return {DocumentFragment}
 *  A document fragmenet object with all of the HTMl in it.
 *
 * @example
 *
 * var myUI = parseHTML("<div>something</div>");
 *  // myUI.firstChild === <div>something</div>
 *
 *
 * @example
 *
 * var myUI = parseHTML("<!-- Comment here --> <div>Something</div>");
 *  // myUI.firstChild === <!-- Comment here -->
 *  // myUI..childNodes[0] === <div>Something</div>
 *
 */
        function parseHTML(htmlString) {
            var fragment = DOCUMENT.createDocumentFragment(), div = DOCUMENT.createElement("div");
            // If fragment does not have a .children porperty, then create it by
            // point it at childNodes
            "children" in fragment || (fragment.children = fragment.childNodes);
            div.innerHTML = htmlString;
            div.childNodes.length && Array.prototype.slice.call(div.childNodes, 0).forEach(function(node) {
                fragment.appendChild(node);
            });
            return fragment;
        }
        /* harmony default export */
        __webpack_exports__.a = parseHTML;
    }, /* 5 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return Widget;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__Compose__ = __webpack_require__(16);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__domutils_domAddClass__ = __webpack_require__(2);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_2__domutils_domRemoveClass__ = __webpack_require__(11);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_3__domutils_domChildren__ = __webpack_require__(15);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_4__styles_widget_less__ = __webpack_require__(64);
        /* harmony import */
        __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__styles_widget_less__);
        /**
 * Base class for a Widget
 *
 * @class Widget
 * @extends Compose
 *
 */
        var Widget = __WEBPACK_IMPORTED_MODULE_0__Compose__.b.extend(/** @lends Widget.prototype */ {
            init: function() {
                var me = this;
                me.onDestroy(function() {
                    _destroy.call(me);
                });
            },
            destroy: function() {
                _destroy.call(this);
                __WEBPACK_IMPORTED_MODULE_0__Compose__.b.prototype.destroy.call(this);
            },
            /**
     * The widget HTML Element
     *
     * @type {HTMLElement}
     */
            $ui: null,
            /**
     * Returns the Widget DOM element.
     * If current object instance has a property name `$ui`, that will be returned
     * by this method. Should be implemented by specfic widget if this pattern
     * is not implemented.
     *
     * @return {HTMLElement}
     */
            getEle: function() {
                return this.$ui;
            },
            /**
     * Checks if the Widget is visible.  Depends on `getEle` returning the widget's
     * UI element.
     *
     * @return {Boolean}
     */
            isVisible: function() {
                var $ui = this.getEle();
                return !!($ui.offsetWidth || $ui.offsetHeight || $ui.getClientRects().length);
            },
            /**
     * Checks the widget visibility (`isVisible`) and then updates it to
     * the opposite state.
     */
            toggle: function() {
                var me = this;
                me.isVisible() ? me.hide() : me.show();
            },
            /**
     * Makes widget UI visible
     */
            show: function() {
                Object(__WEBPACK_IMPORTED_MODULE_2__domutils_domRemoveClass__.a)(this.getEle(), "my-widget-hide");
            },
            /**
     * Hides the widget UI
     */
            hide: function() {
                Object(__WEBPACK_IMPORTED_MODULE_1__domutils_domAddClass__.a)(this.getEle(), "my-widget-hide");
            },
            /**
     * Appends the Widget to a given element.
     *
     * @param {HTMLElement|Widget} cntr
     * @param {Number} [atPosition]
     *  Position where element should be placed inside of the `cntr`.
     *  Default is at the bottom (after last item). Zero based
     */
            appendTo: function(cntr, atPosition) {
                if (!cntr) return;
                var $ele = this.getEle();
                var $cntrEle = cntr.appendChild ? cntr : cntr.getEle ? cntr.getEle() : null;
                if (!$cntrEle) return;
                if ("undefined" === typeof atPosition) {
                    $cntrEle.appendChild($ele);
                    return;
                }
                var cntrChildren = Object(__WEBPACK_IMPORTED_MODULE_3__domutils_domChildren__.a)($cntrEle);
                cntrChildren[atPosition] ? $cntrEle.insertBefore($ele, cntrChildren[atPosition]) : $cntrEle.appendChild($ele);
            },
            /**
     * Removes the Widget from it's parent (removes it from DOM)
     */
            detach: function() {
                var ui = this.getEle();
                ui && ui.parentNode && ui.parentNode.removeChild(ui);
            }
        });
        /**
 * @private
 */
        function _destroy() {
            this.detach();
            this.$ui = null;
        }
        /* harmony default export */
        __webpack_exports__.b = Widget;
    }, /* 6 */
    /***/
    function(module, exports) {
        /*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
        // css base code, injected by the css-loader
        module.exports = function() {
            var list = [];
            // return the list of modules as css string
            list.toString = function() {
                var result = [];
                for (var i = 0; i < this.length; i++) {
                    var item = this[i];
                    item[2] ? result.push("@media " + item[2] + "{" + item[1] + "}") : result.push(item[1]);
                }
                return result.join("");
            };
            // import a list of modules into the list
            list.i = function(modules, mediaQuery) {
                "string" === typeof modules && (modules = [ [ null, modules, "" ] ]);
                var alreadyImportedModules = {};
                for (var i = 0; i < this.length; i++) {
                    var id = this[i][0];
                    "number" === typeof id && (alreadyImportedModules[id] = true);
                }
                for (i = 0; i < modules.length; i++) {
                    var item = modules[i];
                    // skip already imported module
                    // this implementation is not 100% perfect for weird media query combinations
                    //  when a module is imported multiple times with different media queries.
                    //  I hope this will never occur (Hey this way we have smaller bundles)
                    if ("number" !== typeof item[0] || !alreadyImportedModules[item[0]]) {
                        mediaQuery && !item[2] ? item[2] = mediaQuery : mediaQuery && (item[2] = "(" + item[2] + ") and (" + mediaQuery + ")");
                        list.push(item);
                    }
                }
            };
            return list;
        };
    }, /* 7 */
    /***/
    function(module, exports, __webpack_require__) {
        /*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
        var stylesInDom = {};
        var isOldIE = function(fn) {
            var memo;
            return function() {
                "undefined" === typeof memo && (memo = fn.apply(this, arguments));
                return memo;
            };
        }(function() {
            // Test for IE <= 9 as proposed by Browserhacks
            // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
            // Tests for existence of standard globals is to allow style-loader
            // to operate correctly into non-standard environments
            // @see https://github.com/webpack-contrib/style-loader/issues/177
            return window && document && document.all && !window.atob;
        });
        var getTarget = function(target) {
            return document.querySelector(target);
        };
        var getElement = function(fn) {
            var memo = {};
            return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if ("function" === typeof target) return target();
                if ("undefined" === typeof memo[target]) {
                    var styleTarget = getTarget.call(this, target);
                    // Special case to return head of iframe instead of iframe itself
                    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) try {
                        // This will throw an exception if access to iframe is blocked
                        // due to cross-origin restrictions
                        styleTarget = styleTarget.contentDocument.head;
                    } catch (e) {
                        styleTarget = null;
                    }
                    memo[target] = styleTarget;
                }
                return memo[target];
            };
        }();
        var singleton = null;
        var singletonCounter = 0;
        var stylesInsertedAtTop = [];
        var fixUrls = __webpack_require__(66);
        module.exports = function(list, options) {
            if ("undefined" !== typeof DEBUG && DEBUG && "object" !== typeof document) throw new Error("The style-loader cannot be used in a non-browser environment");
            options = options || {};
            options.attrs = "object" === typeof options.attrs ? options.attrs : {};
            // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
            // tags it will allow on a page
            options.singleton || "boolean" === typeof options.singleton || (options.singleton = isOldIE());
            // By default, add <style> tags to the <head> element
            options.insertInto || (options.insertInto = "head");
            // By default, add <style> tags to the bottom of the target
            options.insertAt || (options.insertAt = "bottom");
            var styles = listToStyles(list, options);
            addStylesToDom(styles, options);
            return function(newList) {
                var mayRemove = [];
                for (var i = 0; i < styles.length; i++) {
                    var item = styles[i];
                    var domStyle = stylesInDom[item.id];
                    domStyle.refs--;
                    mayRemove.push(domStyle);
                }
                if (newList) {
                    var newStyles = listToStyles(newList, options);
                    addStylesToDom(newStyles, options);
                }
                for (var i = 0; i < mayRemove.length; i++) {
                    var domStyle = mayRemove[i];
                    if (0 === domStyle.refs) {
                        for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();
                        delete stylesInDom[domStyle.id];
                    }
                }
            };
        };
        function addStylesToDom(styles, options) {
            for (var i = 0; i < styles.length; i++) {
                var item = styles[i];
                var domStyle = stylesInDom[item.id];
                if (domStyle) {
                    domStyle.refs++;
                    for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j](item.parts[j]);
                    for (;j < item.parts.length; j++) domStyle.parts.push(addStyle(item.parts[j], options));
                } else {
                    var parts = [];
                    for (var j = 0; j < item.parts.length; j++) parts.push(addStyle(item.parts[j], options));
                    stylesInDom[item.id] = {
                        id: item.id,
                        refs: 1,
                        parts: parts
                    };
                }
            }
        }
        function listToStyles(list, options) {
            var styles = [];
            var newStyles = {};
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var id = options.base ? item[0] + options.base : item[0];
                var css = item[1];
                var media = item[2];
                var sourceMap = item[3];
                var part = {
                    css: css,
                    media: media,
                    sourceMap: sourceMap
                };
                newStyles[id] ? newStyles[id].parts.push(part) : styles.push(newStyles[id] = {
                    id: id,
                    parts: [ part ]
                });
            }
            return styles;
        }
        function insertStyleElement(options, style) {
            var target = getElement(options.insertInto);
            if (!target) throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
            var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];
            if ("top" === options.insertAt) {
                lastStyleElementInsertedAtTop ? lastStyleElementInsertedAtTop.nextSibling ? target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling) : target.appendChild(style) : target.insertBefore(style, target.firstChild);
                stylesInsertedAtTop.push(style);
            } else if ("bottom" === options.insertAt) target.appendChild(style); else {
                if ("object" !== typeof options.insertAt || !options.insertAt.before) throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
                var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
                target.insertBefore(style, nextSibling);
            }
        }
        function removeStyleElement(style) {
            if (null === style.parentNode) return false;
            style.parentNode.removeChild(style);
            var idx = stylesInsertedAtTop.indexOf(style);
            idx >= 0 && stylesInsertedAtTop.splice(idx, 1);
        }
        function createStyleElement(options) {
            var style = document.createElement("style");
            options.attrs.type = "text/css";
            addAttrs(style, options.attrs);
            insertStyleElement(options, style);
            return style;
        }
        function createLinkElement(options) {
            var link = document.createElement("link");
            options.attrs.type = "text/css";
            options.attrs.rel = "stylesheet";
            addAttrs(link, options.attrs);
            insertStyleElement(options, link);
            return link;
        }
        function addAttrs(el, attrs) {
            Object.keys(attrs).forEach(function(key) {
                el.setAttribute(key, attrs[key]);
            });
        }
        function addStyle(obj, options) {
            var style, update, remove, result;
            // If a transform function was defined, run it on the css
            if (options.transform && obj.css) {
                result = options.transform(obj.css);
                if (!result) // If the transform function returns a falsy value, don't add this css.
                // This allows conditional loading of css
                return function() {};
                // If transform returns a value, use that instead of the original css.
                // This allows running runtime transformations on the css.
                obj.css = result;
            }
            if (options.singleton) {
                var styleIndex = singletonCounter++;
                style = singleton || (singleton = createStyleElement(options));
                update = applyToSingletonTag.bind(null, style, styleIndex, false);
                remove = applyToSingletonTag.bind(null, style, styleIndex, true);
            } else if (obj.sourceMap && "function" === typeof URL && "function" === typeof URL.createObjectURL && "function" === typeof URL.revokeObjectURL && "function" === typeof Blob && "function" === typeof btoa) {
                style = createLinkElement(options);
                update = updateLink.bind(null, style, options);
                remove = function() {
                    removeStyleElement(style);
                    style.href && URL.revokeObjectURL(style.href);
                };
            } else {
                style = createStyleElement(options);
                update = applyToTag.bind(null, style);
                remove = function() {
                    removeStyleElement(style);
                };
            }
            update(obj);
            return function(newObj) {
                if (newObj) {
                    if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) return;
                    update(obj = newObj);
                } else remove();
            };
        }
        var replaceText = function() {
            var textStore = [];
            return function(index, replacement) {
                textStore[index] = replacement;
                return textStore.filter(Boolean).join("\n");
            };
        }();
        function applyToSingletonTag(style, index, remove, obj) {
            var css = remove ? "" : obj.css;
            if (style.styleSheet) style.styleSheet.cssText = replaceText(index, css); else {
                var cssNode = document.createTextNode(css);
                var childNodes = style.childNodes;
                childNodes[index] && style.removeChild(childNodes[index]);
                childNodes.length ? style.insertBefore(cssNode, childNodes[index]) : style.appendChild(cssNode);
            }
        }
        function applyToTag(style, obj) {
            var css = obj.css;
            var media = obj.media;
            media && style.setAttribute("media", media);
            if (style.styleSheet) style.styleSheet.cssText = css; else {
                for (;style.firstChild; ) style.removeChild(style.firstChild);
                style.appendChild(document.createTextNode(css));
            }
        }
        function updateLink(link, options, obj) {
            var css = obj.css;
            var sourceMap = obj.sourceMap;
            /*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
            var autoFixUrls = void 0 === options.convertToAbsoluteUrls && sourceMap;
            (options.convertToAbsoluteUrls || autoFixUrls) && (css = fixUrls(css));
            sourceMap && (// http://stackoverflow.com/a/26603875
            css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */");
            var blob = new Blob([ css ], {
                type: "text/css"
            });
            var oldSrc = link.href;
            link.href = URL.createObjectURL(blob);
            oldSrc && URL.revokeObjectURL(oldSrc);
        }
    }, /* 8 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = domAddEventListener;
        /**
 * Adds an event handler to a DOM element and returns back an
 * object that allows for removal of the event.
 *
 * @function domAddEventListener
 *
 * @param {HTMLElement} ele
 * @param {String} event
 *  The event to listen to (ex. `click`). Multiple events can be defined
 *  by separating them with whitespace
 * @param {Function} callback
 * @param {Boolean} [capture]
 *
 * @return DOMEventListener
 *
 * @example
 *
 * var listener = domAddEventHandler(myEle, "click", function(){});
 * ...
 * listener.remove();
 */
        function domAddEventListener(ele, event, callback, capture) {
            var events = event.split(/\s+/);
            var evListeners = {};
            events.forEach(function(evName) {
                ele.addEventListener(evName, callback, capture);
                evListeners[evName] = {
                    remove: function() {
                        return ele.removeEventListener(evName, callback, capture);
                    }
                };
            });
            /**
     * A DOM Event listener.
     *
     * @typedef {Object} DOMEventListener
     *
     * @property {Function} remove
     * @property {Object} listeners
     *  List of listeners that were bound to the DOM element. Each listeners has a
     *  corresponding `.remove()` method.
     */
            return Object.create({
                listeners: evListeners,
                remove: function() {
                    events.forEach(function(evName) {
                        return evListeners[evName].remove();
                    });
                }
            });
        }
        /* harmony default export */
        __webpack_exports__.a = domAddEventListener;
    }, /* 9 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "d", function() {
            return functionBind;
        });
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "e", function() {
            return functionBindCall;
        });
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "g", function() {
            return objectDefineProperty;
        });
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "f", function() {
            return objectDefineProperties;
        });
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "h", function() {
            return objectKeys;
        });
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return arrayForEach;
        });
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "b", function() {
            return arrayIndexOf;
        });
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "c", function() {
            return arraySplice;
        });
        // Function
        // functionBind(fn, fnParent)
        var functionBind = Function.bind.call.bind(Function.bind);
        // functionBindCall(Array.prototype.forEach)
        var functionBindCall = functionBind(Function.call.bind, Function.call);
        // Object
        var objectDefineProperty = Object.defineProperty;
        var objectDefineProperties = Object.defineProperties;
        var objectKeys = Object.keys;
        // Array
        var arr = [];
        var arrayForEach = functionBindCall(arr.forEach);
        var arrayIndexOf = functionBindCall(arr.indexOf);
        var arraySplice = functionBindCall(arr.splice);
    }, /* 10 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* WEBPACK VAR INJECTION */
        (function(global) {
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() {
                return GLOBAL;
            });
            /* harmony export (immutable) */
            __webpack_exports__.c = getGlobal;
            var GLOBAL = function() {
                /* global self, window, global */
                if ("undefined" !== typeof window) return window;
                if ("undefined" !== typeof global) return global;
                if ("undefined" !== typeof self) return self;
                return Function("return this;")();
            }();
            function getGlobal() {
                return GLOBAL;
            }
            /* harmony default export */
            __webpack_exports__.b = getGlobal;
        }).call(__webpack_exports__, __webpack_require__(26));
    }, /* 11 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = domRemoveClass;
        /**
 * removes a class from an element
 *
 * @function domRemoveClass
 *
 * @param {HTMLElement} el
 * @param {String} cssClass
 */
        function domRemoveClass(el, cssClass) {
            return el.classList.remove(cssClass);
        }
        /* harmony default export */
        __webpack_exports__.a = domRemoveClass;
    }, /* 12 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* WEBPACK VAR INJECTION */
        (function(process, global, module) {
            /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() {
                return Promise;
            });
            var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            /**
 * LOCAL CHANGES (Paul Tavares):
 *
 * -    Changed to ensure that auto-polyfill does not override the native implementation.
 *      Changes done to .default() method.
 * -    Changed AMD so that it returns the .promise (and not the namespace with promise and polyfill),
 * -    Comment out code in lib$es6$promise$asap$$attemptVertx() which was causing
 *      webpack to try to load a module called Vertx (what?)
 *
 * See: https://github.com/stefanpenner/es6-promise/issues/140#issuecomment-192913875
 *
 */
            var polyfill;
            /*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   3.2.1
 */
            (function() {
                /* jshint ignore:start */
                function lib$es6$promise$utils$$objectOrFunction(x) {
                    return "function" === typeof x || "object" === ("undefined" === typeof x ? "undefined" : _typeof(x)) && null !== x;
                }
                function lib$es6$promise$utils$$isFunction(x) {
                    return "function" === typeof x;
                }
                var lib$es6$promise$utils$$_isArray;
                lib$es6$promise$utils$$_isArray = Array.isArray ? Array.isArray : function(x) {
                    return "[object Array]" === Object.prototype.toString.call(x);
                };
                var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
                var lib$es6$promise$asap$$len = 0;
                var lib$es6$promise$asap$$customSchedulerFn;
                var lib$es6$promise$asap$$asap = function(callback, arg) {
                    lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
                    lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
                    lib$es6$promise$asap$$len += 2;
                    2 === lib$es6$promise$asap$$len && (// If len is 2, that means that we need to schedule an async flush.
                    // If additional callbacks are queued before the queue is flushed, they
                    // will be processed by this flush that we are scheduling.
                    lib$es6$promise$asap$$customSchedulerFn ? lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush) : lib$es6$promise$asap$$scheduleFlush());
                };
                function lib$es6$promise$asap$$setScheduler(scheduleFn) {
                    lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
                }
                function lib$es6$promise$asap$$setAsap(asapFn) {
                    lib$es6$promise$asap$$asap = asapFn;
                }
                var lib$es6$promise$asap$$browserWindow = "undefined" !== typeof window ? window : void 0;
                var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
                var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
                var lib$es6$promise$asap$$isNode = "undefined" === typeof self && "undefined" !== typeof process && "[object process]" === {}.toString.call(process);
                // test for web worker but not in IE10
                var lib$es6$promise$asap$$isWorker = "undefined" !== typeof Uint8ClampedArray && "undefined" !== typeof importScripts && "undefined" !== typeof MessageChannel;
                function lib$es6$promise$asap$$useSetTimeout() {
                    return function() {
                        setTimeout(lib$es6$promise$asap$$flush, 1);
                    };
                }
                var lib$es6$promise$asap$$queue = new Array(1e3);
                function lib$es6$promise$asap$$flush() {
                    for (var i = 0; i < lib$es6$promise$asap$$len; i += 2) {
                        var callback = lib$es6$promise$asap$$queue[i];
                        var arg = lib$es6$promise$asap$$queue[i + 1];
                        callback(arg);
                        lib$es6$promise$asap$$queue[i] = void 0;
                        lib$es6$promise$asap$$queue[i + 1] = void 0;
                    }
                    lib$es6$promise$asap$$len = 0;
                }
                var lib$es6$promise$asap$$scheduleFlush;
                // Decide what async method to use to triggering processing of queued callbacks:
                lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$isNode ? // node
                function() {
                    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
                    // see https://github.com/cujojs/when/issues/410 for details
                    return function() {
                        process.nextTick(lib$es6$promise$asap$$flush);
                    };
                }() : lib$es6$promise$asap$$BrowserMutationObserver ? function() {
                    var iterations = 0;
                    var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
                    var node = document.createTextNode("");
                    observer.observe(node, {
                        characterData: true
                    });
                    return function() {
                        node.data = iterations = ++iterations % 2;
                    };
                }() : lib$es6$promise$asap$$isWorker ? // web worker
                function() {
                    var channel = new MessageChannel();
                    channel.port1.onmessage = lib$es6$promise$asap$$flush;
                    return function() {
                        channel.port2.postMessage(0);
                    };
                }() : void 0 === lib$es6$promise$asap$$browserWindow && true ? function() {
                    //try {
                    //  var r = require;
                    //  var vertx = r('vertx');
                    //  lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
                    //  return lib$es6$promise$asap$$useVertxTimer();
                    //} catch(e) {
                    //}
                    return lib$es6$promise$asap$$useSetTimeout();
                }() : lib$es6$promise$asap$$useSetTimeout();
                function lib$es6$promise$then$$then(onFulfillment, onRejection) {
                    var parent = this;
                    var child = new this.constructor(lib$es6$promise$$internal$$noop);
                    void 0 === child[lib$es6$promise$$internal$$PROMISE_ID] && lib$es6$promise$$internal$$makePromise(child);
                    var state = parent._state;
                    if (state) {
                        var callback = arguments[state - 1];
                        lib$es6$promise$asap$$asap(function() {
                            lib$es6$promise$$internal$$invokeCallback(state, child, callback, parent._result);
                        });
                    } else lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
                    return child;
                }
                var lib$es6$promise$then$$default = lib$es6$promise$then$$then;
                function lib$es6$promise$promise$resolve$$resolve(object) {
                    /*jshint validthis:true */
                    var Constructor = this;
                    if (object && "object" === ("undefined" === typeof object ? "undefined" : _typeof(object)) && object.constructor === Constructor) return object;
                    var promise = new Constructor(lib$es6$promise$$internal$$noop);
                    lib$es6$promise$$internal$$resolve(promise, object);
                    return promise;
                }
                var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
                var lib$es6$promise$$internal$$PROMISE_ID = Math.random().toString(36).substring(16);
                function lib$es6$promise$$internal$$noop() {}
                var lib$es6$promise$$internal$$PENDING = void 0;
                var lib$es6$promise$$internal$$FULFILLED = 1;
                var lib$es6$promise$$internal$$REJECTED = 2;
                var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();
                function lib$es6$promise$$internal$$selfFulfillment() {
                    return new TypeError("You cannot resolve a promise with itself");
                }
                function lib$es6$promise$$internal$$cannotReturnOwn() {
                    return new TypeError("A promises callback cannot return that same promise.");
                }
                function lib$es6$promise$$internal$$getThen(promise) {
                    try {
                        return promise.then;
                    } catch (error) {
                        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
                        return lib$es6$promise$$internal$$GET_THEN_ERROR;
                    }
                }
                function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
                    try {
                        then.call(value, fulfillmentHandler, rejectionHandler);
                    } catch (e) {
                        return e;
                    }
                }
                function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
                    lib$es6$promise$asap$$asap(function(promise) {
                        var sealed = false;
                        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
                            if (sealed) return;
                            sealed = true;
                            thenable !== value ? lib$es6$promise$$internal$$resolve(promise, value) : lib$es6$promise$$internal$$fulfill(promise, value);
                        }, function(reason) {
                            if (sealed) return;
                            sealed = true;
                            lib$es6$promise$$internal$$reject(promise, reason);
                        }, "Settle: " + (promise._label || " unknown promise"));
                        if (!sealed && error) {
                            sealed = true;
                            lib$es6$promise$$internal$$reject(promise, error);
                        }
                    }, promise);
                }
                function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
                    thenable._state === lib$es6$promise$$internal$$FULFILLED ? lib$es6$promise$$internal$$fulfill(promise, thenable._result) : thenable._state === lib$es6$promise$$internal$$REJECTED ? lib$es6$promise$$internal$$reject(promise, thenable._result) : lib$es6$promise$$internal$$subscribe(thenable, void 0, function(value) {
                        lib$es6$promise$$internal$$resolve(promise, value);
                    }, function(reason) {
                        lib$es6$promise$$internal$$reject(promise, reason);
                    });
                }
                function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable, then) {
                    maybeThenable.constructor === promise.constructor && then === lib$es6$promise$then$$default && constructor.resolve === lib$es6$promise$promise$resolve$$default ? lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable) : then === lib$es6$promise$$internal$$GET_THEN_ERROR ? lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error) : void 0 === then ? lib$es6$promise$$internal$$fulfill(promise, maybeThenable) : lib$es6$promise$utils$$isFunction(then) ? lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then) : lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
                }
                function lib$es6$promise$$internal$$resolve(promise, value) {
                    promise === value ? lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment()) : lib$es6$promise$utils$$objectOrFunction(value) ? lib$es6$promise$$internal$$handleMaybeThenable(promise, value, lib$es6$promise$$internal$$getThen(value)) : lib$es6$promise$$internal$$fulfill(promise, value);
                }
                function lib$es6$promise$$internal$$publishRejection(promise) {
                    promise._onerror && promise._onerror(promise._result);
                    lib$es6$promise$$internal$$publish(promise);
                }
                function lib$es6$promise$$internal$$fulfill(promise, value) {
                    if (promise._state !== lib$es6$promise$$internal$$PENDING) return;
                    promise._result = value;
                    promise._state = lib$es6$promise$$internal$$FULFILLED;
                    0 !== promise._subscribers.length && lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
                }
                function lib$es6$promise$$internal$$reject(promise, reason) {
                    if (promise._state !== lib$es6$promise$$internal$$PENDING) return;
                    promise._state = lib$es6$promise$$internal$$REJECTED;
                    promise._result = reason;
                    lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
                }
                function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
                    var subscribers = parent._subscribers;
                    var length = subscribers.length;
                    parent._onerror = null;
                    subscribers[length] = child;
                    subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
                    subscribers[length + lib$es6$promise$$internal$$REJECTED] = onRejection;
                    0 === length && parent._state && lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
                }
                function lib$es6$promise$$internal$$publish(promise) {
                    var subscribers = promise._subscribers;
                    var settled = promise._state;
                    if (0 === subscribers.length) return;
                    var child, callback, detail = promise._result;
                    for (var i = 0; i < subscribers.length; i += 3) {
                        child = subscribers[i];
                        callback = subscribers[i + settled];
                        child ? lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail) : callback(detail);
                    }
                    promise._subscribers.length = 0;
                }
                function lib$es6$promise$$internal$$ErrorObject() {
                    this.error = null;
                }
                var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();
                function lib$es6$promise$$internal$$tryCatch(callback, detail) {
                    try {
                        return callback(detail);
                    } catch (e) {
                        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
                        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
                    }
                }
                function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
                    var value, error, succeeded, failed, hasCallback = lib$es6$promise$utils$$isFunction(callback);
                    if (hasCallback) {
                        value = lib$es6$promise$$internal$$tryCatch(callback, detail);
                        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
                            failed = true;
                            error = value.error;
                            value = null;
                        } else succeeded = true;
                        if (promise === value) {
                            lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
                            return;
                        }
                    } else {
                        value = detail;
                        succeeded = true;
                    }
                    promise._state !== lib$es6$promise$$internal$$PENDING || (hasCallback && succeeded ? lib$es6$promise$$internal$$resolve(promise, value) : failed ? lib$es6$promise$$internal$$reject(promise, error) : settled === lib$es6$promise$$internal$$FULFILLED ? lib$es6$promise$$internal$$fulfill(promise, value) : settled === lib$es6$promise$$internal$$REJECTED && lib$es6$promise$$internal$$reject(promise, value));
                }
                function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
                    try {
                        resolver(function(value) {
                            lib$es6$promise$$internal$$resolve(promise, value);
                        }, function(reason) {
                            lib$es6$promise$$internal$$reject(promise, reason);
                        });
                    } catch (e) {
                        lib$es6$promise$$internal$$reject(promise, e);
                    }
                }
                var lib$es6$promise$$internal$$id = 0;
                function lib$es6$promise$$internal$$nextId() {
                    return lib$es6$promise$$internal$$id++;
                }
                function lib$es6$promise$$internal$$makePromise(promise) {
                    promise[lib$es6$promise$$internal$$PROMISE_ID] = lib$es6$promise$$internal$$id++;
                    promise._state = void 0;
                    promise._result = void 0;
                    promise._subscribers = [];
                }
                function lib$es6$promise$promise$all$$all(entries) {
                    return new lib$es6$promise$enumerator$$default(this, entries).promise;
                }
                var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
                function lib$es6$promise$promise$race$$race(entries) {
                    /*jshint validthis:true */
                    var Constructor = this;
                    return new Constructor(lib$es6$promise$utils$$isArray(entries) ? function(resolve, reject) {
                        var length = entries.length;
                        for (var i = 0; i < length; i++) Constructor.resolve(entries[i]).then(resolve, reject);
                    } : function(resolve, reject) {
                        reject(new TypeError("You must pass an array to race."));
                    });
                }
                var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
                function lib$es6$promise$promise$reject$$reject(reason) {
                    /*jshint validthis:true */
                    var Constructor = this;
                    var promise = new Constructor(lib$es6$promise$$internal$$noop);
                    lib$es6$promise$$internal$$reject(promise, reason);
                    return promise;
                }
                var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;
                function lib$es6$promise$promise$$needsResolver() {
                    throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
                }
                function lib$es6$promise$promise$$needsNew() {
                    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
                }
                var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
                /**
    Promise objects represent the eventual result of an asynchronous operation. The
    primary way of interacting with a promise is through its `then` method, which
    registers callbacks to receive either a promise's eventual value or the reason
    why the promise cannot be fulfilled.
      Terminology
    -----------
      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
    - `thenable` is an object or function that defines a `then` method.
    - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
    - `exception` is a value that is thrown using the throw statement.
    - `reason` is a value that indicates why a promise was rejected.
    - `settled` the final resting state of a promise, fulfilled or rejected.
      A promise can be in one of three states: pending, fulfilled, or rejected.
      Promises that are fulfilled have a fulfillment value and are in the fulfilled
    state.  Promises that are rejected have a rejection reason and are in the
    rejected state.  A fulfillment value is never a thenable.
      Promises can also be said to *resolve* a value.  If this value is also a
    promise, then the original promise's settled state will match the value's
    settled state.  So a promise that *resolves* a promise that rejects will
    itself reject, and a promise that *resolves* a promise that fulfills will
    itself fulfill.
        Basic Usage:
    ------------
      ```js
    var promise = new Promise(function(resolve, reject) {
      // on success
      resolve(value);
        // on failure
      reject(reason);
    });
      promise.then(function(value) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
      Advanced Usage:
    ---------------
      Promises shine when abstracting away asynchronous interactions such as
    `XMLHttpRequest`s.
      ```js
    function getJSON(url) {
      return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
          xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();
          function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              resolve(this.response);
            } else {
              reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
            }
          }
        };
      });
    }
      getJSON('/posts.json').then(function(json) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
      Unlike callbacks, promises are great composable primitives.
      ```js
    Promise.all([
      getJSON('/posts'),
      getJSON('/comments')
    ]).then(function(values){
      values[0] // => postsJSON
      values[1] // => commentsJSON
        return values;
    });
    ```
      @class Promise
    @param {function} resolver
    Useful for tooling.
    @constructor
  */
                function lib$es6$promise$promise$$Promise(resolver) {
                    this[lib$es6$promise$$internal$$PROMISE_ID] = lib$es6$promise$$internal$$nextId();
                    this._result = this._state = void 0;
                    this._subscribers = [];
                    if (lib$es6$promise$$internal$$noop !== resolver) {
                        "function" !== typeof resolver && lib$es6$promise$promise$$needsResolver();
                        this instanceof lib$es6$promise$promise$$Promise ? lib$es6$promise$$internal$$initializePromise(this, resolver) : lib$es6$promise$promise$$needsNew();
                    }
                }
                lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
                lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
                lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
                lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
                lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
                lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
                lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;
                lib$es6$promise$promise$$Promise.prototype = {
                    constructor: lib$es6$promise$promise$$Promise,
                    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.
        ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```
        Chaining
      --------
        The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.
        ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });
        findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
        ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```
        Assimilation
      ------------
        Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.
        ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```
        If the assimliated promise rejects, then the downstream promise will also reject.
        ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```
        Simple Example
      --------------
        Synchronous Example
        ```javascript
      var result;
        try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```
        Errback Example
        ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```
        Promise Example;
        ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```
        Advanced Example
      --------------
        Synchronous Example
        ```javascript
      var author, books;
        try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```
        Errback Example
        ```js
        function foundBooks(books) {
        }
        function failure(reason) {
        }
        findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```
        Promise Example;
        ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```
        @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
                    then: lib$es6$promise$then$$default,
                    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.
        ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }
        // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }
        // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```
        @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
                    catch: function(onRejection) {
                        return this.then(null, onRejection);
                    }
                };
                var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
                function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
                    this._instanceConstructor = Constructor;
                    this.promise = new Constructor(lib$es6$promise$$internal$$noop);
                    this.promise[lib$es6$promise$$internal$$PROMISE_ID] || lib$es6$promise$$internal$$makePromise(this.promise);
                    if (Array.isArray(input)) {
                        this._input = input;
                        this.length = input.length;
                        this._remaining = input.length;
                        this._result = new Array(this.length);
                        if (0 === this.length) lib$es6$promise$$internal$$fulfill(this.promise, this._result); else {
                            this.length = this.length || 0;
                            this._enumerate();
                            0 === this._remaining && lib$es6$promise$$internal$$fulfill(this.promise, this._result);
                        }
                    } else lib$es6$promise$$internal$$reject(this.promise, lib$es6$promise$enumerator$$validationError());
                }
                function lib$es6$promise$enumerator$$validationError() {
                    return new Error("Array Methods must be provided an Array");
                }
                lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
                    var length = this.length;
                    var input = this._input;
                    for (var i = 0; this._state === lib$es6$promise$$internal$$PENDING && i < length; i++) this._eachEntry(input[i], i);
                };
                lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
                    var c = this._instanceConstructor;
                    var resolve = c.resolve;
                    if (resolve === lib$es6$promise$promise$resolve$$default) {
                        var then = lib$es6$promise$$internal$$getThen(entry);
                        if (then === lib$es6$promise$then$$default && entry._state !== lib$es6$promise$$internal$$PENDING) this._settledAt(entry._state, i, entry._result); else if ("function" !== typeof then) {
                            this._remaining--;
                            this._result[i] = entry;
                        } else if (c === lib$es6$promise$promise$$default) {
                            var promise = new c(lib$es6$promise$$internal$$noop);
                            lib$es6$promise$$internal$$handleMaybeThenable(promise, entry, then);
                            this._willSettleAt(promise, i);
                        } else this._willSettleAt(new c(function(resolve) {
                            resolve(entry);
                        }), i);
                    } else this._willSettleAt(resolve(entry), i);
                };
                lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
                    var promise = this.promise;
                    if (promise._state === lib$es6$promise$$internal$$PENDING) {
                        this._remaining--;
                        state === lib$es6$promise$$internal$$REJECTED ? lib$es6$promise$$internal$$reject(promise, value) : this._result[i] = value;
                    }
                    0 === this._remaining && lib$es6$promise$$internal$$fulfill(promise, this._result);
                };
                lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
                    var enumerator = this;
                    lib$es6$promise$$internal$$subscribe(promise, void 0, function(value) {
                        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
                    }, function(reason) {
                        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
                    });
                };
                function lib$es6$promise$polyfill$$polyfill() {
                    var local;
                    if ("undefined" !== typeof global) local = global; else if ("undefined" !== typeof self) local = self; else try {
                        local = Function("return this")();
                    } catch (e) {
                        throw new Error("polyfill failed because global object is unavailable in this environment");
                    }
                    var P = local.Promise;
                    if (P) {
                        //if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
                        lib$es6$promise$umd$$ES6Promise.Promise = P;
                        return;
                    }
                    local.Promise = lib$es6$promise$promise$$default;
                }
                var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;
                var lib$es6$promise$umd$$ES6Promise = polyfill = {
                    Promise: lib$es6$promise$promise$$default,
                    polyfill: lib$es6$promise$polyfill$$default
                };
                lib$es6$promise$polyfill$$default();
                "function" === typeof define && __webpack_require__(51) ? define(function() {
                    return lib$es6$promise$umd$$ES6Promise.Promise;
                }) : "undefined" !== typeof module && module.exports ? module.exports = lib$es6$promise$umd$$ES6Promise.Promise : "undefined" !== typeof this && (this.ES6Promise = lib$es6$promise$umd$$ES6Promise);
            }).call(this);
            var Promise = polyfill.Promise;
            /* harmony default export */
            __webpack_exports__.b = Promise;
        }).call(__webpack_exports__, __webpack_require__(49), __webpack_require__(26), __webpack_require__(50)(module));
    }, /* 13 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = fillTemplate;
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__getObjectPropValue__ = __webpack_require__(18);
        var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        /**
 * An extremely lightweight template engine for replacing
 * tokens in the form of {{name}} with values from an object
 * or a list (array) of objects
 *
 * @function fillTemplate
 *
 * @param {String|HTMLElement} template
 *  Template should use double curly braces for data attributes.
 *  These can be defined in dot notation for deep values in the data.
 *
 * @param {Object|Array<Object>} data
 *  The Object containing the data that will be applied to the
 *  template. An array of objects can also be defined
 *
 * @return {String}
 */
        function fillTemplate(template, data) {
            var i, j, x, y, item, tokenVal, tmp, opt = {};
            // If user used an object to define input param, then parse that now
            if ("object" === ("undefined" === typeof template ? "undefined" : _typeof(template)) && 1 === arguments.length) {
                data = template.data;
                template = template.template;
            }
            opt.response = "";
            if ("string" !== typeof template) {
                tmp = document.createElement("div");
                tmp.appendChild(template);
                template = tmp.innerHTML;
            } else opt.template = template;
            opt.tokens = opt.template.match(/(\{\{.*?\}\})/g);
            Array.isArray(data) || (data = data ? [ data ] : [ {} ]);
            // If we have tokens in the template, then replace them
            if (null !== opt.tokens) // If data tokens were passed in on input, then use them
            // in looking for that token in the template and replacing
            // it with the value defined.
            for (x = 0, y = data.length; x < y; x++) {
                item = opt.template;
                for (i = 0, j = opt.tokens.length; i < j; i++) {
                    opt.tokens[i] = opt.tokens[i].replace(/[\{\}]/g, "");
                    tokenVal = Object(__WEBPACK_IMPORTED_MODULE_0__getObjectPropValue__.a)(data[x], opt.tokens[i]) || "";
                    //tokenVal        = data[x][ opt.tokens[i] ] || '';
                    if ("function" === typeof tokenVal) {
                        var fnContext = data[x];
                        // Function should be called with the same context as it was originally created.
                        -1 !== opt.tokens[i].indexOf(".") && (fnContext = Object(__WEBPACK_IMPORTED_MODULE_0__getObjectPropValue__.a)(data[x], opt.tokens[i].substr(0, opt.tokens[i].lastIndexOf("."))));
                        tokenVal = tokenVal.call(fnContext);
                    }
                    item = item.replace("{{" + opt.tokens[i] + "}}", tokenVal);
                }
                opt.response += item;
            } else opt.response = opt.template;
            return opt.response;
        }
        /* harmony default export */
        __webpack_exports__.a = fillTemplate;
    }, /* 14 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = getCustomElementFromWidget;
        /* harmony export (immutable) */
        __webpack_exports__.c = getWidgetOptionsFromComponent;
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__jsutils_Component__ = __webpack_require__(34);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__jsutils_dataStore__ = __webpack_require__(0);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_2__domutils_domAddClass__ = __webpack_require__(2);
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    "value" in descriptor && (descriptor.writable = true);
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                protoProps && defineProperties(Constructor.prototype, protoProps);
                staticProps && defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        var _get = function get(object, property, receiver) {
            null === object && (object = Function.prototype);
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (void 0 === desc) {
                var parent = Object.getPrototypeOf(object);
                return null === parent ? void 0 : get(parent, property, receiver);
            }
            if ("value" in desc) return desc.value;
            var getter = desc.get;
            if (void 0 === getter) return;
            return getter.call(receiver);
        };
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        function _possibleConstructorReturn(self, call) {
            if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !call || "object" !== typeof call && "function" !== typeof call ? self : call;
        }
        function _inherits(subClass, superClass) {
            if ("function" !== typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
        }
        //==============================================================
        var objectKeys = Object.keys;
        var PRIVATE = __WEBPACK_IMPORTED_MODULE_1__jsutils_dataStore__.b.create();
        /**
 * Returns a Custom Element for the given Widget constructor provided on input.
 * Each component defined (HTMLElement) will have a property named `wdg` that
 * holds the Widget's instance (Note: this could be `null` if the CE was disconnected).
 *
 * @param {Object} options
 * @param {Widget} options.Widget
 *  The Widget Class.
 *
 * @param {String} options.className
 *  The CSS class name(s) that should be auto-applied to the Customer Element
 *
 * @param {String} [options.tagName=""]
 *  The HTML custom tag name to use for the return Component `register` method.
 *
 * @param {Object} [options.liveAttr]
 *  An object with the HTML attributes that will be monitored for changes.
 *  The callback will be executed when the prop changes with the new value, old value,
 *  widget instance and Component (ex. `callback(new, old, wdg, component)`.
 *
 * @param {Object} [options.liveProps]
 *  An object with the propName whose value is a callback for when the prop
 *  changes on the instance.
 *  The callback will be given the new prop value on input as well as the
 *  Widget instance and Component instance.
 *  The callback will be called within the context of the Component instance.
 *
 * @return {HTMLElement}
 */
        function getCustomElementFromWidget(_ref) {
            var Widget = _ref.Widget, className = _ref.className, liveProps = _ref.liveProps, tagName = _ref.tagName, _ref$liveAttr = _ref.liveAttr, liveAttr = void 0 === _ref$liveAttr ? {} : _ref$liveAttr;
            var liveAttributes = Object.keys(liveAttr);
            var WidgetComponent = function(_Component) {
                _inherits(WidgetComponent, _Component);
                function WidgetComponent() {
                    _classCallCheck(this, WidgetComponent);
                    return _possibleConstructorReturn(this, (WidgetComponent.__proto__ || Object.getPrototypeOf(WidgetComponent)).apply(this, arguments));
                }
                _createClass(WidgetComponent, [ {
                    key: "init",
                    value: function() {
                        PRIVATE.has(this) || (this.innerHTML = "");
                    }
                }, {
                    key: "attributeChangedCallback",
                    value: function(name, oldValue, newValue) {
                        liveAttr[name] && liveAttr[name](newValue, oldValue, this.wdg, this);
                    }
                }, {
                    key: "connectedCallback",
                    value: function() {
                        var _this2 = this;
                        // ON connect, which can happen multiple times, we check if the widget is already
                        // created.
                        // If not, we initialize it and attache it to the CE
                        // IF already defined, then ensure it is visible. During disconnects we hide the widget,
                        // which helps when a user might `cloneNode` on a CE that is NOT using shadowDOM
                        _get(WidgetComponent.prototype.__proto__ || Object.getPrototypeOf(WidgetComponent.prototype), "connectedCallback", this).call(this);
                        if (PRIVATE.has(this)) {
                            var _state = PRIVATE.get(this);
                            if (_state.pendingDestroy) {
                                _state.pendingDestroy = false;
                                this.wdg.getEle().style.display = _state.cssDisplay;
                                _state.cssDisplay = "";
                            }
                        } else {
                            this.textContent = "";
                            // we don't want any prior content of this element
                            var state = {
                                pendingDestroy: false,
                                cssDisplay: ""
                            };
                            var wdg = this.wdg = new Widget(getWidgetOptionsFromComponent(Widget, this));
                            PRIVATE.set(this, state);
                            this.appendChild(wdg.getEle());
                            className && Object(__WEBPACK_IMPORTED_MODULE_2__domutils_domAddClass__.a)(this, className);
                            wdg.pipe && wdg.onDestroy(wdg.pipe(this).off);
                            this.onDestroy(function() {
                                wdg.destroy();
                                PRIVATE.delete(_this2);
                                _this2.wdg = null;
                            });
                        }
                    }
                }, {
                    key: "disconnectedCallback",
                    value: function() {
                        _get(WidgetComponent.prototype.__proto__ || Object.getPrototypeOf(WidgetComponent.prototype), "disconnectedCallback", this).call(this);
                        if (PRIVATE.has(this) && this.wdg) {
                            var state = PRIVATE.get(this);
                            if (!state.pendingDestroy) {
                                state.pendingDestroy = true;
                                state.cssDisplay = this.wdg.getEle().style.display;
                                this.wdg.getEle().style.display = "none";
                            }
                        }
                    }
                } ], [ {
                    key: "tagName",
                    get: function() {
                        return tagName || "";
                    }
                }, {
                    key: "observedAttributes",
                    get: function() {
                        return liveAttributes;
                    }
                } ]);
                return WidgetComponent;
            }(__WEBPACK_IMPORTED_MODULE_0__jsutils_Component__.b);
            liveProps && Object.defineProperties(WidgetComponent.prototype, objectKeys(liveProps).reduce(function(props, propName) {
                var propValue = propName in Widget.defaults ? Widget.defaults[propName] : void 0;
                props[propName] = {
                    get: function() {
                        return propValue;
                    },
                    set: function(newValue) {
                        propValue = newValue;
                        this.wdg && liveProps[propName].call(this, newValue, this.wdg, this);
                    }
                };
                return props;
            }, {}));
            return WidgetComponent;
        }
        /* harmony default export */
        __webpack_exports__.a = getCustomElementFromWidget;
        /**
 * Given a Widget Constructor (class) and a component instance, this method will return
 * an object with the options for the given widget.
 *
 * @param {Widget} Widget
 * @param {HTMLElement} componentInstance
 *
 * @returns {Object}
 */
        function getWidgetOptionsFromComponent(Widget, componentInstance) {
            var widgetOptions = {};
            objectKeys(Widget.defaults).forEach(function(key) {
                // If set as a Prop on the component, use that value
                key in componentInstance && componentInstance[key] !== Widget.defaults[key] ? widgetOptions[key] = componentInstance[key] : componentInstance.hasAttribute(key) && (widgetOptions[key] = componentInstance.getAttribute(key));
            });
            return widgetOptions;
        }
    }, /* 15 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = domChildren;
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__domMatches__ = __webpack_require__(20);
        /**
 * Returns the children of a given element, but only those of
 * `nodeType` 1. The list of children can also be filter by
 * a given CSS Selector.
 *
 * @function domChildren
 *
 * @param {HTMLElement} ele
 * @param {String} [selector]
 *
 * @return [Array]
 */
        function domChildren(ele, selector) {
            var children = Array.prototype.slice.call(ele.childNodes || [], 0).filter(function(childNode) {
                return 1 === childNode.nodeType;
            });
            selector && (children = children.filter(function(childNode) {
                return Object(__WEBPACK_IMPORTED_MODULE_0__domMatches__.a)(childNode, selector);
            }));
            return children;
        }
        /* harmony default export */
        __webpack_exports__.a = domChildren;
    }, /* 16 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.c = getDestroyCallback;
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return Compose;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__objectExtend__ = __webpack_require__(1);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__dataStore__ = __webpack_require__(0);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_2__queueCallback__ = __webpack_require__(24);
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        function _possibleConstructorReturn(self, call) {
            if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !call || "object" !== typeof call && "function" !== typeof call ? self : call;
        }
        function _inherits(subClass, superClass) {
            if ("function" !== typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
        }
        //=========================================================
        var PRIVATE = __WEBPACK_IMPORTED_MODULE_1__dataStore__.b.create();
        var COMMON_DESTROY_METHOD_NAME = [ "destroy", // Compose
        "remove", // DOM Events Listeners
        "off" ];
        // Aliases
        Object.create;
        // return all KEYs of an object, even those that are not iterable
        function objectKeys(prototype) {
            var k = void 0, keys = [];
            for (k in prototype) keys.push(k);
            return keys;
        }
        // Base instance methods for Compose'd object
        var baseMethods = /** @lends Compose.prototype */ {
            /**
     * Property indicating whether instance has been destroyed
     */
            isDestroyed: false,
            /**
     * instance initializing code
     */
            init: function() {},
            /**
     * Destroys the instance, by removing its private data.
     * Any attached `onDestroy` callback will be executed `async` - queued and
     * called on next event loop
     *
     * @param {Boolean} [executeCallbacksNow=false]
     */
            destroy: function(executeCallbacksNow) {
                if (PRIVATE.has(this)) {
                    var destroyCallbacks = PRIVATE.get(this);
                    PRIVATE.delete(this);
                    executeCallbacksNow ? destroyCallbacks.forEach(callOnDestroyCallback) : Object(__WEBPACK_IMPORTED_MODULE_2__queueCallback__.a)(function() {
                        return destroyCallbacks.forEach(callOnDestroyCallback);
                    });
                }
                "boolean" === typeof this.isDestroyed && (this.isDestroyed = true);
            },
            /**
     * Adds a callback to the queue to be called when this object's `.destroy()`
     * is called.
     *
     * @param {Function} callback
     */
            onDestroy: function(callback) {
                getInstanceState(this).push(callback);
            },
            /**
     * Returns the factory for this instance.
     *
     * @return {Compose}
     */
            getFactory: function() {
                if (this.constructor) return this.constructor;
            }
        };
        var staticMethods = /** @lends Compose */ {
            /**
     * Creates an new factory based on the prototye of the current Factory
     * and any other Factory given on input.
     *
     * @return {Compose}
     */
            extend: function() {
                var Class = function(_ref) {
                    _inherits(Class, _ref);
                    function Class() {
                        _classCallCheck(this, Class);
                        return _possibleConstructorReturn(this, (Class.__proto__ || Object.getPrototypeOf(Class)).apply(this, arguments));
                    }
                    return Class;
                }(this);
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                Object(__WEBPACK_IMPORTED_MODULE_0__objectExtend__.a)(Class.prototype, args.reduce(function(newProto, obj) {
                    if (obj) {
                        var thisObjProto = obj.prototype || obj;
                        objectKeys(thisObjProto).forEach(function(objKey) {
                            newProto[objKey] = thisObjProto[objKey];
                        });
                    }
                    return newProto;
                }, {}));
                return Class;
            },
            /**
     * Checks if the Object given on input looks like an instance of this Factory.
     *
     * @return {Boolean}
     */
            isInstanceOf: function(instanceObj) {
                if (!instanceObj) return false;
                var neededKeys = objectKeys(this.prototype);
                // If any prototype key is not in the object prototype, then return false
                return !neededKeys.some(function(protoKey) {
                    return "undefined" === typeof instanceObj[protoKey];
                });
            },
            /**
     * Creates an instance object based on this factory.
     *
     * @return {Object}
     */
            create: function() {
                return new (Function.prototype.bind.apply(this, [ null ].concat(Array.prototype.slice.call(arguments))))();
            },
            /**
     * Returns a standard callback that can be used to remove cleanup instance state
     * from specific Store (WeakMap). Returned function will destroy known Instances
     * that have destroy methods.
     *
     * @param {Object} instanceState
     * @param {WeakMap} [stateStore]
     *
     * @return {Function}
     *
     * @example
     *
     * const MY_PRIVATE = new WeakMap();
     * cont NewWdg = Componse.extend({
     *      init() {
     *          const state = {};
     *          MY_PRIVATE.set(this, state);
     *          ...
     *
     *          this.onDestroy(Compose.getDestroyCallback(state, MY_PRIVATE));
     *      }
     * });
     */
            getDestroyCallback: getDestroyCallback
        };
        /**
 * Returns a standard callback that can be used to remove cleanup instance state
 * from specific Store (WeakMap). Returned function will destroy known Instances
 * that have destroy methods.
 *
 * @method Compose~getDestroyCallback
 *
 * @param {Object} instanceState
 * @param {WeakMap} [stateStore]
 *
 * @return {Function}
 *
 * @example
 *
 * const MY_PRIVATE = new WeakMap();
 * cont NewWdg = Componse.extend({
 *      init() {
 *          const state = {};
 *          MY_PRIVATE.set(this, state);
 *          ...
 *
 *          this.onDestroy(Compose.getDestroyCallback(state, MY_PRIVATE));
 *      }
 * });
 */
        function getDestroyCallback(instanceState, stateStore) {
            return function() {
                instanceState && // Destroy all Compose object
                Object.keys(instanceState).forEach(function(prop) {
                    if (instanceState[prop]) {
                        COMMON_DESTROY_METHOD_NAME.some(function(method) {
                            if (instanceState[prop][method] && ("remove" !== method || !(instanceState[prop] instanceof Node))) {
                                instanceState[prop][method]();
                                return true;
                            }
                        });
                        instanceState[prop] = void 0;
                    }
                });
                stateStore && stateStore.has && stateStore.has(instanceState) && stateStore.delete(instanceState);
            };
        }
        function getInstanceState(inst) {
            PRIVATE.has(inst) || PRIVATE.set(inst, []);
            return PRIVATE.get(inst);
        }
        function callOnDestroyCallback(callback) {
            "function" === typeof callback && callback();
        }
        /**
 * Composes new factory methods from a list of given Objects/Classes.
 *
 * @class Compose
 * @borrows Compose~getDestroyCallback as Compose.getDestroyCallback
 *
 * @example
 *
 * var Widget = Compose.create(Model, Events);
 *
 * myWidget = Widget.create();
 *
 */
        var Compose = function() {
            function ComposeConstructor() {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
                // Called with `new`?
                if (this && this.constructor && this instanceof this.constructor) return this.init.apply(this, args);
                // called directly
                return new (Function.prototype.bind.apply(ComposeConstructor, [ null ].concat(args)))();
            }
            ComposeConstructor.prototype.constructor = ComposeConstructor;
            return ComposeConstructor;
        }();
        Object(__WEBPACK_IMPORTED_MODULE_0__objectExtend__.a)(Compose.prototype, baseMethods);
        Object(__WEBPACK_IMPORTED_MODULE_0__objectExtend__.a)(Compose, staticMethods);
        /* harmony default export */
        __webpack_exports__.b = Compose;
    }, /* 17 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__Set__ = __webpack_require__(25);
        /* harmony reexport (binding) */
        __webpack_require__.d(__webpack_exports__, "b", function() {
            return __WEBPACK_IMPORTED_MODULE_0__Set__.b;
        });
        /* harmony reexport (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return __WEBPACK_IMPORTED_MODULE_0__Set__.a;
        });
        /* harmony reexport (binding) */
        __webpack_require__.d(__webpack_exports__, "c", function() {
            return __WEBPACK_IMPORTED_MODULE_0__Set__.b;
        });
    }, /* 18 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = getObjectPropValue;
        /**
 * Returns an Object property value using dot notation and thus
 * find the key no matter how deep it is in the given object.
 *
 * @param {Object} obj
 *  The object to be used in retrieving the key value.
 *
 * @param {String} prop
 *  A property name whose value will be returned. This property
 *  definition could be defined using dot notation is wanting to
 *  retrieve a property deep in the object. Example:
 *  `name`, or `i18n.en-us.name`
 *
 */
        function getObjectPropValue(obj, prop) {
            if (!obj || !prop) return;
            var keys = prop.split(".");
            var key = void 0;
            for (;key = keys.shift(); ) {
                if (!obj || !(obj instanceof Object) || !(key in obj)) return;
                obj = obj[key];
            }
            return obj;
        }
        /* harmony default export */
        __webpack_exports__.a = getObjectPropValue;
    }, /* 19 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return Menu;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__jsutils_Widget__ = __webpack_require__(5);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__jsutils_EventEmitter__ = __webpack_require__(3);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_2__jsutils_dataStore__ = __webpack_require__(0);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_3__jsutils_objectExtend__ = __webpack_require__(1);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_4__jsutils_parseHTML__ = __webpack_require__(4);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_5__jsutils_fillTemplate__ = __webpack_require__(13);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_6__domutils_domAddEventListener__ = __webpack_require__(8);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_7__menu_html__ = __webpack_require__(76);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_7__menu_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__menu_html__);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_8__menuItem_html__ = __webpack_require__(77);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_8__menuItem_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__menuItem_html__);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_9__menu_less__ = __webpack_require__(78);
        /* harmony import */
        __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__menu_less__);
        var PRIVATE = __WEBPACK_IMPORTED_MODULE_2__jsutils_dataStore__.b.create();
        /**
 * Menu widget
 *
 * @class Menu
 * @extends {Widget}
 * @extends {EventEmitter}
 *
 * @param {Object} [options]
 * @param {Array<Object>} [options.items]
 *  Each menu item can have `title` (String) and `onClick` (Function)
 *
 * @fires Menu#item-click
 */
        var Menu = __WEBPACK_IMPORTED_MODULE_1__jsutils_EventEmitter__.b.extend(__WEBPACK_IMPORTED_MODULE_0__jsutils_Widget__.b).extend(/** @lends Menu.prototype */ {
            init: function(options) {
                var _this = this;
                var inst = {
                    opt: Object(__WEBPACK_IMPORTED_MODULE_3__jsutils_objectExtend__.a)({}, this.getFactory().defaults, options)
                };
                PRIVATE.set(this, inst);
                this.$ui = Object(__WEBPACK_IMPORTED_MODULE_4__jsutils_parseHTML__.a)(__WEBPACK_IMPORTED_MODULE_7__menu_html___default.a).firstChild;
                inst.opt.items && this.setItems(inst.opt.items);
                this.onDestroy(function() {
                    // Destroy all Compose object
                    Object.keys(inst).forEach(function(prop) {
                        if (inst[prop]) {
                            [ "destroy", // Compose
                            "remove", // DOM Events Listeners
                            "off" ].some(function(method) {
                                if (inst[prop][method]) {
                                    inst[prop][method]();
                                    return true;
                                }
                            });
                            inst[prop] = void 0;
                        }
                    });
                    PRIVATE.delete(_this);
                });
            },
            /**
     * Sets the items of the menu
     *
     * @param {HTMLElement|Array<Object|Widget>} items
     * If an `HTMLElement` is used on input, then the entire element is used as
     * the menu items.
     * An array of `Object` or `Widget` instances can also be used.
     */
            setItems: function(items) {
                var _this2 = this;
                var $ui = this.getEle();
                $ui.textContent = "";
                if (!items) return;
                // if items is an HTML element, then just append it to
                // the menu container... caller must have defined the
                // actions they need
                if ("appendChild" in items) {
                    $ui.appendChild(items);
                    return;
                }
                // else, if not an array, exit.
                if (!Array.isArray(items)) return;
                $ui.appendChild(items.reduce(function(content, item) {
                    // If item is a Widget, then just append that widget to the content
                    if (item.appendTo) {
                        var $li = Object(__WEBPACK_IMPORTED_MODULE_4__jsutils_parseHTML__.a)("<li></li>").firstChild;
                        item.appendTo($li);
                        content.appendChild($li);
                    } else {
                        var itemSetup = Object(__WEBPACK_IMPORTED_MODULE_3__jsutils_objectExtend__.a)({
                            title: "na",
                            onClick: null
                        }, item), menuItem = Object(__WEBPACK_IMPORTED_MODULE_4__jsutils_parseHTML__.a)(Object(__WEBPACK_IMPORTED_MODULE_5__jsutils_fillTemplate__.a)(__WEBPACK_IMPORTED_MODULE_8__menuItem_html___default.a, itemSetup)).firstChild;
                        Object(__WEBPACK_IMPORTED_MODULE_6__domutils_domAddEventListener__.a)(menuItem, "click", function() {
                            /**
                     * User clicked on an item
                     *
                     * @event Menu#item-click
                     * @type {Object}
                     */
                            _this2.emit("item-click", item);
                            itemSetup.onClick && itemSetup.onClick();
                        }, false);
                        content.appendChild(menuItem);
                    }
                    return content;
                }, document.createDocumentFragment()));
            }
        });
        Menu.defaults = {
            items: null
        };
        /* harmony default export */
        __webpack_exports__.b = Menu;
    }, /* 20 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = domMatches;
        /**
 * Given an HTML Element and a selector, this method will return
 * a Boolean indicating if Element matches selector.
 *
 * @function domMatches
 *
 * @param {HTMLElement} el
 * @param {String} selector
 *
 * @return {Boolean}
 */
        function domMatches(el, selector) {
            if (!el || !selector) return false;
            return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
        }
        /* harmony default export */
        __webpack_exports__.a = domMatches;
    }, /* 21 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = domFind;
        /**
 * Finds Elements within a given HTML Element using `querySelectorAll` and
 * return an Array with those elements.
 *
 * @function domFind
 *
 * @param {HTMLElement} domEle
 * @param {String} selector
 *
 * @returns {Array<HTMLElement>}
 */
        function domFind(domEle, selector) {
            return Array.prototype.slice.call(domEle.querySelectorAll(selector));
        }
        /* harmony default export */
        __webpack_exports__.a = domFind;
    }, /* 22 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = domHasClass;
        /**
 * Check if an element has a given class
 *
 * @function domHasClass
 *
 * @param {HTMLElement} el
 * @param {String} cssClass
 *
 * @return {Boolean}
 */
        function domHasClass(el, cssClass) {
            if (el && cssClass) return el.classList.contains(cssClass);
            return false;
        }
        /* harmony default export */
        __webpack_exports__.a = domHasClass;
    }, /* 23 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return DomKeyboardInteraction;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__jsutils_objectExtend__ = __webpack_require__(1);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__jsutils_dataStore__ = __webpack_require__(0);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_2__jsutils_EventEmitter__ = __webpack_require__(3);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_3__domAddEventListener__ = __webpack_require__(8);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_4__domFind__ = __webpack_require__(21);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_5__domChildren__ = __webpack_require__(15);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_6__domHasClass__ = __webpack_require__(22);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_7__domAddClass__ = __webpack_require__(2);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_8__domRemoveClass__ = __webpack_require__(11);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_9__domToggleClass__ = __webpack_require__(28);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_10__scrollEleIntoView__ = __webpack_require__(29);
        var PRIVATE = __WEBPACK_IMPORTED_MODULE_1__jsutils_dataStore__.b.create();
        /**
 * Adds Keyboard navigation support (up, down, enter, esc) to the
 * children of a given element controlled from an input field.
 * For use in cases where the user's cursor may be focused on an
 * input field (or an elemnet that can receive focus) and wanting to
 * control selection of HTML elements in a group.  As focus moves
 * from Element to Element, the `focusClass`  CSS class (see input
 * params) will be applied to the element.
 *
 * The keyboard action that will be applies are:
 *
 * -    UP arrow key: move focus to prior selection
 * -    DOWN arrow key: move focus to prior selection
 * -    ENTER key: Add `selectedClass` to element
 * -    ESC key: remove `focusClass` from current element
 *
 * @class DomKeyboardInteraction
 * @extends EventEmitter
 *
 * @param {Object} options
 *
 * @param {HTMLElement} options.input
 *  An input field or an element that can received focus (ex. `tabindex=0`).
 *  Keyboard interaction will be driven from this input while it has focus.
 *
 * @param {HTMLElement} options.eleGroup
 *  The Element containing the group of Element that will be cycled. This
 *  would likely be an element with `max-height` set and `overflow:auto`.
 *
 * @param {String} [options.eleSelector=""]
 *  The selector to be used in retrieving the list of element that will
 *  receive focus with the keyboard actions. Selector will be used on
 *  `options.eleGroup`. If not defined, the children of `options.eleGroup`
 *  will be used to set focus
 *
 * @param {String} [options.focusClass="my-isFocused"]
 *  The CSS class name that will be applied to the Element that gains focus.
 *
 * @param {String} [options.selectedClass="my-isSelected"]
 *  The CSS Class name that will be applied to the Element that should be
 *  marked as selected.
 *
 * @param {Boolean} [options.preventDefault=true]
 *  If set to true, `preventDefault` method of the event will be called.
 *
 * @param {Boolean} [options.stopPropagation=true]
 *  If se to `true`, `stopPropagation` method of the event will be called.
 *
 * @fires DomKeyboardInteraction#keyDown
 * @fires DomKeyboardInteraction#keyUp
 * @fires DomKeyboardInteraction#keyEnter
 * @fires DomKeyboardInteraction#keyEsc
 *
 * @example
 *
 * var keyboardInteraction = DomKeyboardInteraction.create({
 *      input: inputFieldElement,
 *      eleGroup: choicesElement,
 *      eleSelector: ".choice"
 * });
 */
        var DomKeyboardInteraction = /** @lends DomKeyboardInteraction.prototype */ {
            init: function(options) {
                var inst = {
                    opt: Object(__WEBPACK_IMPORTED_MODULE_0__jsutils_objectExtend__.a)({}, DomKeyboardInteraction.defaults, options)
                }, opt = inst.opt, domListeners = [];
                PRIVATE.set(this, inst);
                if (!opt.input || !opt.eleGroup) throw new TypeError("options.input and options.eleGroup are required");
                // Helper methods
                inst.hasFocus = function(ele) {
                    return Object(__WEBPACK_IMPORTED_MODULE_6__domHasClass__.a)(ele, opt.focusClass);
                };
                inst.setFocus = function(ele) {
                    return Object(__WEBPACK_IMPORTED_MODULE_7__domAddClass__.a)(ele, opt.focusClass);
                };
                inst.removeFocus = function(ele) {
                    return Object(__WEBPACK_IMPORTED_MODULE_8__domRemoveClass__.a)(ele, opt.focusClass);
                };
                inst.getChildren = function() {
                    return opt.eleSelector ? Object(__WEBPACK_IMPORTED_MODULE_4__domFind__.a)(opt.eleGroup, opt.eleSelector) : Object(__WEBPACK_IMPORTED_MODULE_5__domChildren__.a)(opt.eleGroup);
                };
                domListeners.push(Object(__WEBPACK_IMPORTED_MODULE_3__domAddEventListener__.a)(opt.input, "keydown", function(ev) {
                    var focusEle, key = ev.which || ev.keyCode, eventName = "";
                    switch (key) {
                      case 40:
                        /**
                     * User clicked the DOWN arrow key.
                     *
                     * @event DomKeyboardInteraction#keyDown
                     *
                     * @type {KeyboardEvent}
                     * @property {HTMLElement|undefined} focusElement
                     */
                        eventName = "keyDown";
                        focusEle = this.focusNext();
                        break;

                      case 38:
                        /**
                     * User clicked the UP arrow key.
                     *
                     * @event DomKeyboardInteraction#keyUp
                     *
                     * @type {KeyboardEvent}
                     * @property {HTMLElement|undefined} focusElement
                     */
                        eventName = "keyUp";
                        focusEle = this.focusPrevious();
                        break;

                      case 13:
                        /**
                     * User clicked the ENTER key.
                     *
                     * @event DomKeyboardInteraction#keyEnter
                     *
                     * @type {KeyboardEvent}
                     * @property {HTMLElement|undefined} focusElement
                     */
                        eventName = "keyEnter";
                        focusEle = toggleSelected.call(this);
                        break;

                      case 27:
                        /**
                     * User clicked the ESC key.
                     *
                     * @event DomKeyboardInteraction#keyEsc
                     *
                     * @type {KeyboardEvent}
                     * @property {HTMLElement|undefined} focusElement
                     */
                        eventName = "keyEsc";
                        focusEle = this.resetFocus();
                    }
                    if (eventName) {
                        ev.focusElement = focusEle;
                        opt.preventDefault && ev.preventDefault();
                        opt.stopPropagation && ev.stopPropagation();
                        this.emit(eventName, ev);
                    }
                }.bind(this)));
                this.onDestroy(function() {
                    var ev;
                    for (;ev = domListeners.shift(); ) ev.remove();
                    PRIVATE.delete(this);
                }.bind(this));
            },
            /**
     * Sets focus on the next result item
     *
     * @return {HTMLElement|undefined}
     *  Returns the Element currently with focus
     */
            focusNext: function() {
                var currentFocusEle, currentFocusEleIndex, inst = PRIVATE.get(this), scrollingParent = inst.opt.eleGroup, groupChildren = inst.getChildren(), hasFocus = inst.hasFocus, setFocus = inst.setFocus;
                if (!groupChildren.length) return;
                // Find currently focused element (if any)
                groupChildren.some(function(ele, index) {
                    if (hasFocus(ele)) {
                        currentFocusEleIndex = index;
                        currentFocusEle = ele;
                        return true;
                    }
                });
                // Nothing selected? - set first item
                if (!currentFocusEle) {
                    setFocus(groupChildren[0]);
                    Object(__WEBPACK_IMPORTED_MODULE_10__scrollEleIntoView__.a)(groupChildren[0], scrollingParent);
                    return groupChildren[0];
                }
                inst.removeFocus(currentFocusEle);
                // If currently in the last item, select the first one again
                if (currentFocusEleIndex === groupChildren.length - 1) {
                    setFocus(groupChildren[0]);
                    Object(__WEBPACK_IMPORTED_MODULE_10__scrollEleIntoView__.a)(groupChildren[0], scrollingParent);
                    return groupChildren[0];
                }
                setFocus(groupChildren[currentFocusEleIndex + 1]);
                Object(__WEBPACK_IMPORTED_MODULE_10__scrollEleIntoView__.a)(groupChildren[currentFocusEleIndex + 1], scrollingParent);
                return groupChildren[currentFocusEleIndex + 1];
            },
            /**
     * Sets focus on previous result item
     *
     * @return {HTMLElement|undefined}
     */
            focusPrevious: function() {
                var currentFocusEle, currentFocusEleIndex, inst = PRIVATE.get(this), opt = inst.opt, scrollingParent = opt.eleGroup, groupChildren = inst.getChildren(), lastIndex = groupChildren.length - 1, hasFocus = inst.hasFocus, setFocus = inst.setFocus;
                if (!groupChildren.length) return;
                // Find currently focused element (if any)
                groupChildren.some(function(ele, index) {
                    if (hasFocus(ele)) {
                        currentFocusEleIndex = index;
                        currentFocusEle = ele;
                        return true;
                    }
                });
                // Nothing selected? - set last item
                if (!currentFocusEle) {
                    setFocus(groupChildren[lastIndex]);
                    Object(__WEBPACK_IMPORTED_MODULE_10__scrollEleIntoView__.a)(groupChildren[lastIndex], scrollingParent);
                    return groupChildren[lastIndex];
                }
                inst.removeFocus(currentFocusEle);
                // If currently in the first item, select the last one again
                if (0 === currentFocusEleIndex) {
                    setFocus(groupChildren[lastIndex]);
                    Object(__WEBPACK_IMPORTED_MODULE_10__scrollEleIntoView__.a)(groupChildren[lastIndex], scrollingParent);
                    return groupChildren[lastIndex];
                }
                setFocus(groupChildren[currentFocusEleIndex - 1]);
                Object(__WEBPACK_IMPORTED_MODULE_10__scrollEleIntoView__.a)(groupChildren[currentFocusEleIndex - 1], scrollingParent);
                return groupChildren[currentFocusEleIndex - 1];
            },
            /**
     * Resets the focus.
     *
     * @return {HTMLElement}
     *  If an element had focus, it will be returned.
     */
            resetFocus: function() {
                var focusedEle = this.getFocusEle();
                focusedEle && PRIVATE.get(this).removeFocus(focusedEle);
                return focusedEle;
            },
            /**
     * Returns the DOM element currently with focus
     *
     * @return {HTMLElement}
     */
            getFocusEle: function() {
                var response, inst = PRIVATE.get(this);
                inst.getChildren().some(function(ele) {
                    if (inst.hasFocus(ele)) {
                        response = ele;
                        return true;
                    }
                });
                return response;
            }
        };
        function toggleSelected() {
            var focusedEle, inst = PRIVATE.get(this), selectedClass = inst.opt.selectedClass;
            if (selectedClass) {
                focusedEle = this.getFocusEle();
                focusedEle && Object(__WEBPACK_IMPORTED_MODULE_9__domToggleClass__.a)(focusedEle, selectedClass);
            }
            return focusedEle;
        }
        DomKeyboardInteraction = __WEBPACK_IMPORTED_MODULE_2__jsutils_EventEmitter__.b.extend(DomKeyboardInteraction);
        DomKeyboardInteraction.defaults = {
            input: null,
            eleGroup: null,
            focusClass: "my-isFocused",
            selectedClass: "my-isSelected",
            eleSelector: ""
        };
        /* harmony default export */
        __webpack_exports__.b = DomKeyboardInteraction;
    }, /* 24 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = queueCallback;
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__es6_Set__ = __webpack_require__(17);
        function _toConsumableArray(arr) {
            if (Array.isArray(arr)) {
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
                return arr2;
            }
            return Array.from(arr);
        }
        //===============================================
        var callbacks = new __WEBPACK_IMPORTED_MODULE_0__es6_Set__.c();
        var queue = void 0;
        /**
 * Queue a callback to be executed after at the start of next event loop.
 * This differs from `nextTick` in that callbacks are not executed during
 * micro-processing, but rather on next event loop, so this is not ideal
 * for logic that can cause UI reflow.
 *
 * @param {Function} cb
 */
        function queueCallback(cb) {
            if ("function" === typeof cb) {
                callbacks.add(cb);
                queue || (queue = setTimeout(flushQueue, 0));
            }
        }
        /* harmony default export */
        __webpack_exports__.a = queueCallback;
        function flushQueue() {
            var cbList = [].concat(_toConsumableArray(callbacks));
            callbacks.clear();
            queue = null;
            var cb = void 0;
            for (;cb = cbList.shift(); ) {
                cb();
                cb = null;
            }
        }
    }, /* 25 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "b", function() {
            return Set;
        });
        /* harmony export (immutable) */
        __webpack_exports__.a = FakeSet;
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__getGlobal__ = __webpack_require__(10);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__Iterator__ = __webpack_require__(27);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_2__runtime_aliases__ = __webpack_require__(9);
        //============================================================
        var Set = Object(__WEBPACK_IMPORTED_MODULE_0__getGlobal__.b)().Set || FakeSet;
        function FakeSet() {}
        Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.f)(FakeSet.prototype, {
            constructor: {
                value: FakeSet,
                configurable: true
            },
            _: {
                get: function() {
                    var values = [];
                    Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.g)(this, "_", {
                        value: values
                    });
                    return values;
                }
            },
            add: {
                value: function(item) {
                    -1 === Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.b)(this._, item) && this._.push(item);
                    return this;
                }
            },
            has: {
                value: function(item) {
                    return -1 !== Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.b)(this._, item);
                }
            },
            size: {
                get: function() {
                    return this._.length;
                }
            },
            clear: {
                value: function() {
                    this._.splice(0);
                }
            },
            delete: {
                value: function(item) {
                    var idx = Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.b)(this._, item);
                    if (-1 !== idx) {
                        this._.splice(idx, 1);
                        return true;
                    }
                    return false;
                }
            },
            values: {
                value: function() {
                    return new __WEBPACK_IMPORTED_MODULE_1__Iterator__.a(this._);
                }
            },
            entries: {
                value: function() {
                    return new __WEBPACK_IMPORTED_MODULE_1__Iterator__.a(this._, this._);
                }
            },
            forEach: {
                value: function(cb) {
                    var _this = this;
                    this._.forEach(function(item) {
                        return cb(item, item, _this);
                    });
                }
            }
        });
    }, /* 26 */
    /***/
    function(module, exports) {
        var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var g;
        // This works in non-strict mode
        g = function() {
            return this;
        }();
        try {
            // This works if eval is allowed (see CSP)
            g = g || Function("return this")() || (0, eval)("this");
        } catch (e) {
            // This works if the window reference is available
            "object" === ("undefined" === typeof window ? "undefined" : _typeof(window)) && (g = window);
        }
        // g can still be undefined, but nothing to do about it...
        // We return undefined, instead of nothing here, so it's
        // easier to handle this case. if(!global) { ...}
        module.exports = g;
    }, /* 27 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.a = FakeIterator;
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__runtime_aliases__ = __webpack_require__(9);
        //-----------------------------------------------------------------------
        var $iterator$ = "undefined" !== typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator";
        // Great reference: http://2ality.com/2015/02/es6-iteration.html
        function FakeIterator(keys, values) {
            Object(__WEBPACK_IMPORTED_MODULE_0__runtime_aliases__.g)(this, "_", {
                value: {
                    keys: keys.slice(0),
                    values: values ? values.slice(0) : null,
                    idx: 0,
                    total: keys.length
                }
            });
        }
        Object(__WEBPACK_IMPORTED_MODULE_0__runtime_aliases__.f)(FakeIterator.prototype, {
            constructor: {
                value: FakeIterator
            },
            next: {
                enumerable: true,
                configurable: true,
                value: function() {
                    var response = {
                        done: this._.idx === this._.total
                    };
                    if (response.done) {
                        response.value = void 0;
                        return response;
                    }
                    var nextIdx = this._.idx++;
                    response.value = this._.keys[nextIdx];
                    this._.values && (response.value = [ response.value, this._.values[nextIdx] ]);
                    return response;
                }
            }
        });
        Object(__WEBPACK_IMPORTED_MODULE_0__runtime_aliases__.g)(FakeIterator.prototype, $iterator$, {
            value: function() {
                return this;
            }
        });
    }, /* 28 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = domToggleClass;
        /**
 * Toggles a CSS class on/off on an element
 *
 * @function domToggleClass
 *
 * @param {HTMLElement} el
 * @param {String} cssClass
 */
        function domToggleClass(el, cssClass) {
            if (el) return el.classList.toggle(cssClass);
        }
        /* harmony default export */
        __webpack_exports__.a = domToggleClass;
    }, /* 29 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = scrollEleIntoView;
        /**
 * Given an element that is inside of a Scrolling Element
 * (one that has a fixed height with overflow), this utility
 * will manipulate the Scrolling element's `scrollTop` so that
 * the Element is made visible in the area provided by the
 * Scrolling Element.
 *
 * @function scrollEleIntoView
 *
 * @param {HTMLElement} ele
 * @param {HTMLElement} scrollingParent
 */
        function scrollEleIntoView(ele, scrollingParent) {
            if (!ele || !scrollingParent || !scrollingParent.contains(ele)) return;
            var parentScrollTop = scrollingParent.scrollTop, parentHeight = scrollingParent.clientHeight, eleHeight = ele.clientHeight, parentClientRect = scrollingParent.getBoundingClientRect(), eleClientRect = ele.getBoundingClientRect();
            eleClientRect.top < parentClientRect.top ? scrollingParent.scrollTop = parentScrollTop + eleClientRect.top - parentClientRect.top : eleClientRect.bottom > parentClientRect.bottom && (scrollingParent.scrollTop = parentScrollTop + eleClientRect.top - parentClientRect.top - parentHeight + eleHeight);
        }
        /* harmony default export */
        __webpack_exports__.a = scrollEleIntoView;
    }, /* 30 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = domPositionedParent;
        var IS_POSITIONED = /fixed|relative|absolute/i;
        var ROOT = document.documentElement;
        /**
 * Returns the closest DOM element ancestor to the given Element on input
 * that is positioned - being it has a css `position` value of `fixed`,
 * `relative` or `absolute`.
 *
 * @param {HTMLElement} ele
 *
 * @return {HTMLElement}
 */
        function domPositionedParent(ele) {
            if (!ele) return ROOT;
            var ELE_ROOT = ele.ownerDocument && ele.ownerDocument.documentElement ? ele.ownerDocument.documentElement : ROOT;
            if (!ele.parentElement || ele.parentElement === ELE_ROOT) return ELE_ROOT;
            var parentEle = ele.parentElement;
            if (IS_POSITIONED.test(window.getComputedStyle(parentEle).getPropertyValue("position"))) return parentEle;
            return domPositionedParent(parentEle);
        }
        /* harmony default export */
        __webpack_exports__.a = domPositionedParent;
    }, /* 31 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = domPosition;
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__jsutils_objectExtend__ = __webpack_require__(1);
        var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var WINDOW = window;
        var DOCUMENT = WINDOW.document;
        var SCROLL_TOP = "scrollTop";
        var SCROLL_LEFT = "scrollLeft";
        var PAGE_Y_OFFSET = "pageYOffset";
        var PAGE_X_OFFSET = "pageXOffset";
        var UNDEFINED = "undefined";
        var PX = "px";
        //const isTop     = /top/i;
        //const isBottom  = /bottom/i;
        var isLeft = /left/i;
        //const isRight   = /right/i;
        /**
 * Positions an element against another. Elements (both `positionEle` and
 * `anchorEle` should already be visible in dom (ex. call this method right
 * after adding them to DOM).
 *
 * @function domPosition
 *
 * @param {HTMLElement} positionEle
 *
 * @param {HTMLElement} anchorEle
 *
 * @param {Object} [options]
 * 
 * @param {String} [options.my]
 *  Which area of the `positionEle` should be used to position it against the
 *  `anchorEle`. Default is `top left`. Possible values:
 *  -   `top left`
 *  -   `top right`
 *
 * @param {String} [options.at]
 *  The `anchorEle` position where the `positionEle` should be displayed. Default
 *  is `bottom left` (so right below the `anchorEle`, left aligned).
 *
 * @param {HTMLElement} [options.viewport=window]
 *  The viewport to be used in detecting collision. (NOTE: currently,
 *  only window is supported)
 *
 */
        function domPosition(positionEle, anchorEle, options) {
            var positionEleStyles = positionEle.style;
            var anchorEleRect = anchorEle.getBoundingClientRect();
            var positionEleRect = positionEle.getBoundingClientRect();
            var opt = Object(__WEBPACK_IMPORTED_MODULE_0__jsutils_objectExtend__.a)({
                my: "top left",
                at: "bottom left",
                viewport: WINDOW
            }, options);
            var _getViewportScrollInf = getViewportScrollInfo(opt.viewport), scrollTop = _getViewportScrollInf.scrollTop, scrollLeft = _getViewportScrollInf.scrollLeft;
            // FIXME: support for non-window viewport
            // FIXME: support for non window viewport
            // var viewportTop     = 0;
            var viewportBottom = opt.viewport.innerHeight;
            var viewportRight = opt.viewport.innerWidth;
            var isMyLeft = isLeft.test(opt.my);
            var isMyRight = !isMyLeft;
            var isAtLeft = isLeft.test(opt.at);
            var isAtRight = !isAtLeft;
            // Set default coordinates based o above position defaults
            var posLeft = anchorEleRect.left;
            var posTop = anchorEleRect.bottom + scrollTop;
            //------------------------------------------
            // CALCULATE: TOP
            // Top side of position ele
            //------------------------------------------
            // FIXME: support for "my" === bottom as well as "at" top
            //------------------------------------------
            // CALCULATE: LEFT
            // Left side of the position el
            //------------------------------------------
            // my === left  &&  at === right
            isMyLeft && isAtRight ? posLeft = anchorEleRect.right : isMyRight && isAtRight ? posLeft = anchorEleRect.right - positionEleRect.width : isMyRight && isAtLeft && (posLeft = anchorEleRect.left - positionEleRect.width);
            //------------------------------------------------------
            // Adjust positions based on viewport collisions
            //------------------------------------------------------
            //--- LEFT --\\
            // If the Right side of the position element goes beyound
            // the right side of the viewport, flip the horizontal position...
            posLeft + positionEleRect.width > viewportRight + scrollLeft && (posLeft -= positionEleRect.width);
            //--- TOP --\\
            // If it the position of the element goes beyond the bottom of
            // the viewport, flip it up...
            posTop + positionEleRect.height > viewportBottom + scrollTop && (posTop -= positionEleRect.height + anchorEleRect.height);
            positionEleStyles.left = posLeft + PX;
            positionEleStyles.top = posTop + PX;
        }
        /* harmony default export */
        __webpack_exports__.a = domPosition;
        /**
 * returns the `scrollTop` and `scrollLeft` for a given element
 *
 * @param {HTMLElement|Window|Document} viewport
 * @returns {Object}
 *
 * @example
 *
 * // return object:
 *
 * {
 *      scrollTop:      222,
 *      scrollLeft:     11
 * }
 *
 */
        function getViewportScrollInfo(viewport) {
            var response = {};
            if (viewport === WINDOW || viewport === DOCUMENT) if (_typeof(WINDOW[PAGE_Y_OFFSET]) !== UNDEFINED) {
                response[SCROLL_TOP] = WINDOW[PAGE_Y_OFFSET];
                response[SCROLL_LEFT] = WINDOW[PAGE_X_OFFSET];
            } else if (DOCUMENT.documentElement) {
                response[SCROLL_TOP] = DOCUMENT.documentElement[SCROLL_TOP];
                response[SCROLL_LEFT] = DOCUMENT.documentElement[SCROLL_LEFT];
            } else {
                response[SCROLL_TOP] = DOCUMENT.body[SCROLL_TOP];
                response[SCROLL_LEFT] = DOCUMENT.body[SCROLL_LEFT];
            } else {
                response[SCROLL_TOP] = viewport[SCROLL_TOP];
                response[SCROLL_LEFT] = viewport[SCROLL_LEFT];
            }
            return response;
        }
    }, /* 32 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = domSetStyle;
        var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        /**
 * Sets styles on an element
 *
 * @function domSetStyle
 *
 * @param {HTMLElement} el
 * @param {Object} styles
 *
 * @example
 *
 * domSetStyle(document.body, {"background-color", "yellow"});
 */
        function domSetStyle(el, styles) {
            if (!el || "object" !== ("undefined" === typeof styles ? "undefined" : _typeof(styles))) return;
            Object.keys(styles).forEach(function(prop) {
                el.style[prop] = styles[prop];
            });
        }
        /* harmony default export */
        __webpack_exports__.a = domSetStyle;
    }, /* 33 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = domTriggerEvent;
        var keyboardEvents = [ "keyup", "keydown", "keypress" ], mouseEvents = [ "mouseup", "mousedown" ];
        /**
 * @private
 *
 * @returns {Event}
 */
        function getNewGenericEvent(eventName, options) {
            var event;
            try {
                event = new Event(eventName);
            } catch (e) {
                event = document.createEvent("CustomEvent");
                event.initCustomEvent(eventName, true, true, options || {});
            }
            return event;
        }
        /**
 * @private
 *
 * @returns {Event}
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
 */
        function getNewKeyboardEvent(eventName, options) {
            var event;
            try {
                event = new KeyboardEvent(eventName, options);
            } catch (e) {
                event = getNewGenericEvent(eventName, options);
            }
            return event;
        }
        /**
 * @private
 *
 * @returns {Event}
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent
 */
        function getNewMouseEvent(eventName, options) {
            var event;
            try {
                event = new MouseEvent(eventName);
            } catch (e) {
                event = getNewGenericEvent(eventName, options);
            }
            return event;
        }
        /**
 * Triggers an events on a given DOM Element.
 *
 * @function domTriggerEvent
 *
 * @param {HTMLElement} ele
 * @param {String} eventName
 * @param {Object} [options]
 *
 */
        function domTriggerEvent(ele, eventName, options) {
            if (!ele || !eventName) return;
            // FIXME: does not work for window.scroll()
            if ("function" === typeof ele[eventName]) {
                ele[eventName]();
                return;
            }
            var evInstance;
            -1 !== keyboardEvents.indexOf(eventName) ? evInstance = getNewKeyboardEvent(eventName, options) : -1 !== mouseEvents.indexOf(eventName) && (evInstance = getNewMouseEvent(eventName, options));
            ele.dispatchEvent(evInstance);
        }
        /* harmony default export */
        __webpack_exports__.a = domTriggerEvent;
    }, /* 34 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return Component;
        });
        /* harmony export (immutable) */
        __webpack_exports__.c = registerCustomElementAs;
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__dataStore__ = __webpack_require__(0);
        var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    "value" in descriptor && (descriptor.writable = true);
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                protoProps && defineProperties(Constructor.prototype, protoProps);
                staticProps && defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        function _possibleConstructorReturn(self, call) {
            if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !call || "object" !== typeof call && "function" !== typeof call ? self : call;
        }
        function _inherits(subClass, superClass) {
            if ("function" !== typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
        }
        var _fixBabelExtend = function(O) {
            var gPO = O.getPrototypeOf || function(o) {
                return o.__proto__;
            }, sPO = O.setPrototypeOf || function(o, p) {
                o.__proto__ = p;
                return o;
            }, construct = "object" === ("undefined" === typeof Reflect ? "undefined" : _typeof(Reflect)) ? Reflect.construct : function(Parent, args, Class) {
                var Constructor, a = [ null ];
                a.push.apply(a, args);
                Constructor = Parent.bind.apply(Parent, a);
                return sPO(new Constructor(), Class.prototype);
            };
            return function(Class) {
                var Parent = gPO(Class);
                return sPO(Class, sPO(function() {
                    return construct(Parent, arguments, gPO(this).constructor);
                }, Parent));
            };
        }(Object);
        //=================================================================
        var PRIVATE = __WEBPACK_IMPORTED_MODULE_0__dataStore__.b.create();
        /**
 * A Widget defined as an html Custom Element.
 *
 * @extends HTMLElement
 */
        var Component = _fixBabelExtend(function(_HTMLElement) {
            _inherits(Component, _HTMLElement);
            // Taken from: https://github.com/WebReflection/document-register-element#skipping-the-caveat-through-extends
            function Component(_) {
                var _this, _ret;
                _classCallCheck(this, Component);
                return _ret = ((_ = (_this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this, _)), 
                _this)).init(), _), _possibleConstructorReturn(_this, _ret);
            }
            //==============================================================[    STATIC MEMBERS     ]
            /**
     * Returns the number of milliseconds to delay calling the `destroy` method after the
     * element is removed from DOM.
     *
     * @returns {number}
     */
            _createClass(Component, [ {
                key: "init",
                //==============================================================[    INSTANCE MEMBERS     ]
                /**
         * Run initialization logic
         */
                value: function() {}
            }, {
                key: "connectedCallback",
                value: function() {
                    // Cancel destroy if it is queued
                    if (PRIVATE.has(this)) {
                        var state = getInstanceState(this);
                        if (state.destroyQueued) {
                            clearTimeout(state.destroyQueued);
                            state.destroyQueued = null;
                        }
                    }
                }
            }, {
                key: "disconnectedCallback",
                value: function() {
                    // Delay calling .destroy() by 60s, just in case user re-attaches component back to dom.
                    // This seems to be currently the only way to ensure attached `onDestroy` logic run when
                    // the element is no longer needed.
                    if (PRIVATE.has(this)) {
                        var state = getInstanceState(this);
                        state.destroyQueued || (state.destroyQueued = setTimeout(this.destroy.bind(this), this.constructor.autoDestroyDelay));
                    }
                }
            }, {
                key: "emit",
                value: function(eventName, data) {
                    this.dispatchEvent(new CustomEvent(eventName, {
                        detail: data
                    }));
                }
            }, {
                key: "destroy",
                value: function() {
                    if (PRIVATE.has(this)) {
                        var state = getInstanceState(this);
                        PRIVATE.delete(this);
                        if (state.destroyQueued) {
                            clearTimeout(state.destroyQueued);
                            state.destroyQueued = null;
                        }
                        state.destroyCallbacks.splice(0).forEach(function(cb) {
                            return cb();
                        });
                    }
                }
            }, {
                key: "onDestroy",
                value: function(callback) {
                    getInstanceState(this).destroyCallbacks.push(callback);
                }
            } ], [ {
                key: "register",
                /**
         * Helper method that registers the component on the page with the given name (html tagName).
         * Shortcut to `customElements.define()` method of `CustomElementRegistry`.
         *
         * @param {String} [name=this.tagName]
         */
                value: function(name) {
                    registerCustomElementAs(this, name || this.tagName);
                }
            }, {
                key: "autoDestroyDelay",
                get: function() {
                    return 6e4;
                }
            }, {
                key: "tagName",
                get: function() {
                    return "";
                }
            } ]);
            return Component;
        }(HTMLElement));
        /* harmony default export */
        __webpack_exports__.b = Component;
        function getInstanceState(instance) {
            PRIVATE.has(instance) || PRIVATE.set(instance, {
                props: {},
                attrs: {},
                destroyCallbacks: [],
                destroyQueued: null
            });
            return PRIVATE.get(instance);
        }
        /**
 * Registers a component on the document. Shortcut to `customElements.define`;
 *
 * @param {HTMLElement} Constructor
 * @param {String} name
 */
        function registerCustomElementAs(Constructor, name) {
            customElements.define(name, Constructor);
        }
    }, /* 35 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "b", function() {
            return Map;
        });
        /* harmony export (immutable) */
        __webpack_exports__.a = FakeMap;
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__getGlobal__ = __webpack_require__(10);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__Iterator__ = __webpack_require__(27);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_2__runtime_aliases__ = __webpack_require__(9);
        //======================================================
        var Map = Object(__WEBPACK_IMPORTED_MODULE_0__getGlobal__.b)().Map || FakeMap;
        function FakeMap() {}
        Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.f)(FakeMap.prototype, {
            constructor: {
                value: FakeMap,
                configurable: true
            },
            _: {
                get: function() {
                    Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.g)(this, "_", {
                        value: {
                            keys: [],
                            values: []
                        }
                    });
                    return this._;
                }
            },
            set: {
                value: function(key, _value) {
                    if (-1 === Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.b)(this._.keys, key)) {
                        this._.keys.push(key);
                        this._.values.push(_value);
                    }
                    return this;
                }
            },
            has: {
                value: function(key) {
                    return -1 !== Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.b)(this._.keys, key);
                }
            },
            size: {
                get: function() {
                    return this._.keys.length;
                }
            },
            clear: {
                value: function() {
                    Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.c)(this._.keys, 0);
                    Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.c)(this._.values, 0);
                }
            },
            delete: {
                value: function(key) {
                    var idx = Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.b)(this._.keys, key);
                    if (-1 !== idx) {
                        Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.c)(this._.keys, idx, 1);
                        Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.c)(this._.values, idx, 1);
                        return true;
                    }
                    return false;
                }
            },
            keys: {
                value: function() {
                    return new __WEBPACK_IMPORTED_MODULE_1__Iterator__.a(this._.keys);
                }
            },
            values: {
                value: function() {
                    return new __WEBPACK_IMPORTED_MODULE_1__Iterator__.a(this._.values);
                }
            },
            entries: {
                value: function() {
                    return new __WEBPACK_IMPORTED_MODULE_1__Iterator__.a(this._.keys, this._.values);
                }
            },
            forEach: {
                value: function(cb) {
                    var _this = this;
                    this._.keys.forEach(function(item, i) {
                        return cb(_this._.values[i], item, _this);
                    });
                }
            }
        });
    }, /* 36 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "b", function() {
            return nextTick;
        });
        var reIsNativeCode = /native code/i;
        /**
 * Executes a function at the end of the current event Loop - during micro-task processing
 *
 * @param {Function} callback
 */
        var nextTick = function() {
            if ("undefined" !== typeof setImediate && reIsNativeCode.test(setImediate.toString())) return setImediate;
            // Native Promsie? Use it.
            if ("function" === typeof Promise && reIsNativeCode.test(Promise.toString())) {
                var resolved = Promise.resolve();
                return function(fn) {
                    resolved.then(fn).catch(function(e) {
                        return console.log(e);
                    });
                };
            }
            // fallback to setTimeout
            // From: https://bugzilla.mozilla.org/show_bug.cgi?id=686201#c68
            var immediates = [];
            var processing = false;
            function processPending() {
                setTimeout(function() {
                    immediates.shift()();
                    immediates.length ? processPending() : processing = false;
                }, 0);
            }
            return function(fn) {
                immediates.push(fn);
                if (!processing) {
                    processing = true;
                    processPending();
                }
            };
        }();
        /* harmony default export */
        __webpack_exports__.a = nextTick;
    }, /* 37 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return Popup;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__jsutils_Widget__ = __webpack_require__(5);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__jsutils_parseHTML__ = __webpack_require__(4);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_2__jsutils_objectExtend__ = __webpack_require__(1);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_3__jsutils_dataStore__ = __webpack_require__(0);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_4__domutils_domPosition__ = __webpack_require__(31);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_5__domutils_domAddEventListener__ = __webpack_require__(8);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_6__popup_html__ = __webpack_require__(73);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_6__popup_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__popup_html__);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_7__popup_less__ = __webpack_require__(74);
        /* harmony import */
        __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__popup_less__);
        var PRIVATE = __WEBPACK_IMPORTED_MODULE_3__jsutils_dataStore__.b.create(), BODY = document.body, /**
 * Displays a popup relative to a given element (attached to).
 *
 * @class Popup
 * @extends Widget
 *
 * @param {Object} [options]
 * @param {Widget|HTMLElement} [options.content]
 * @param {HTMLElement} [options.attachTo]
 * @param {Object} [options.position]
 *  Object with any param accepted by `domPosition` utility.
 *  Example:
 *
 *      {
 *          my: "top right",
 *          at: "bottom right"
 *      }
 * @param {Function} [options.onHide]
 *  A function that is called when the dialog is hidden due
 *  to the user clicking outiside of it. If this function
 *  return `true`, then the dialog will not be hidden.
 *  Function is given the DOM event object
 *
 */
        Popup = {
            init: function(options) {
                var inst = {
                    opt: Object(__WEBPACK_IMPORTED_MODULE_2__jsutils_objectExtend__.a)({}, this.getFactory().defaults, options),
                    $ele: null,
                    domListeners: [],
                    scrollTop: 0
                };
                PRIVATE.set(this, inst);
                this.$ui = Object(__WEBPACK_IMPORTED_MODULE_1__jsutils_parseHTML__.a)(__WEBPACK_IMPORTED_MODULE_6__popup_html___default.a).firstChild;
                inst.opt.content && this.setContent(inst.opt.content);
                inst.opt.attachTo && this.attachTo(inst.opt.attachTo);
                this.onDestroy(removeAllDomListeners.bind(this));
            },
            /**
     * Sets the content of the popup
     *
     * @param {Widget|HTMLElement} [content]
     */
            setContent: function(content) {
                var $ui = this.getEle();
                $ui.textContent = "";
                if (!content) return;
                content.appendTo ? content.appendTo($ui) : "childNodes" in content && $ui.appendChild(content);
                this.isVisible() && this.show();
            },
            /**
     * Attaches the popup to a given element
     *
     * @param {HTMLElement|Widget} ele
     */
            attachTo: function(ele) {
                var inst = PRIVATE.get(this);
                ele.getEle && (ele = ele.getEle());
                inst.$ele = ele;
                this.isVisible() && this.show();
            },
            show: function() {
                var inst = PRIVATE.get(this), $ui = this.getEle();
                if (!inst.$ele) return;
                this.appendTo(BODY);
                Object(__WEBPACK_IMPORTED_MODULE_4__domutils_domPosition__.a)($ui, inst.$ele, inst.opt.position);
                removeAllDomListeners.call(this);
                $ui.scrollTop = inst.scrollTop;
                setTimeout(function() {
                    inst.domListeners.push(Object(__WEBPACK_IMPORTED_MODULE_5__domutils_domAddEventListener__.a)(BODY, "click", function(ev) {
                        if (!$ui.contains(ev.target)) {
                            if (inst.opt.onHide && inst.opt.onHide(ev)) return;
                            this.hide();
                        }
                    }.bind(this)));
                }.bind(this), 200);
            },
            hide: function() {
                PRIVATE.get(this).scrollTop = this.getEle().scrollTop;
                this.detach();
                removeAllDomListeners.call(this);
            }
        }, /**
 * Removes the DOM listeners
 * @private
 */
        removeAllDomListeners = function() {
            var domListeners = PRIVATE.get(this).domListeners;
            if (domListeners.length) {
                var evListener;
                for (;evListener = domListeners.shift(); ) evListener.remove();
            }
        };
        Popup = __WEBPACK_IMPORTED_MODULE_0__jsutils_Widget__.b.extend(Popup);
        Popup.defaults = {
            content: null,
            attachTo: null,
            position: null,
            onHide: null
        };
        /* harmony default export */
        __webpack_exports__.b = Popup;
    }, /* 38 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return Picker;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__jsutils_Widget__ = __webpack_require__(5);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__jsutils_fillTemplate__ = __webpack_require__(13);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_2__jsutils_parseHTML__ = __webpack_require__(4);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_3__jsutils_objectExtend__ = __webpack_require__(1);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_4__jsutils_dataStore__ = __webpack_require__(0);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_5__jsutils_EventEmitter__ = __webpack_require__(3);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_6__domutils_DomKeyboardInteraction__ = __webpack_require__(23);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_7__domutils_domSetStyle__ = __webpack_require__(32);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_8__domutils_domAddClass__ = __webpack_require__(2);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_9__domutils_domTriggerEvent__ = __webpack_require__(33);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_10__Popup_Popup__ = __webpack_require__(37);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_11__Menu_Menu__ = __webpack_require__(19);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_12__Picker_html__ = __webpack_require__(80);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_12__Picker_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__Picker_html__);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_13__Picker_less__ = __webpack_require__(81);
        /* harmony import */
        __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__Picker_less__);
        //-----------------------------------------------------------
        var PRIVATE = __WEBPACK_IMPORTED_MODULE_4__jsutils_dataStore__.b.create();
        /**
 * Display a picker widget.
 *
 * @class Picker
 * @extends Widget
 * @extends EventEmitter
 *
 * @param {Object} [options]
 * @param {Object} [options.labels]
 * @param {String} [options.labels.title="Select..."]
 * @param {String} [options.popupWidth="full"]
 *  A CSS value for the width of the popup, or the word `full` if wanting
 *  the width of the popup to be as wide as the element to which it is attached
 *
 * @triggers Picker#item-selected
 * @triggers Picker#selection-cleared
 */
        var Picker = {
            init: function(options) {
                var _this = this;
                var opt = Object(__WEBPACK_IMPORTED_MODULE_3__jsutils_objectExtend__.a)({}, this.getFactory().defaults, options);
                var inst = {
                    opt: opt,
                    ready: null,
                    choices: null,
                    selected: null,
                    $noChoices: Object(__WEBPACK_IMPORTED_MODULE_2__jsutils_parseHTML__.a)('<div class="Picker-noChoices">' + opt.labels.noChoices + "</div>").firstChild
                };
                PRIVATE.set(this, inst);
                var popup = inst.popup = __WEBPACK_IMPORTED_MODULE_10__Popup_Popup__.b.create();
                var menu = inst.menu = __WEBPACK_IMPORTED_MODULE_11__Menu_Menu__.b.create();
                var $popupUI = popup.getEle();
                var $ui = this.$ui = Object(__WEBPACK_IMPORTED_MODULE_2__jsutils_parseHTML__.a)(Object(__WEBPACK_IMPORTED_MODULE_1__jsutils_fillTemplate__.a)(this.getTemplate(), opt)).firstChild;
                var uiFind = $ui.querySelector.bind($ui);
                var setPopupWidthOnShow = "full" === opt.popupWidth;
                opt.choices = opt.choices || [];
                inst.$title = uiFind(".Picker-title");
                this.setChoices(opt.choices);
                opt.selected && this.setSelected(opt.selected);
                opt.showClear || Object(__WEBPACK_IMPORTED_MODULE_8__domutils_domAddClass__.a)($ui, "Picker--noClear");
                // setup keyboard interaction
                var keyboardInteraction = inst.keyboardInteraction = __WEBPACK_IMPORTED_MODULE_6__domutils_DomKeyboardInteraction__.b.create({
                    input: inst.$title,
                    eleGroup: $popupUI,
                    eleSelector: "li",
                    focusClass: opt.focusClass
                });
                keyboardInteraction.on("keyEnter", function(ev) {
                    Object(__WEBPACK_IMPORTED_MODULE_9__domutils_domTriggerEvent__.a)(ev.focusElement, "click");
                });
                keyboardInteraction.on("keyEsc", function() {
                    popup.hide();
                });
                setPopupWidthOnShow || Object(__WEBPACK_IMPORTED_MODULE_7__domutils_domSetStyle__.a)($popupUI, {
                    width: opt.popupWidth
                });
                menu.on("item-click", function(item) {
                    _this.setSelected(item);
                    popup.hide();
                    /**
             * Items from the list of choices was selected
             *
             * @event Picker#item-selected
             * @type {Object}
             */
                    _this.emit("item-selected", item);
                });
                $popupUI.style.maxHeight = "20em";
                popup.attachTo($ui);
                $ui.addEventListener("click", function() {
                    setPopupWidthOnShow && !popup.isVisible() && Object(__WEBPACK_IMPORTED_MODULE_7__domutils_domSetStyle__.a)($popupUI, {
                        width: $ui.clientWidth + "px"
                    });
                    keyboardInteraction.resetFocus();
                    popup.toggle();
                });
                uiFind(".Picker-clear").addEventListener("click", function(ev) {
                    var current = inst.selected;
                    ev.stopPropagation();
                    _this.clearSelected();
                    /**
             * Selection was cleared from widget by user.
             *
             * @event Picker#selection-cleared
             *
             * @type {Object}
             */
                    _this.emit("selection-cleared", current);
                });
                this.onDestroy(function() {
                    menu.destroy();
                    menu = inst.menu = void 0;
                    popup.destroy();
                    popup = inst.popup = void 0;
                });
            },
            /**
     * Returns the widget's template
     * @returns {String}
     */
            getTemplate: function() {
                return __WEBPACK_IMPORTED_MODULE_12__Picker_html___default.a;
            },
            /**
     * Selects a specific list
     *
     * @param {String|Object} item
     *  The item will be compared against each of the choices until
     *  a match is found. Match could by by entire Choice (if object),
     *  or by looking at the choice `title` or `value` attributes.
     *
     */
            setSelected: function(item) {
                var inst = PRIVATE.get(this);
                item && inst.choices.some(function(choice) {
                    if (choice === item || choice.value === item || choice.title === item) {
                        inst.selected = choice;
                        inst.$title.textContent = choice.title;
                        return true;
                    }
                });
            },
            /**
     * Returns the selected list (an object as returned by `getSiteListCollection`.
     *
     * @returns {Object}
     */
            getSelected: function() {
                return PRIVATE.get(this).selected;
            },
            /**
     * Clears the current selection
     */
            clearSelected: function() {
                var inst = PRIVATE.get(this);
                inst.selected = null;
                inst.$title.textContent = inst.opt.labels.title;
            },
            /**
     * Sets the list of choices for the picker
     *
     * @param {Array<Object>} [choices]
     *  If not defined, it will clear out the menu of choices.
     *  Each choice (object) needs at least a `title` attribute, but if a `value`
     *  attribute is also defined, then that will be used as well by `setSelected`. If
     *  `onClick` attribute is defined, it will be called when user clicks on it.
     */
            setChoices: function(choices) {
                var inst = PRIVATE.get(this);
                inst.menu.setItems(choices);
                inst.choices = choices || [];
                inst.popup.setContent(inst.choices.length ? inst.menu : inst.$noChoices);
            },
            /**
     * Clears the choices in the Menu. Same as calling `setChoices` with no input
     */
            clearChoices: function() {
                this.clearSelected();
                this.setChoices();
            },
            /**
     * Returns the `Popup` widget used by this picker
     * @return {Popup}
     */
            getPopupWidget: function() {
                return PRIVATE.get(this).popup;
            }
        };
        Picker = __WEBPACK_IMPORTED_MODULE_5__jsutils_EventEmitter__.b.extend(__WEBPACK_IMPORTED_MODULE_0__jsutils_Widget__.b, Picker);
        Picker.defaults = {
            choices: null,
            selected: "",
            popupWidth: "full",
            showClear: true,
            focusClass: "my-menu-selected",
            labels: {
                title: "Select...",
                noChoices: "No choices available"
            }
        };
        /* harmony default export */
        __webpack_exports__.b = Picker;
    }, /* 39 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return Loader;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__jsutils_Widget__ = __webpack_require__(5);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__jsutils_parseHTML__ = __webpack_require__(4);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_2__Loader_less__ = __webpack_require__(85);
        /* harmony import */
        __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__Loader_less__);
        //==========================================================================
        /**
 * Loader Widget display an animated graphic indicating the UI is busy
 *
 * @class Loader
 * @extends Widget
 *
 * @param {Object} options
 */
        var Loader = __WEBPACK_IMPORTED_MODULE_0__jsutils_Widget__.b.extend(/** @lends Loader.prototype */ {
            init: function() {
                this.$ui = Object(__WEBPACK_IMPORTED_MODULE_1__jsutils_parseHTML__.a)(this.getTemplate()).firstChild;
            },
            /**
     * returns the widget's template
     * @return {String}
     */
            getTemplate: function() {
                return '<div class="Loader"><span class="Loader-img"></span></div>';
            }
        });
        /**
 * Global default options for Loader
 *
 * @name Loader.defaults
 * @type {Object}
 */
        Loader.defaults = {};
        /* harmony default export */
        __webpack_exports__.b = Loader;
    }, /* 40 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        Object.defineProperty(__webpack_exports__, "__esModule", {
            value: true
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__domutils_domAddClass__ = __webpack_require__(2);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "domAddClass", function() {
            return __WEBPACK_IMPORTED_MODULE_0__domutils_domAddClass__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__domutils_domAddEventListener__ = __webpack_require__(8);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "domAddEventListener", function() {
            return __WEBPACK_IMPORTED_MODULE_1__domutils_domAddEventListener__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_2__domutils_domChildren__ = __webpack_require__(15);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "domChildren", function() {
            return __WEBPACK_IMPORTED_MODULE_2__domutils_domChildren__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_3__domutils_domClosest__ = __webpack_require__(41);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "domClosest", function() {
            return __WEBPACK_IMPORTED_MODULE_3__domutils_domClosest__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_4__domutils_domFind__ = __webpack_require__(21);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "domFind", function() {
            return __WEBPACK_IMPORTED_MODULE_4__domutils_domFind__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_5__domutils_domHasClass__ = __webpack_require__(22);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "domHasClass", function() {
            return __WEBPACK_IMPORTED_MODULE_5__domutils_domHasClass__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_6__domutils_domIsVisible__ = __webpack_require__(42);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "domIsVisible", function() {
            return __WEBPACK_IMPORTED_MODULE_6__domutils_domIsVisible__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_7__domutils_DomKeyboardInteraction__ = __webpack_require__(23);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "DomKeyboardInteraction", function() {
            return __WEBPACK_IMPORTED_MODULE_7__domutils_DomKeyboardInteraction__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_8__domutils_domMatches__ = __webpack_require__(20);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "domMatches", function() {
            return __WEBPACK_IMPORTED_MODULE_8__domutils_domMatches__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_9__domutils_domOffset__ = __webpack_require__(43);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "domOffset", function() {
            return __WEBPACK_IMPORTED_MODULE_9__domutils_domOffset__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_10__domutils_domPosition__ = __webpack_require__(31);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "domPosition", function() {
            return __WEBPACK_IMPORTED_MODULE_10__domutils_domPosition__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_11__domutils_domPositionedParent__ = __webpack_require__(30);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "domPositionedParent", function() {
            return __WEBPACK_IMPORTED_MODULE_11__domutils_domPositionedParent__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_12__domutils_domRemoveClass__ = __webpack_require__(11);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "domRemoveClass", function() {
            return __WEBPACK_IMPORTED_MODULE_12__domutils_domRemoveClass__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_13__domutils_domSetStyle__ = __webpack_require__(32);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "domSetStyle", function() {
            return __WEBPACK_IMPORTED_MODULE_13__domutils_domSetStyle__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_14__domutils_domToggleClass__ = __webpack_require__(28);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "domToggleClass", function() {
            return __WEBPACK_IMPORTED_MODULE_14__domutils_domToggleClass__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_15__domutils_domTriggerEvent__ = __webpack_require__(33);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "domTriggerEvent", function() {
            return __WEBPACK_IMPORTED_MODULE_15__domutils_domTriggerEvent__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_16__domutils_fitEleToParent__ = __webpack_require__(44);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "fitToParent", function() {
            return __WEBPACK_IMPORTED_MODULE_16__domutils_fitEleToParent__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_17__domutils_onDomResize__ = __webpack_require__(45);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "onDomResize", function() {
            return __WEBPACK_IMPORTED_MODULE_17__domutils_onDomResize__.b;
        });
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "DomElementResizeMonitor", function() {
            return __WEBPACK_IMPORTED_MODULE_17__domutils_onDomResize__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_18__domutils_scrollEleIntoView__ = __webpack_require__(29);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "scrollEleIntoView", function() {
            return __WEBPACK_IMPORTED_MODULE_18__domutils_scrollEleIntoView__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_19__jsutils_arrayFindBy_js__ = __webpack_require__(46);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "arrayFindBy", function() {
            return __WEBPACK_IMPORTED_MODULE_19__jsutils_arrayFindBy_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_20__jsutils_base64_js__ = __webpack_require__(47);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "base64", function() {
            return __WEBPACK_IMPORTED_MODULE_20__jsutils_base64_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_21__jsutils_Component_js__ = __webpack_require__(34);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "Component", function() {
            return __WEBPACK_IMPORTED_MODULE_21__jsutils_Component_js__.a;
        });
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "registerCustomElementAs", function() {
            return __WEBPACK_IMPORTED_MODULE_21__jsutils_Component_js__.c;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_22__jsutils_Compose_js__ = __webpack_require__(16);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "getDestroyCallback", function() {
            return __WEBPACK_IMPORTED_MODULE_22__jsutils_Compose_js__.c;
        });
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "Compose", function() {
            return __WEBPACK_IMPORTED_MODULE_22__jsutils_Compose_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_23__jsutils_dataStore_js__ = __webpack_require__(0);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "dataStore", function() {
            return __WEBPACK_IMPORTED_MODULE_23__jsutils_dataStore_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_24__jsutils_Deferred_js__ = __webpack_require__(48);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "Deferred", function() {
            return __WEBPACK_IMPORTED_MODULE_24__jsutils_Deferred_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_25__jsutils_doWhen_js__ = __webpack_require__(52);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "doWhen", function() {
            return __WEBPACK_IMPORTED_MODULE_25__jsutils_doWhen_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_26__jsutils_es6_Map_js__ = __webpack_require__(53);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "Map", function() {
            return __WEBPACK_IMPORTED_MODULE_26__jsutils_es6_Map_js__.b;
        });
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "FakeMap", function() {
            return __WEBPACK_IMPORTED_MODULE_26__jsutils_es6_Map_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_27__jsutils_es6_promise_js__ = __webpack_require__(12);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "Promise", function() {
            return __WEBPACK_IMPORTED_MODULE_27__jsutils_es6_promise_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_28__jsutils_es6_Set_js__ = __webpack_require__(17);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "Set", function() {
            return __WEBPACK_IMPORTED_MODULE_28__jsutils_es6_Set_js__.b;
        });
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "FakeSet", function() {
            return __WEBPACK_IMPORTED_MODULE_28__jsutils_es6_Set_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_29__jsutils_es7_fetch_js__ = __webpack_require__(54);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "fetchPolyfill", function() {
            return __WEBPACK_IMPORTED_MODULE_29__jsutils_es7_fetch_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_30__jsutils_EventEmitter_js__ = __webpack_require__(3);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "EventEmitter", function() {
            return __WEBPACK_IMPORTED_MODULE_30__jsutils_EventEmitter_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_31__jsutils_fetchCheckForHttpErrors_js__ = __webpack_require__(55);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "fetchCheckForHttpErrors", function() {
            return __WEBPACK_IMPORTED_MODULE_31__jsutils_fetchCheckForHttpErrors_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_32__jsutils_fillTemplate_js__ = __webpack_require__(13);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "fillTemplate", function() {
            return __WEBPACK_IMPORTED_MODULE_32__jsutils_fillTemplate_js__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_33__jsutils_getGlobal_js__ = __webpack_require__(10);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "GLOBAL", function() {
            return __WEBPACK_IMPORTED_MODULE_33__jsutils_getGlobal_js__.a;
        });
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "getGlobal", function() {
            return __WEBPACK_IMPORTED_MODULE_33__jsutils_getGlobal_js__.c;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_34__jsutils_getObjectPropValue_js__ = __webpack_require__(18);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "getObjectPropValue", function() {
            return __WEBPACK_IMPORTED_MODULE_34__jsutils_getObjectPropValue_js__.b;
        });
        /* harmony import */
        __webpack_require__(35);
        /* empty harmony namespace reexport */
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_36__jsutils_nextTick_js__ = __webpack_require__(36);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "nextTick", function() {
            return __WEBPACK_IMPORTED_MODULE_36__jsutils_nextTick_js__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_37__jsutils_objectExtend_js__ = __webpack_require__(1);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "objectExtend", function() {
            return __WEBPACK_IMPORTED_MODULE_37__jsutils_objectExtend_js__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_38__jsutils_objectFill_js__ = __webpack_require__(56);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "objectFill", function() {
            return __WEBPACK_IMPORTED_MODULE_38__jsutils_objectFill_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_39__jsutils_objectPick_js__ = __webpack_require__(57);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "objectPick", function() {
            return __WEBPACK_IMPORTED_MODULE_39__jsutils_objectPick_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_40__jsutils_parseHTML_js__ = __webpack_require__(4);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "parseHTML", function() {
            return __WEBPACK_IMPORTED_MODULE_40__jsutils_parseHTML_js__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_41__jsutils_parseUrlParams_js__ = __webpack_require__(58);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "parseParams", function() {
            return __WEBPACK_IMPORTED_MODULE_41__jsutils_parseUrlParams_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_42__jsutils_parseXML_js__ = __webpack_require__(59);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "parseXML", function() {
            return __WEBPACK_IMPORTED_MODULE_42__jsutils_parseXML_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_43__jsutils_Promise_js__ = __webpack_require__(60);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "FakePromise", function() {
            return __WEBPACK_IMPORTED_MODULE_43__jsutils_Promise_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_44__jsutils_queueCallback_js__ = __webpack_require__(24);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "queueCallback", function() {
            return __WEBPACK_IMPORTED_MODULE_44__jsutils_queueCallback_js__.b;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_45__jsutils_runtime_aliases__ = __webpack_require__(9);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "functionBind", function() {
            return __WEBPACK_IMPORTED_MODULE_45__jsutils_runtime_aliases__.d;
        });
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "functionBindCall", function() {
            return __WEBPACK_IMPORTED_MODULE_45__jsutils_runtime_aliases__.e;
        });
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "objectDefineProperty", function() {
            return __WEBPACK_IMPORTED_MODULE_45__jsutils_runtime_aliases__.g;
        });
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "objectDefineProperties", function() {
            return __WEBPACK_IMPORTED_MODULE_45__jsutils_runtime_aliases__.f;
        });
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "objectKeys", function() {
            return __WEBPACK_IMPORTED_MODULE_45__jsutils_runtime_aliases__.h;
        });
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "arrayForEach", function() {
            return __WEBPACK_IMPORTED_MODULE_45__jsutils_runtime_aliases__.a;
        });
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "arrayIndexOf", function() {
            return __WEBPACK_IMPORTED_MODULE_45__jsutils_runtime_aliases__.b;
        });
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "arraySplice", function() {
            return __WEBPACK_IMPORTED_MODULE_45__jsutils_runtime_aliases__.c;
        });
        /* harmony import */
        __webpack_require__(25);
        /* empty harmony namespace reexport */
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_47__jsutils_sortBy_js__ = __webpack_require__(61);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "sortBy", function() {
            return __WEBPACK_IMPORTED_MODULE_47__jsutils_sortBy_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_48__jsutils_toUrlParams_js__ = __webpack_require__(62);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "toUrlParams", function() {
            return __WEBPACK_IMPORTED_MODULE_48__jsutils_toUrlParams_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_49__jsutils_uuid_js__ = __webpack_require__(63);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "uuid", function() {
            return __WEBPACK_IMPORTED_MODULE_49__jsutils_uuid_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_50__jsutils_Widget_js__ = __webpack_require__(5);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "Widget", function() {
            return __WEBPACK_IMPORTED_MODULE_50__jsutils_Widget_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_51__jsutils_xmlEscape_js__ = __webpack_require__(67);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "xmlEscape", function() {
            return __WEBPACK_IMPORTED_MODULE_51__jsutils_xmlEscape_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_52__widgets_utils_getVueComponentFromWidget_js__ = __webpack_require__(68);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "getVueComponentFromWidget", function() {
            return __WEBPACK_IMPORTED_MODULE_52__widgets_utils_getVueComponentFromWidget_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_53__widgets_utils_getCustomElementFromWidget_js__ = __webpack_require__(14);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "getCustomElementFromWidget", function() {
            return __WEBPACK_IMPORTED_MODULE_53__widgets_utils_getCustomElementFromWidget_js__.b;
        });
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "getWidgetOptionsFromComponent", function() {
            return __WEBPACK_IMPORTED_MODULE_53__widgets_utils_getCustomElementFromWidget_js__.c;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_54__widgets_UIBlock_UIBlock_js__ = __webpack_require__(69);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "UIBlock", function() {
            return __WEBPACK_IMPORTED_MODULE_54__widgets_UIBlock_UIBlock_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_55__widgets_Popup_Popup_js__ = __webpack_require__(37);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "Popup", function() {
            return __WEBPACK_IMPORTED_MODULE_55__widgets_Popup_Popup_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_56__widgets_Picker_Picker_js__ = __webpack_require__(38);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "Picker", function() {
            return __WEBPACK_IMPORTED_MODULE_56__widgets_Picker_Picker_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_57__widgets_Picker_PickerCE_js__ = __webpack_require__(83);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "PickerCE", function() {
            return __WEBPACK_IMPORTED_MODULE_57__widgets_Picker_PickerCE_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_58__widgets_Menu_Menu_js__ = __webpack_require__(19);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "Menu", function() {
            return __WEBPACK_IMPORTED_MODULE_58__widgets_Menu_Menu_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_59__widgets_Menu_MenuCE_js__ = __webpack_require__(84);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "MenuCE", function() {
            return __WEBPACK_IMPORTED_MODULE_59__widgets_Menu_MenuCE_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_60__widgets_Loader_Loader_js__ = __webpack_require__(39);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "Loader", function() {
            return __WEBPACK_IMPORTED_MODULE_60__widgets_Loader_Loader_js__.a;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_61__widgets_Loader_LoaderCE_js__ = __webpack_require__(88);
        /* harmony namespace reexport (by provided) */
        __webpack_require__.d(__webpack_exports__, "LoaderCE", function() {
            return __WEBPACK_IMPORTED_MODULE_61__widgets_Loader_LoaderCE_js__.a;
        });
    }, /* 41 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.a = domClosest;
        var body = document.body;
        var matches = body.matches || body.matchesSelector || body.msMatchesSelector || body.mozMatchesSelector || body.webkitMatchesSelector || body.oMatchesSelector;
        /**
 * Finds the closest DOM element to another by walking up its ancestors.
 *
 * @function domClosest
 *
 * @param {HTMLElement} ele
 * @param {String} selector
 *
 * @return {HTMLElement|undefined}
 */
        function domClosest(ele, selector) {
            var parent = ele;
            var response;
            for (;!response && parent && "HTML" !== parent.nodeName.toUpperCase(); ) matches.call(parent, selector) ? response = parent : parent = parent.parentElement;
            return response;
        }
    }, /* 42 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.a = domIsVisible;
        /**
 * Checks if a given HTML Element is visible
 *
 * @function domIsVisible
 *
 * @param {HTMLElement} el
 *
 * @return {Boolean}
 */
        function domIsVisible(el) {
            return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
        }
    }, /* 43 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.a = domOffset;
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__domPositionedParent__ = __webpack_require__(30);
        /**
 * Get an element's position (`top`, `left`) relative to document that it
 * is displayed in. This method take into consideration any scrolling the
 * document may currently have, so that the return value is always consistent
 * as if the document was not scrolled at all.
 *
 * @param {HTMLElement} ele
 *
 * @param {Boolean} [fromOffsetParent=false]
 *  If true, then the `left`/`top` values of `ele` will be calculated against
 *  its positioned parent element - which might not be the viewport.
 *
 * @returns {{top: number, left: number}}
 */
        function domOffset(ele, fromOffsetParent) {
            // some of this was borrowed from jQuery.
            if (!ele) return {
                top: 0,
                left: 0
            };
            // If element is not attached or is the window or document, then exit
            if (!ele.getClientRects || !ele.getClientRects().length) return {
                top: 0,
                left: 0
            };
            var eleRect = ele.getBoundingClientRect();
            var eleOwnerDoc = ele.ownerDocument;
            var eleOwnerDocEle = eleOwnerDoc.documentElement;
            var response = {
                top: eleRect.top,
                left: eleRect.left
            };
            if (fromOffsetParent) {
                var elePositionedParent = Object(__WEBPACK_IMPORTED_MODULE_0__domPositionedParent__.a)(ele);
                if (elePositionedParent !== eleOwnerDocEle) {
                    var eleParentOffset = domOffset(elePositionedParent);
                    response.top = response.top - eleParentOffset.top;
                    // eleParentOffset.scrollTop - eleParentOffset.clientTop;
                    response.left = response.left - eleParentOffset.left;
                    // eleParentOffset.scrollLeft - eleParentOffset.clientLeft;
                    return response;
                }
            }
            var eleOwnerDocWin = eleOwnerDoc.defaultView;
            response.top += eleOwnerDocWin.pageYOffset - eleOwnerDocEle.clientTop;
            response.left += eleOwnerDocWin.pageXOffset - eleOwnerDocEle.clientLeft;
            return response;
        }
    }, /* 44 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.a = fitToParent;
        /**
 * Applies a fixed height to an element based on its parent. This utility can help
 * with cases where we want a scrolling element to fill the height of a parent
 * element.
 *
 * @function fitToParent
 *
 * @param {HTMLElement} ele
 *  The element whose parent will be used in the calculation of the height
 *
 * @param {Number} [offset]
 *  The additional Offset to be used in calculating the height. Could be
 *  a negative number.
 *
 * @param {HTMLElement} [$adjustEle]
 *  The Element that will have the height applied to. Defaults to the
 *  `options.ele` input param value.  Example: set this if wanting to
 *  make an element inside of the `options.ele` to receive the fixed height
 *
 */
        function fitToParent(ele, offset, $adjustEle) {
            if ($adjustEle && !$adjustEle.parentElement) return;
            var $ui = ele, $scrollEle = $adjustEle || $ui, $parent = $ui.parentElement, parentComputedStyle = window.getComputedStyle($parent, null);
            "number" !== typeof offset && (offset = 0);
            // Add the parent element's padding into the offset
            offset += [ "padding-top", "padding-bottom" ].reduce(function(pxCount, cssProperty) {
                return pxCount += Number(parentComputedStyle.getPropertyValue(cssProperty).replace(/[a-zA-Z%]/g, ""));
            }, 0);
            $scrollEle.style.height = $parent.clientHeight - ($ui.offsetHeight - $scrollEle.offsetHeight + offset) + "px";
        }
    }, /* 45 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.b = onDomResize;
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return DomElementResizeMonitor;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__jsutils_EventEmitter__ = __webpack_require__(3);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__domAddEventListener__ = __webpack_require__(8);
        //===============================================================
        var PRIVATE = new WeakMap();
        var userAgent = window.navigator.userAgent;
        var IS_IE = -1 !== userAgent.indexOf("MSIE ") || -1 !== userAgent.indexOf("Trident/");
        var FUNCTION_CALL_BIND = Function.call.bind.bind(Function.call);
        var DOCUMENT = document;
        var createElement = DOCUMENT.createElement.bind(DOCUMENT);
        var setAttribute = FUNCTION_CALL_BIND(Element.prototype.setAttribute);
        var appendChild = FUNCTION_CALL_BIND(Node.prototype.appendChild);
        var EV_RESIZE = "resize";
        var IS_POSITIONED = /fixed|relative|absolute/i;
        var STYLE_BASE = "position: absolute; top: 0; left: 0; z-index: -5; width: 100%; height: 100%; display: block; pointer-events: none; overflow: hidden;";
        /**
 * Execute a callback function every time a given element is resized. Note that the
 * element whose size is to be monitered must be `positioned` in the DOM Flow. If
 * it is not (ex. does not have a css `position` value of `fixed`, `relative` or
 * `absolute`, the element's style `position` property will be set to `relative`.
 *
 * @param {HTMLElement} ele
 * @param {Function} callback
 * @param {String} [event="resize"]
 *
 * @returns {EventEmitter~EventListener}
 */
        function onDomResize(ele, callback) {
            var event = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : EV_RESIZE;
            if (ele && callback) return getEleMonitor(ele).on(event, callback);
        }
        /**
 * Returns an EventListener for the given DOM Element
 *
 * @return {EventListener}
 */
        function getEleMonitor(ele) {
            var eleMonitor = void 0;
            if (PRIVATE.has(ele)) {
                eleMonitor = PRIVATE.get(ele);
                eleMonitor.attach(ele);
                return eleMonitor;
            }
            eleMonitor = DomElementResizeMonitor.create();
            PRIVATE.set(ele, eleMonitor);
            eleMonitor.attach(ele);
            return eleMonitor;
        }
        /**
 * Creates a shadow element that keeps track of its parent's size and emits events when
 * those measurements change
 *
 * @class DomElementResizeMonitor
 * @extends EventEmitter
 */
        var DomElementResizeMonitor = __WEBPACK_IMPORTED_MODULE_0__jsutils_EventEmitter__.b.extend(/** @lends DomElementResizeMonitor.prototype */ {
            init: function() {
                var _this = this;
                var inst = {
                    parentPosition: ""
                };
                var shadowEle = inst.shadowEle = createElement("div");
                var objectEle = createElement("object");
                PRIVATE.set(this, inst);
                // Setup the Div container for the monitor
                setAttribute(shadowEle, "class", "DomElementResizeMonitor");
                setAttribute(shadowEle, "tabindex", "-1");
                setAttribute(shadowEle, "style", STYLE_BASE + " border: none; background-color: transparent; opacity: 0;");
                // Setup the <Object> element from where the actual DOM event are fired
                // Approach borrowed from:
                // https://github.com/Akryum/vue-resize/blob/master/src/components/ResizeObserver.vue
                setAttribute(objectEle, "style", STYLE_BASE);
                objectEle.onload = function() {
                    inst.objResizeEv = Object(__WEBPACK_IMPORTED_MODULE_1__domAddEventListener__.a)(objectEle.contentDocument.defaultView, "resize", function() {
                        return _this.emit(EV_RESIZE);
                    });
                };
                objectEle.type = "text/html";
                if (IS_IE) {
                    // IE needs to have the object attached to DOM before setting the data.
                    // If the parent element itself is not attached to DOM the object is not initialzed.
                    // To ensure the object is initialized correctly, we add it first to the
                    // document.body and then set its data.
                    appendChild(document.body, objectEle);
                    objectEle.data = "about:blank";
                } else objectEle.data = "about:blank";
                appendChild(shadowEle, objectEle);
                this.onDestroy(this.getFactory().getDestroyCallback(inst, PRIVATE));
            },
            /**
     * Attach monitor shadow element to the given element and start emitting events.
     *
     * @param {HTMLElement} htmlEle
     */
            attach: function(htmlEle) {
                if (htmlEle) {
                    var inst = PRIVATE.get(this);
                    var shadowEle = inst.shadowEle;
                    if (shadowEle.parentNode !== htmlEle) {
                        inst.parentPosition = htmlEle.style.position;
                        appendChild(htmlEle, shadowEle);
                        IS_POSITIONED.test(window.getComputedStyle(htmlEle).getPropertyValue("position")) || (htmlEle.style.position = "relative");
                    }
                }
            },
            /**
     * Detach monitor from the parent element
     */
            detach: function() {
                var inst = PRIVATE.get(this);
                var shadowEle = inst.shadowEle, parentPosition = inst.parentPosition;
                if (shadowEle) {
                    var parentNode = shadowEle.parentNode;
                    if (parentNode) {
                        parentNode.removeChild(shadowEle);
                        parentNode.style.position = parentPosition;
                        inst.parentPosition = "";
                    }
                }
            }
        });
    }, /* 46 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.a = arrayFindBy;
        /**
 * Finds an element in the array by executing an iterator callback. Can
 * return either the found element (default) or its index.
 *
 * @param {Array} arr
 * @param {Function|Object} iterator
 * @param {Boolean} [returnIndex]
 * @returns {*}
 */
        function arrayFindBy(arr, iterator, returnIndex) {
            var response = void 0;
            returnIndex && (response = -1);
            arr.some(function(arrayItem, index) {
                if (iterator(arrayItem, index)) {
                    response = returnIndex ? index : arrayItem;
                    return true;
                }
            });
            return response;
        }
    }, /* 47 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return base64;
        });
        /*
    Code below was taken from:
    https://github.com/dankogai/js-base64
    and stripped down to only the encode/decode methods.

    Copyright (c) 2014, Dan Kogai All rights reserved.
    Licensed under the BSD 3-Clause License.
        http://opensource.org/licenses/BSD-3-Clause
*/
        /* jshint ignore:start */
        var global = window;
        var fromCharCode = String.fromCharCode;
        // encoder stuff
        var cb_utob = function(c) {
            if (c.length < 2) {
                var cc = c.charCodeAt(0);
                return cc < 128 ? c : cc < 2048 ? fromCharCode(192 | cc >>> 6) + fromCharCode(128 | 63 & cc) : fromCharCode(224 | cc >>> 12 & 15) + fromCharCode(128 | cc >>> 6 & 63) + fromCharCode(128 | 63 & cc);
            }
            var cc = 65536 + 1024 * (c.charCodeAt(0) - 55296) + (c.charCodeAt(1) - 56320);
            return fromCharCode(240 | cc >>> 18 & 7) + fromCharCode(128 | cc >>> 12 & 63) + fromCharCode(128 | cc >>> 6 & 63) + fromCharCode(128 | 63 & cc);
        };
        var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
        var utob = function(u) {
            return u.replace(re_utob, cb_utob);
        };
        var btoa = function(b) {
            return global.btoa(b);
        };
        var _encode = function(u) {
            return btoa(utob(u));
        };
        var encode = function(u, urisafe) {
            return urisafe ? _encode(String(u)).replace(/[+\/]/g, function(m0) {
                return "+" == m0 ? "-" : "_";
            }).replace(/=/g, "") : _encode(String(u));
        };
        // decoder stuff
        var re_btou = new RegExp([ "[À-ß][-¿]", "[à-ï][-¿]{2}", "[ð-÷][-¿]{3}" ].join("|"), "g");
        var cb_btou = function(cccc) {
            switch (cccc.length) {
              case 4:
                var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536;
                return fromCharCode(55296 + (offset >>> 10)) + fromCharCode(56320 + (1023 & offset));

              case 3:
                return fromCharCode((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));

              default:
                return fromCharCode((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
            }
        };
        var btou = function(b) {
            return b.replace(re_btou, cb_btou);
        };
        var atob = function(a) {
            return global.atob(a);
        };
        var _decode = function(a) {
            return btou(atob(a));
        };
        var decode = function(a) {
            return _decode(String(a).replace(/[-_]/g, function(m0) {
                return "-" == m0 ? "+" : "/";
            }).replace(/[^A-Za-z0-9\+\/]/g, ""));
        };
        var /**
 * Base64 helper utilities
 *
 * @namespace base64
 */
        base64 = /** @lends base64 */ {
            /**
     * Encodes a String to Base64 using btoa, but also ensure that if the string
     * has non-Latin values, that those are properly handled (converted to utf-8).
     *
     * @param {String} stringValue
     *
     * @return {String}
     */
            encode: encode,
            /**
     * Encodes a String to Base64 using btoa, but also ensure that if the string
     * has non-Latin values, that those are properly handled (converted to utf-8).
     *
     * @param {String} stringValue
     *
     * @return {String}
     */
            decode: decode,
            /**
     * reference to global `btoa` method
     */
            btoa: btoa,
            /**
     * Reference to global `atob` method
     */
            atob: atob
        };
    }, /* 48 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return Deferred;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__es6_promise__ = __webpack_require__(12);
        var Deferred = Object.create({
            /**
     * Creates a `Deferred` object which is essentially an un-resolved promise
     * that, in addition to the normal Promise interface, also exposes a `resolve`
     * and `reject` method - thus allowing control over the promise from the "outside".
     *
     * @return {DeferredPromise}
     *
     * @example
     *
     * let dfd = Deferred.create();
     * addToQueue(dfd);
     * return dfd.promise;
     *
     * //... later
     * queue[0].resolve({msg: "done"});
     */
            create: function() {
                var resolvedDeferred = void 0;
                var rejectDeferred = void 0;
                /**
         * A Deferred object. A promise that exposes 3 additional attributes
         *
         * @typedef {Promise} DeferredPromise
         *
         * @property {Function} then
         * @property {Promise} promise
         * @property {Function} resolve
         * @property {Function} reject
         */
                var deferred = new __WEBPACK_IMPORTED_MODULE_0__es6_promise__.b(function(resolve, reject) {
                    resolvedDeferred = resolve;
                    rejectDeferred = reject;
                });
                deferred.promise = deferred;
                deferred.resolve = resolvedDeferred;
                deferred.reject = rejectDeferred;
                return deferred;
            }
        });
    }, /* 49 */
    /***/
    function(module, exports) {
        // shim for using process in browser
        var process = module.exports = {};
        // cached from whatever global is present so that test runners that stub it
        // don't break things.  But we need to wrap it in a try catch in case it is
        // wrapped in strict mode code which doesn't define any globals.  It's inside a
        // function because try/catches deoptimize in certain engines.
        var cachedSetTimeout;
        var cachedClearTimeout;
        function defaultSetTimout() {
            throw new Error("setTimeout has not been defined");
        }
        function defaultClearTimeout() {
            throw new Error("clearTimeout has not been defined");
        }
        !function() {
            try {
                cachedSetTimeout = "function" === typeof setTimeout ? setTimeout : defaultSetTimout;
            } catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                cachedClearTimeout = "function" === typeof clearTimeout ? clearTimeout : defaultClearTimeout;
            } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        }();
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) //normal enviroments in sane situations
            return setTimeout(fun, 0);
            // if setTimeout wasn't available but was latter defined
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                cachedSetTimeout = setTimeout;
                return setTimeout(fun, 0);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }
        }
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) //normal enviroments in sane situations
            return clearTimeout(marker);
            // if clearTimeout wasn't available but was latter defined
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                cachedClearTimeout = clearTimeout;
                return clearTimeout(marker);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                    // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                    return cachedClearTimeout.call(this, marker);
                }
            }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;
        function cleanUpNextTick() {
            if (!draining || !currentQueue) return;
            draining = false;
            currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1;
            queue.length && drainQueue();
        }
        function drainQueue() {
            if (draining) return;
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;
            var len = queue.length;
            for (;len; ) {
                currentQueue = queue;
                queue = [];
                for (;++queueIndex < len; ) currentQueue && currentQueue[queueIndex].run();
                queueIndex = -1;
                len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
        }
        process.nextTick = function(fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
            queue.push(new Item(fun, args));
            1 !== queue.length || draining || runTimeout(drainQueue);
        };
        // v8 likes predictible objects
        function Item(fun, array) {
            this.fun = fun;
            this.array = array;
        }
        Item.prototype.run = function() {
            this.fun.apply(null, this.array);
        };
        process.title = "browser";
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = "";
        // empty string to avoid regexp issues
        process.versions = {};
        function noop() {}
        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;
        process.listeners = function(name) {
            return [];
        };
        process.binding = function(name) {
            throw new Error("process.binding is not supported");
        };
        process.cwd = function() {
            return "/";
        };
        process.chdir = function(dir) {
            throw new Error("process.chdir is not supported");
        };
        process.umask = function() {
            return 0;
        };
    }, /* 50 */
    /***/
    function(module, exports) {
        module.exports = function(originalModule) {
            if (!originalModule.webpackPolyfill) {
                var module = Object.create(originalModule);
                // module.parent = undefined by default
                module.children || (module.children = []);
                Object.defineProperty(module, "loaded", {
                    enumerable: true,
                    get: function() {
                        return module.l;
                    }
                });
                Object.defineProperty(module, "id", {
                    enumerable: true,
                    get: function() {
                        return module.i;
                    }
                });
                Object.defineProperty(module, "exports", {
                    enumerable: true
                });
                module.webpackPolyfill = 1;
            }
            return module;
        };
    }, /* 51 */
    /***/
    function(module, exports) {
        /* WEBPACK VAR INJECTION */
        (function(__webpack_amd_options__) {
            /* globals __webpack_amd_options__ */
            module.exports = __webpack_amd_options__;
        }).call(exports, {});
    }, /* 52 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.a = doWhen;
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__es6_promise__ = __webpack_require__(12);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__objectExtend__ = __webpack_require__(1);
        /**
 * Delays the execution of a function until an expression
 * returns true. The expression is checked every 100 milliseconds
 * for as many tries as defined in in the attempts option
 *
 * @param {Object} options
 *
 * @param {Function} options.when
 *  Function to execute on every interval. Must return true (boolean) in order for
 *  options.do to be executed.
 *
 * @param {Function} [options.exec]
 *  Function to be executed once options.when() returns true.
 *
 * @param {Number} [options.interval=100]
 *  How long to wait in-between tries.
 *
 * @param {Number} [options.attempts=100]
 *  How many tries to use before its considered a failure.
 *
 * @param {Number} [options.delayed=0]
 *  Number of miliseconds to wait before execution is started. Default is imediately.
 *
 * @return {Promise}
 *  The returned promise will have one additional property - a method called `abort()`
 *  which can be called to cancel the execution if not already completed. Calling
 *  `abort` will cause the Promise to be `reject`ed if it has not yet been resolved
 *
 * @example
 *
 *      var future = doWhen({
 *          when: function(){
 *              return false;
 *          },
 *          exec: function(){
 *              alert("never called given false response on when param!");
 *          }
 *      })
 *      .catch(function(){
 *          alert('ALERT: FAILED CONDITION');
 *      })
 *      .then(function(){
 *          alert("resolved.");
 *      });
 *
 *      // later...
 *      future.abort();
 *
 */
        function doWhen(options) {
            var abort = void 0;
            var promise = new __WEBPACK_IMPORTED_MODULE_0__es6_promise__.b(function(resolve, reject) {
                var opt = Object(__WEBPACK_IMPORTED_MODULE_1__objectExtend__.a)({}, {
                    when: function() {},
                    exec: function() {},
                    interval: 100,
                    attempts: 100,
                    delayed: 0
                }, options);
                var checkId = null;
                var stopChecking = function() {
                    if (checkId) {
                        clearInterval(checkId);
                        checkId = null;
                    }
                    opt.attempts = 0;
                };
                var startChecking = function() {
                    // Check condition now and if true, then resolve object
                    if (true === opt.when()) {
                        opt.exec();
                        resolve();
                        return;
                    }
                    // Start checking
                    checkId = setInterval(function() {
                        if (0 === opt.attempts) {
                            stopChecking();
                            reject(new Error("Timeout"));
                        } else {
                            --opt.attempts;
                            if (true === opt.when()) {
                                stopChecking();
                                opt.exec();
                                resolve();
                            }
                        }
                    }, opt.interval);
                };
                opt.delayed > 0 ? setTimeout(startChecking, Number(opt.delayed)) : startChecking();
                abort = function() {
                    if (checkId) {
                        stopChecking();
                        reject(new Error("Aborted"));
                    }
                };
            });
            promise.abort = abort;
            return promise;
        }
    }, /* 53 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__Map__ = __webpack_require__(35);
        /* harmony reexport (binding) */
        __webpack_require__.d(__webpack_exports__, "b", function() {
            return __WEBPACK_IMPORTED_MODULE_0__Map__.b;
        });
        /* harmony reexport (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return __WEBPACK_IMPORTED_MODULE_0__Map__.a;
        });
    }, /* 54 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return fetchPolyfill;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__es6_promise__ = __webpack_require__(12);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__EventEmitter__ = __webpack_require__(3);
        /* jshint ignore:start */
        var globalEvents = __WEBPACK_IMPORTED_MODULE_1__EventEmitter__.b.create();
        /**
 * A polyfill for the proposed ECMAScript `fetch` API and associated classes.
 * Provides a lowlevel interface for retrieving data from a server.
 *
 * Members of this namespace:
 *
 *  -   `fetchPolyfill.Headers`
 *  -   `fetchPolyfill.Request`
 *  -   `fetchPolyfill.Response`
 *  -   `fetchPolyfill.fetch`
 *  -   `fetchPolyfill.on`: Event emitter to listen for events
 *
 * @namespace fetchPolyfill
 *
 * @see https://github.com/purtuga/fetch
 * @see https://github.com/github/fetch
 *
 * @fires fetchPolyfill#pre-fetch
 * @fires fetchPolyfill#post-fetch
 *
 * @example
 *
 * define(["es7-fetch"], function(fetchPolyfill){
 *
 *     var fetch = fetchPolyfill.fetch;
 *
 *     fetch("api/end/point", {
 *         method:     "POST",
 *         onProgress: opt.onProgress,
 *         headers: {
 *             'Content-Type': 'text/xml;charset=UTF-8',
 *             'SOAPAction':   'http://schemas.microsoft.com/sharepoint/soap/CopyIntoItems'
 *         },
 *         body: '<?xml version="1.0" encoding="utf-8"?>' +
 *         '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
 *         '<soap:Body><CopyIntoItems xmlns="http://schemas.microsoft.com/sharepoint"> + ' +
 *         '<someContent></someContent>' +
 *         '</soap:Body></soap:Envelope>'
 *     }).then(function(response){
 *         return response.text().then(function(xmlData){
 *             ...
 *         });
 *     });
 *
 * });
 */
        // FIXME: PT: not good... overriding native implementation if it exists
        var fetchPolyfill = function fetchPolyfill(self) {
            self = self || Function("return this")();
            // jshint ignore:line
            [ "Headers", "Request", "Response", "fetch" ].forEach(function(prop) {
                self[prop] = fetchPolyfill[prop];
            });
        };
        !function(self) {
            if (self.fetch) return;
            function normalizeName(name) {
                "string" !== typeof name && (name = String(name));
                if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) throw new TypeError("Invalid character in header field name");
                return name.toLowerCase();
            }
            function normalizeValue(value) {
                "string" !== typeof value && (value = String(value));
                return value;
            }
            function Headers(headers) {
                this.map = {};
                headers instanceof Headers ? headers.forEach(function(value, name) {
                    this.append(name, value);
                }, this) : headers && Object.getOwnPropertyNames(headers).forEach(function(name) {
                    this.append(name, headers[name]);
                }, this);
            }
            Headers.prototype.append = function(name, value) {
                name = normalizeName(name);
                value = normalizeValue(value);
                var list = this.map[name];
                if (!list) {
                    list = [];
                    this.map[name] = list;
                }
                list.push(value);
            };
            Headers.prototype.delete = function(name) {
                delete this.map[normalizeName(name)];
            };
            Headers.prototype.get = function(name) {
                var values = this.map[normalizeName(name)];
                return values ? values[0] : null;
            };
            Headers.prototype.getAll = function(name) {
                return this.map[normalizeName(name)] || [];
            };
            Headers.prototype.has = function(name) {
                return this.map.hasOwnProperty(normalizeName(name));
            };
            Headers.prototype.set = function(name, value) {
                this.map[normalizeName(name)] = [ normalizeValue(value) ];
            };
            Headers.prototype.forEach = function(callback, thisArg) {
                Object.getOwnPropertyNames(this.map).forEach(function(name) {
                    this.map[name].forEach(function(value) {
                        callback.call(thisArg, value, name, this);
                    }, this);
                }, this);
            };
            function consumed(body) {
                if (body.bodyUsed) return __WEBPACK_IMPORTED_MODULE_0__es6_promise__.b.reject(new TypeError("Already read"));
                body.bodyUsed = true;
            }
            function fileReaderReady(reader) {
                return new __WEBPACK_IMPORTED_MODULE_0__es6_promise__.b(function(resolve, reject) {
                    reader.onload = function() {
                        resolve(reader.result);
                    };
                    reader.onerror = function() {
                        reject(reader.error);
                    };
                });
            }
            function readBlobAsArrayBuffer(blob) {
                var reader = new FileReader();
                reader.readAsArrayBuffer(blob);
                return fileReaderReady(reader);
            }
            function readBlobAsText(blob) {
                var reader = new FileReader();
                reader.readAsText(blob);
                return fileReaderReady(reader);
            }
            var support = {
                blob: "FileReader" in self && "Blob" in self && function() {
                    try {
                        new Blob();
                        return true;
                    } catch (e) {
                        return false;
                    }
                }(),
                formData: "FormData" in self,
                arrayBuffer: "ArrayBuffer" in self
            };
            function Body() {
                this.bodyUsed = false;
                this._initBody = function(body) {
                    this._bodyInit = body;
                    if ("string" === typeof body) this._bodyText = body; else if (support.blob && Blob.prototype.isPrototypeOf(body)) this._bodyBlob = body; else if (support.formData && FormData.prototype.isPrototypeOf(body)) this._bodyFormData = body; else if (body) {
                        if (!support.arrayBuffer || !ArrayBuffer.prototype.isPrototypeOf(body)) throw new Error("unsupported BodyInit type");
                    } else this._bodyText = "";
                    this.headers.get("content-type") || ("string" === typeof body ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type && this.headers.set("content-type", this._bodyBlob.type));
                };
                if (support.blob) {
                    this.blob = function() {
                        var rejected = consumed(this);
                        if (rejected) return rejected;
                        if (this._bodyBlob) return __WEBPACK_IMPORTED_MODULE_0__es6_promise__.b.resolve(this._bodyBlob);
                        if (this._bodyFormData) throw new Error("could not read FormData body as blob");
                        return __WEBPACK_IMPORTED_MODULE_0__es6_promise__.b.resolve(new Blob([ this._bodyText ]));
                    };
                    this.arrayBuffer = function() {
                        return this.blob().then(readBlobAsArrayBuffer);
                    };
                    this.text = function() {
                        var rejected = consumed(this);
                        if (rejected) return rejected;
                        if (this._bodyBlob) return readBlobAsText(this._bodyBlob);
                        if (this._bodyFormData) throw new Error("could not read FormData body as text");
                        return __WEBPACK_IMPORTED_MODULE_0__es6_promise__.b.resolve(this._bodyText);
                    };
                } else this.text = function() {
                    var rejected = consumed(this);
                    return rejected || __WEBPACK_IMPORTED_MODULE_0__es6_promise__.b.resolve(this._bodyText);
                };
                support.formData && (this.formData = function() {
                    return this.text().then(decode);
                });
                this.json = function() {
                    return this.text().then(JSON.parse);
                };
                return this;
            }
            // HTTP methods whose capitalization should be normalized
            var methods = [ "DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT" ];
            function normalizeMethod(method) {
                var upcased = method.toUpperCase();
                return methods.indexOf(upcased) > -1 ? upcased : method;
            }
            function Request(input, options) {
                options = options || {};
                var body = options.body;
                if (Request.prototype.isPrototypeOf(input)) {
                    if (input.bodyUsed) throw new TypeError("Already read");
                    this.url = input.url;
                    this.credentials = input.credentials;
                    options.headers || (this.headers = new Headers(input.headers));
                    this.method = input.method;
                    this.mode = input.mode;
                    if (!body) {
                        body = input._bodyInit;
                        input.bodyUsed = true;
                    }
                } else this.url = input;
                this.credentials = options.credentials || this.credentials || "omit";
                !options.headers && this.headers || (this.headers = new Headers(options.headers));
                this.method = normalizeMethod(options.method || this.method || "GET");
                this.mode = options.mode || this.mode || null;
                this.referrer = null;
                if (("GET" === this.method || "HEAD" === this.method) && body) throw new TypeError("Body not allowed for GET or HEAD requests");
                this._initBody(body);
            }
            Request.prototype.clone = function() {
                return new Request(this);
            };
            function decode(body) {
                var form = new FormData();
                body.trim().split("&").forEach(function(bytes) {
                    if (bytes) {
                        var split = bytes.split("=");
                        var name = split.shift().replace(/\+/g, " ");
                        var value = split.join("=").replace(/\+/g, " ");
                        form.append(decodeURIComponent(name), decodeURIComponent(value));
                    }
                });
                return form;
            }
            function headers(xhr) {
                var head = new Headers();
                var pairs = xhr.getAllResponseHeaders().trim().split("\n");
                pairs.forEach(function(header) {
                    var split = header.trim().split(":");
                    var key = split.shift().trim();
                    var value = split.join(":").trim();
                    head.append(key, value);
                });
                return head;
            }
            Body.call(Request.prototype);
            function Response(bodyInit, options) {
                options || (options = {});
                this.type = "default";
                this.status = options.status;
                this.ok = this.status >= 200 && this.status < 300;
                this.statusText = options.statusText;
                this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
                this.url = options.url || "";
                this._initBody(bodyInit);
            }
            Body.call(Response.prototype);
            Response.prototype.clone = function() {
                return new Response(this._bodyInit, {
                    status: this.status,
                    statusText: this.statusText,
                    headers: new Headers(this.headers),
                    url: this.url
                });
            };
            Response.error = function() {
                var response = new Response(null, {
                    status: 0,
                    statusText: ""
                });
                response.type = "error";
                return response;
            };
            var redirectStatuses = [ 301, 302, 303, 307, 308 ];
            Response.redirect = function(url, status) {
                if (-1 === redirectStatuses.indexOf(status)) throw new RangeError("Invalid status code");
                return new Response(null, {
                    status: status,
                    headers: {
                        location: url
                    }
                });
            };
            self.Headers = Headers;
            self.Request = Request;
            self.Response = Response;
            self.fetch = function(input, init) {
                var xhr = new XMLHttpRequest();
                var reqPromise = new __WEBPACK_IMPORTED_MODULE_0__es6_promise__.b(function(resolve, reject) {
                    var request;
                    request = Request.prototype.isPrototypeOf(input) && !init ? input : new Request(input, init);
                    // var xhr = new XMLHttpRequest()
                    function responseURL() {
                        if ("responseURL" in xhr) return xhr.responseURL;
                        // Avoid security warnings on getResponseHeader when not allowed by CORS
                        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) return xhr.getResponseHeader("X-Request-URL");
                        return;
                    }
                    xhr.onload = function() {
                        var options = {
                            status: xhr.status,
                            statusText: xhr.statusText,
                            headers: headers(xhr),
                            url: responseURL()
                        };
                        var body = "response" in xhr ? xhr.response : xhr.responseText;
                        /**
                 * A fetch (http call) was completed.
                 *
                 * @event fetchPolyfill#post-fetch
                 * @type {Object}
                 * @property {String} url
                 * @property {XMLHttpRequest} xhr
                 */
                        globalEvents.emit("post-fetch", {
                            url: input,
                            xhr: xhr
                        });
                        resolve(new Response(body, options));
                    };
                    xhr.onerror = function() {
                        globalEvents.emit("post-fetch", {
                            url: input,
                            xhr: xhr
                        });
                        reject(new TypeError("Network request failed"));
                    };
                    // Paul Tavares: Add support for onProgress of upload content
                    init && init.onProgress && xhr.upload && xhr.upload.addEventListener && xhr.upload.addEventListener("progress", init.onProgress, false);
                    xhr.open(request.method, request.url, true);
                    "include" === request.credentials && (xhr.withCredentials = true);
                    "responseType" in xhr && support.blob && (xhr.responseType = "blob");
                    request.headers.forEach(function(value, name) {
                        xhr.setRequestHeader(name, value);
                    });
                    /**
             * fetch (http request) is about to be done
             *
             * @event fetchPolyfill#pre-fetch
             * @type Object
             * @property {String} url
             * @property {Object} options
             */
                    globalEvents.emit("pre-fetch", {
                        url: input,
                        xhr: xhr,
                        init: init
                    });
                    xhr.send("undefined" === typeof request._bodyInit ? null : request._bodyInit);
                });
                // Paul Tavares: Allow abort() of requests
                reqPromise.abort = function() {
                    xhr.abort();
                };
                return reqPromise;
            };
            self.fetch.polyfill = true;
        }(fetchPolyfill);
        fetchPolyfill.on = globalEvents.on.bind(globalEvents);
        // Attempt to polyfill the namespace given on input or the global namespace
        fetchPolyfill();
    }, /* 55 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.a = fetchCheckForHttpErrors;
        /**
 * Checks the HTTP `Response` Object of a `fetch` to see if there was an HTTP error.
 *
 * @param {Response} response
 *
 * @returns {Response|Promise.reject}
 *  IN case of a Promise.reject, the Error provided will have a property
 *  called `response` that holds the `Response` instance
 */
        function fetchCheckForHttpErrors(response) {
            // If server returned an error code, then reject promise
            if (response.ok) return response;
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    }, /* 56 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.a = objectFill;
        /**
 * Given a target object on input, it will be "filled" with the properties of objects as long as
 * the properties of other objects are not already present in the target object.
 *
 * @param {Object} target
 * @param {...Object} fillers
 *
 * @return {Object}
 * The original `target` object is returned
 */
        function objectFill(target) {
            for (var _len = arguments.length, fillers = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) fillers[_key - 1] = arguments[_key];
            fillers.forEach(function(filler) {
                filler && Object.keys(filler).forEach(function(attrName) {
                    attrName in target ? isPureObject(target[attrName] && isPureObject(filler[attrName])) && objectFill(target[attrName], filler[attrName]) : target[attrName] = filler[attrName];
                });
            });
            return target;
        }
        function isPureObject(obj) {
            return "[object Object]" === Object.prototype.toString.call(obj);
        }
    }, /* 57 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.a = objectPick;
        /**
 * Given an object and a set of properties, this method will return a new
 * object with only the requested properties.
 *
 * @param {Object} obj
 * @param {...String|String[]} props
 *
 * @returns {Object}
 */
        function objectPick(obj) {
            for (var _len = arguments.length, props = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) props[_key - 1] = arguments[_key];
            // Yes, I could have used lodash.pick... but after I looked at its source,
            // the code seemed like it covers many more robust uses cases...I just need
            // to pick properties from a plain object.
            if (!obj) return {};
            Array.isArray(props[0]) && (props = props[0]);
            return props.reduce(function(result, prop) {
                prop in obj && (result[prop] = obj[prop]);
                return result;
            }, {});
        }
    }, /* 58 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return parseParams;
        });
        /**
 * Converts a string that was serialized with jQuery.param back to the object.
 *
 * @param {String} str
 *  The string containing the URL params. If string starts with a `?` mark
 *  (default when using `location.search`) it will be removed prior to
 *  parsing it.
 *
 * @return {Object}
 *
 * @example:
 *
 *  parseParams('foo=bar&foo=bar2&bar=foo');
 *  parseParams('foo[]=bar&foo[]=bar2&bar[]=foo');
 *
 *  // Both invocation return:
 *  //
 *  //  {
 *  //      "foo": [
 *  //          "bar",
 *  //          "bar2"
 *  //      ],
 *  //      "bar": "foo"
 *  //  }
 */
        var parseParams = function(str) {
            "?" === str.charAt(0) && (str = str.substr(1));
            var pair, prevkey, prev, arg, obj = {}, pairs = str.split("&");
            // If not string was passed in, return an empty object
            if (!str) return obj;
            for (arg = 0; arg < pairs.length; arg++) {
                pair = pairs[arg].split("=");
                !function(key, val) {
                    var firstBracket = key.indexOf("[");
                    if (-1 === firstBracket) {
                        if (void 0 !== obj[key]) {
                            obj[key] instanceof Array || (obj[key] = [ obj[key] ]);
                            obj[key].push(val);
                        } else obj[key] = val;
                        return;
                    }
                    prevkey = key.substring(0, firstBracket);
                    key = key.substr(firstBracket);
                    prev = obj;
                    key.replace(/\[([^\]]+)?\]/g, function(chunk, idx) {
                        var newobj, newkey;
                        if (chunk.match(/\[\d*\]/)) {
                            newobj = prev[prevkey] || [];
                            newkey = idx || "[]";
                        } else {
                            newobj = prev[prevkey] || {};
                            newkey = idx;
                        }
                        "[]" === prevkey ? prev.push(newobj) : prev[prevkey] = newobj;
                        prev = newobj;
                        prevkey = newkey;
                    });
                    "[]" === prevkey ? prev.push(val) : prev[prevkey] = val;
                }(decodeURIComponent(String(pair[0]).replace(/\+/g, " ")), decodeURIComponent(String(pair[1] || "").replace(/\+/g, " ")));
            }
            return obj;
        };
    }, /* 59 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return parseXML;
        });
        // from jQuery: https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/ajax/parseXML.js
        /**
 * Parses a string of XML data into an XML document that can be traversed.
 *
 * @param {String} data
 *
 * @returns XMLDocument
 *
 * @throws Error
 */
        var parseXML = function(data) {
            var xml;
            if (!data || "string" !== typeof data) return null;
            // Support: IE9
            try {
                xml = new window.DOMParser().parseFromString(data, "text/xml");
            } catch (e) {
                xml = void 0;
            }
            var errors;
            if (!xml || (errors = xml.getElementsByTagName("parsererror")).length) {
                var err;
                try {
                    err = new Error("Invalid XML: " + errors[0].textContent);
                    err.xmlData = data;
                } catch (e) {
                    err = new Error("Invalid XML: " + data);
                }
                throw err;
            }
            return xml;
        };
    }, /* 60 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* unused harmony export Promise */
        /* harmony export (immutable) */
        __webpack_exports__.a = FakePromise;
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__getGlobal__ = __webpack_require__(10);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__nextTick__ = __webpack_require__(36);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_2__runtime_aliases__ = __webpack_require__(9);
        //================================================================================
        Object(__WEBPACK_IMPORTED_MODULE_0__getGlobal__.b)().Promise;
        var STATE_PENDING = "1";
        var STATE_FULFILLED = "2";
        var STATE_REJECTED = "3";
        function FakePromise(executor) {
            if (!(this instanceof FakePromise)) throw new Error("must use `new`");
            try {
                executor(fulfillPromise.bind(this, this), rejectPromise.bind(this, this));
            } catch (e) {
                rejectPromise(this, e);
            }
        }
        Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.f)(FakePromise.prototype, {
            constructor: {
                value: FakePromise
            },
            _state: lazyProp("_state", function() {
                return STATE_PENDING;
            }),
            _result: lazyProp("_result", function() {}),
            _cb: lazyProp("_cb", function() {
                return [];
            }),
            then: {
                value: function(onFulfilled, onRejected) {
                    var parentPromise = this;
                    var thenPromise = new FakePromise(function() {
                        Object(__WEBPACK_IMPORTED_MODULE_1__nextTick__.a)(function() {
                            var resolve = function() {
                                try {
                                    parentPromise._state === STATE_FULFILLED ? fulfillPromise(thenPromise, onFulfilled ? onFulfilled(parentPromise._result) : parentPromise._result) : parentPromise._state === STATE_REJECTED && rejectPromise(thenPromise, onRejected ? onRejected(parentPromise._result) : parentPromise._result);
                                } catch (e) {
                                    rejectPromise(thenPromise, e);
                                }
                            };
                            parentPromise._state === STATE_PENDING ? parentPromise._cb.push(resolve) : resolve();
                        });
                    });
                    return thenPromise;
                }
            },
            catch: {
                value: function(onRejected) {
                    return this.then(void 0, onRejected);
                }
            }
        });
        Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.g)(FakePromise, "resolve", {
            value: function(result) {
                return new FakePromise(function(resolve) {
                    Object(__WEBPACK_IMPORTED_MODULE_1__nextTick__.a)(function() {
                        return resolve(result);
                    });
                });
            }
        });
        Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.g)(FakePromise, "reject", {
            value: function(result) {
                return new FakePromise(function(resolve, reject) {
                    Object(__WEBPACK_IMPORTED_MODULE_1__nextTick__.a)(function() {
                        return reject(result);
                    });
                });
            }
        });
        Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.g)(FakePromise, "all", {
            value: function(iterable) {
                var results = [];
                return iterable.reduce(function(priorPromise, value, idx) {
                    results[idx] = void 0;
                    // Ensure a promise value
                    value && value.then || (value = FakePromise.resolve(value));
                    return priorPromise.then(function() {
                        return value.then(function(r) {
                            return results[idx] = r;
                        });
                    });
                }, FakePromise.resolve()).then(function() {
                    return results;
                });
            }
        });
        function lazyProp(propName, valueCb) {
            var setup = {
                configurable: true
            };
            setup.get = setup.set = function() {
                Object(__WEBPACK_IMPORTED_MODULE_2__runtime_aliases__.g)(this, propName, {
                    value: valueCb(),
                    writable: true
                });
                1 === arguments.length && (// Setter was used?
                this[propName] = arguments[0]);
                return this[propName];
            };
            return setup;
        }
        function fulfillPromise(promise, result) {
            if (promise._state === STATE_PENDING) {
                // Result is a promise... Wait for it to resolve and then provide its value to this one.
                if (result && "function" === typeof result.then) {
                    result.then(function(r) {
                        return fulfillPromise(promise, r);
                    }, function(e) {
                        return rejectPromise(promise, e);
                    });
                    return;
                }
                promise._state = STATE_FULFILLED;
                promise._result = result;
                promise._cb.splice(0).forEach(function(cb) {
                    return cb(result);
                });
            }
        }
        function rejectPromise(promise, result) {
            if (promise._state === STATE_PENDING) {
                // Result is a promise... Wait for it to resolve and then provide its value to this one.
                if (result && "function" === typeof result.then) {
                    result.then(function(r) {
                        return fulfillPromise(promise, r);
                    }, function(e) {
                        return rejectPromise(promise, e);
                    });
                    return;
                }
                promise._state = STATE_REJECTED;
                promise._result = result;
                promise._cb.splice(0).forEach(function(cb) {
                    return cb(result);
                });
            }
        }
    }, /* 61 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (immutable) */
        __webpack_exports__.a = sortBy;
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__getObjectPropValue__ = __webpack_require__(18);
        /**
 * Sorts an Array/Collection of Objects by a given attribute. Sort is done in place,
 * using String matching (case insensitive - values are converted to uppercase).
 *
 * @param {Array<Object>|Collection<Object>} arr
 *
 * @param {String} attr
 *  A key path to the attribute that should be used for sorting.
 *  Examples: `name`, `profile.name'
 *
 * @param {String} [dir="asc"]
 *  Sorting direction. Possible values:
 *  -   `asc`: Ascending (Default)
 *  -   `desc`: Descending
 *
 * @example
 *
 * let arr = [
 *      {
 *          title: "title 5",
 *          profile: { name: "paul" }
 *      },
 *      {
 *          title: "title 9",
 *          profile: { name: "john" }
 *      },
 *      {
 *          title: "title 1",
 *          profile: { name: "mark" }
 *      }
 * ];
 *
 * sortBy(arr, "title");
 * sortBy(arr, "profile.name");
 */
        function sortBy(arr, attr) {
            var dir = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "asc";
            if (!Array.isArray(arr) || !attr) return;
            var isAscending = "asc" === dir;
            arr.sort(function(a, b) {
                var aVal = String(Object(__WEBPACK_IMPORTED_MODULE_0__getObjectPropValue__.a)(a, attr)).toUpperCase();
                var bVal = String(Object(__WEBPACK_IMPORTED_MODULE_0__getObjectPropValue__.a)(b, attr)).toUpperCase();
                if (aVal < bVal) {
                    if (isAscending) return -1;
                    return 1;
                }
                if (aVal > bVal) {
                    if (isAscending) return 1;
                    return -1;
                }
                return 0;
            });
        }
    }, /* 62 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return toUrlParams;
        });
        var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        var uriEncode = window.encodeURIComponent, isArray = Array.isArray, isOfTypeObject = function(obj) {
            return "object" === ("undefined" === typeof obj ? "undefined" : _typeof(obj));
        }, /**
 * Converts an Object of data, including rich object (deep structures)
 * into a URL encoded string, ready to be used in an URI.
 *
 * @function toUrlParams
 *
 * @param {Object|Array} paramObj
 * @param [keyPrefix]
 *
 * @returns {string}
 */
        toUrlParams = function toUrlParams(paramObj, keyPrefix) {
            // Objects and Array both are typeof Array. If the
            // input is not one of them, then just encode and
            // return
            if (!isOfTypeObject(paramObj)) return uriEncode(paramObj);
            var isObjArray = isArray(paramObj), keyValuePairs = [];
            // If this is na array and we have no keyPrefix, then
            // create one... We need something to attach the array to.
            isObjArray && !keyPrefix && (keyPrefix = "_");
            // Process either the Object or Array that was passed on input
            (isObjArray ? paramObj : Object.keys(paramObj)).forEach(function(paramName, index) {
                isObjArray && (paramName = index);
                var urlParamKey, paramValue = paramObj[paramName];
                urlParamKey = keyPrefix ? keyPrefix + "[" + paramName + "]" : paramName;
                // if there is more to be done on this param, then call
                // toUrlparams() again
                isOfTypeObject(paramValue) ? keyValuePairs.push(toUrlParams(paramValue, urlParamKey)) : keyValuePairs.push(uriEncode(urlParamKey) + "=" + uriEncode(paramValue));
            });
            return keyValuePairs.join("&");
        };
    }, /* 63 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return uuid;
        });
        // Some of the code below was taken from from https://github.com/ericelliott/cuid/
        /**
 * Generates a unique id. This is really a CUID.
 *
 * @namespace uuid
 */
        var counter = 1, pad = function(num, size) {
            var s = "000000000" + num;
            return s.substr(s.length - size);
        }, globalCount = function() {
            var i, count = 0;
            for (i in window) count++;
            return count;
        }(), fingerprint = function() {
            return pad((navigator.mimeTypes.length + navigator.userAgent.length).toString(36) + globalCount.toString(36), 4);
        }();
        var uuid = Object.create(/** @lends uuid */ {
            generate: function() {
                var timestamp = new Date().getTime().toString(36), nextCounter = pad((counter++).toString(36), 4), random = "xxxxxxxx".replace(/[x]/g, function() {
                    // This code from: http://stackoverflow.com/a/2117523/471188
                    var v = 16 * Math.random() | 0;
                    return v.toString(16);
                });
                return "c" + timestamp + nextCounter + fingerprint + random;
            }
        });
    }, /* 64 */
    /***/
    function(module, exports, __webpack_require__) {
        var content = __webpack_require__(65);
        "string" === typeof content && (content = [ [ module.i, content, "" ] ]);
        var options = {
            hmr: true
        };
        options.transform = void 0;
        options.insertInto = void 0;
        __webpack_require__(7)(content, options);
        content.locals && (module.exports = content.locals);
    }, /* 65 */
    /***/
    function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(6)();
        // imports
        // module
        exports.push([ module.i, ".my-widget-hide {\n  display: none !important;\n}\n", "" ]);
    }, /* 66 */
    /***/
    function(module, exports) {
        /**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */
        module.exports = function(css) {
            // get current location
            var location = "undefined" !== typeof window && window.location;
            if (!location) throw new Error("fixUrls requires window.location");
            // blank or null?
            if (!css || "string" !== typeof css) return css;
            var baseUrl = location.protocol + "//" + location.host;
            var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");
            // convert each url(...)
            /*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
            var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
                // strip quotes (if they exist)
                var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function(o, $1) {
                    return $1;
                }).replace(/^'(.*)'$/, function(o, $1) {
                    return $1;
                });
                // already a full url? no change
                if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) return fullMatch;
                // convert the url to a full url
                var newUrl;
                //TODO: should we add protocol?
                newUrl = 0 === unquotedOrigUrl.indexOf("//") ? unquotedOrigUrl : 0 === unquotedOrigUrl.indexOf("/") ? baseUrl + unquotedOrigUrl : currentDir + unquotedOrigUrl.replace(/^\.\//, "");
                // send back the fixed url(...)
                return "url(" + JSON.stringify(newUrl) + ")";
            });
            // send back the fixed css
            return fixedCss;
        };
    }, /* 67 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return xmlEscape;
        });
        /**
 * HTML and XML escaping routines
 * @namespace xmlEscape
 */
        var xmlEscape = /** @lends xmlEscape */ {
            /**
         * Escapes html code. Characters that are escaped include
         * <, > and &. These are converted to the HTML safe
         * characters.  This method can also be used to escape XML.
         *
         * @param {Object} xmlString
         *          The html code to be escaped.
         *
         * @return {String}
         *          html escaped
         *
         */
            escape: function(xmlString) {
                if ("string" !== typeof xmlString) return "";
                return xmlString.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/"/g, "&quot;");
            },
            /**
         * Un-escapes html code. Characters that are un-escaped include
         * "&lt;", "&gt;" "&apos;", "&quot;" and "&amp;". These are
         * converted to <, >, ', " and &
         *
         * @param {Object} xmlString
         *          The html code to be un-escaped.
         *
         * @return {String}
         *          html string escaped.
         *
         */
            unescape: function(xmlString) {
                if ("string" !== typeof xmlString) return "";
                return xmlString.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&apos;/g, "'").replace(/&quot;/g, '"');
            }
        };
    }, /* 68 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return getVueComponentFromWidget;
        });
        /**
 * Creates and returns a Vue Component based upon a given `Widget` factory.
 * Each component will have `props` for all widget `defaults` along with
 * the following additional params:
 *
 * -    `options { Object }`: Object with options for the widget.
 *      Can be used instead of setting each individual prop on the component.
 *      Helpful when creating a component from a parent components using the
 *      `:is="component"` directive of `template`.
 *
 * @param {Object} options
 *
 * @param {Object} options.Vue
 *  The Vue class.
 *
 * @param {Widget} options.Widget
 *  The Widget factory constructor (must have a `.create()` method).
 *
 * @param {String} [options.template='<div/>']
 *  The component template. Widget will be appended to this element.
 *
 * @param {Object} [options.watch]
 *  Object with list of vue instance properties to be watched. The object's `key` should
 *  be the simple dot-delimited paths that will be given to Vue's `$watch`, and the `value`
 *  a callback function.
 *
 * @return {Vue}
 *
 * @throws {TypeError}
 */
        function getVueComponentFromWidget() {
            var options = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
                Vue: null,
                Widget: null,
                htmlTag: "div",
                watch: null
            };
            var Vue = options.Vue, WidgetConstructor = options.Widget, template = options.template, watchExp = options.watchExp;
            if (!Vue || !WidgetConstructor) throw new TypeError("options.Vue and options.Widget are required");
            var widgetDefaults = WidgetConstructor.defaults;
            var defaultPropNames = Object.keys(widgetDefaults);
            var widgetComponentProps = defaultPropNames.reduce(function(wdgOpt, paramName) {
                // Build each widget default param into a vue Prop definition that
                // returns the default value on instantiation of each Vue component.
                wdgOpt[paramName] = {
                    default: function() {
                        return widgetDefaults[paramName];
                    }
                };
                return wdgOpt;
            }, {
                options: {
                    type: Object
                }
            });
            return Vue.extend({
                template: template || "<div/>",
                props: widgetComponentProps,
                data: function() {
                    return this.options || {};
                },
                computed: {
                    _wdgOptions: function() {
                        var _this = this;
                        return defaultPropNames.reduce(function(wdgOpt, attr) {
                            wdgOpt[attr] = _this[attr];
                            return wdgOpt;
                        }, {});
                    }
                },
                mounted: function() {
                    var _this2 = this;
                    var watchers = [];
                    var $watch = this.$watch.bind(this);
                    var widgetInst = this._wdg = WidgetConstructor.create(this._wdgOptions);
                    // If the widget supports EventEmitter, the we assume that EventEmitter
                    // implementation also support `on("*")` calling signature. We use that
                    // here to `pipe` all of its events to the component's $emit (upstream)
                    widgetInst.on && widgetInst.on("*", function(evName) {
                        for (var _len = arguments.length, evParams = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) evParams[_key - 1] = arguments[_key];
                        _this2.$emit.apply(_this2, [ evName ].concat(evParams));
                    });
                    // If there are "live options" for this widget, then setup the listeners now.
                    // A live options callback will get the following:
                    //  function(vueInstance, ...watchArgs){}
                    if (watchExp) {
                        this.options;
                        Object.keys(watchExp).forEach(function(option) {
                            "function" === typeof watchExp[option] && watchers.push($watch(option, function() {
                                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
                                return watchExp[option].apply(watchExp, [ _this2 ].concat(args));
                            }));
                        });
                    }
                    widgetInst.appendTo(this.$el);
                    widgetInst.onDestroy(function() {
                        return watchers.forEach(function(unwatch) {
                            return unwatch();
                        });
                    });
                },
                destroyed: function() {
                    if (this._wdg) {
                        this._wdg.destroy();
                        this._wdg = null;
                    }
                }
            });
        }
    }, /* 69 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return UIBlock;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__jsutils_Widget__ = __webpack_require__(5);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__jsutils_dataStore__ = __webpack_require__(0);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_2__jsutils_objectExtend__ = __webpack_require__(1);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_3__jsutils_fillTemplate__ = __webpack_require__(13);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_4__jsutils_parseHTML__ = __webpack_require__(4);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_5__domutils_domAddClass__ = __webpack_require__(2);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_6__domutils_domRemoveClass__ = __webpack_require__(11);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_7__UIBlock_html__ = __webpack_require__(70);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_7__UIBlock_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__UIBlock_html__);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_8__UIBlock_less__ = __webpack_require__(71);
        /* harmony import */
        __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__UIBlock_less__);
        var PRIVATE = __WEBPACK_IMPORTED_MODULE_1__jsutils_dataStore__.b.create();
        /**
 * Widget to block the UI from user interactions. Widget will
 * extend the full width and height of element to which it is
 * appended to.
 *
 * @class UIBlock
 * @extend Widget
 *
 * @param {Object} [options]
 * @param {String} [options.message="Please wait..."]
 * @param {String} [options.setParentClass=true]
 */
        var UIBlock = __WEBPACK_IMPORTED_MODULE_0__jsutils_Widget__.b.extend(/** @lends UIBlock.prototype */ {
            init: function(options) {
                var inst = {
                    opt: Object(__WEBPACK_IMPORTED_MODULE_2__jsutils_objectExtend__.a)({}, this.getFactory().defaults, options)
                };
                PRIVATE.set(this, inst);
                this.$ui = Object(__WEBPACK_IMPORTED_MODULE_4__jsutils_parseHTML__.a)(Object(__WEBPACK_IMPORTED_MODULE_3__jsutils_fillTemplate__.a)(__WEBPACK_IMPORTED_MODULE_7__UIBlock_html___default.a, inst.opt)).firstChild;
                inst.$msg = this.$ui.querySelector(".my-uiblock-msg");
            },
            show: function() {
                var $parentNode = this.getEle().parentNode;
                $parentNode && PRIVATE.get(this).opt.setParentClass && Object(__WEBPACK_IMPORTED_MODULE_5__domutils_domAddClass__.a)($parentNode, "my-uiblock-cntr");
                return __WEBPACK_IMPORTED_MODULE_0__jsutils_Widget__.b.prototype.show.apply(this, arguments);
            },
            hide: function() {
                var $parentNode = this.getEle().parentNode;
                $parentNode && PRIVATE.get(this).opt.setParentClass && Object(__WEBPACK_IMPORTED_MODULE_6__domutils_domRemoveClass__.a)($parentNode, "my-uiblock-cntr");
                return __WEBPACK_IMPORTED_MODULE_0__jsutils_Widget__.b.prototype.hide.apply(this, arguments);
            },
            /**
     * Sets the message to be shown
     * @param {String} msg
     */
            setMessage: function(msg) {
                msg && (PRIVATE.get(this).$msg.textContent = msg);
            }
        });
        UIBlock.defaults = {
            message: "Please wait...",
            setParentClass: true
        };
    }, /* 70 */
    /***/
    function(module, exports) {
        module.exports = '<div class="my-uiblock">\r\n    <div class="my-uiblock-overlay"></div>\r\n    <div class="my-uiblock-content">\r\n        <span class="my-uiblock-msg">{{message}}</span>\r\n        <i class="my-uiblock-img"></i>\r\n    </div>\r\n</div>';
    }, /* 71 */
    /***/
    function(module, exports, __webpack_require__) {
        var content = __webpack_require__(72);
        "string" === typeof content && (content = [ [ module.i, content, "" ] ]);
        var options = {
            hmr: true
        };
        options.transform = void 0;
        options.insertInto = void 0;
        __webpack_require__(7)(content, options);
        content.locals && (module.exports = content.locals);
    }, /* 72 */
    /***/
    function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(6)();
        // imports
        // module
        exports.push([ module.i, ".my-uiblock {\n  position: absolute;\n  top: 0;\n  left: 0;\n  box-sizing: border-box;\n  z-index: 5;\n}\n.my-uiblock,\n.my-uiblock-overlay {\n  height: 100%;\n  width: 100%;\n}\n.my-uiblock-overlay {\n  background-color: lightgrey;\n  opacity: 0.3;\n}\n.my-uiblock-content {\n  background-color: white;\n  color: grey;\n  position: absolute;\n  top: 0.3em;\n  padding: 0.5em;\n  border-top-right-radius: 3px;\n  border-bottom-right-radius: 3px;\n  max-width: 90%;\n}\n.my-uiblock-msg {\n  display: inline-block;\n  box-sizing: border-box;\n}\n.my-uiblock-img {\n  display: inline-block;\n  width: 16px;\n  height: 16px;\n  background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDM0LjY1MiAzNC42NTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDM0LjY1MiAzNC42NTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4Ij4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNMTUuNTI5LDMyLjg1NUM2Ljk2NiwzMi44NTUsMCwyNS44ODksMCwxNy4zMjZDMCw4Ljc2Myw2Ljk2NiwxLjc5NywxNS41MjksMS43OTcgICAgYzguNTYzLDAsMTUuNTI5LDYuOTY3LDE1LjUyOSwxNS41MjljMCwwLjQ5LTAuMzk3LDAuODg4LTAuODg4LDAuODg4Yy0wLjQ5LDAtMC44ODgtMC4zOTctMC44ODgtMC44ODggICAgYzAtNy41ODQtNi4xNy0xMy43NTUtMTMuNzU0LTEzLjc1NWMtNy41ODUsMC0xMy43NTUsNi4xNzEtMTMuNzU1LDEzLjc1NWMwLDcuNTg0LDYuMTcsMTMuNzU0LDEzLjc1NSwxMy43NTQgICAgYzQuODUyLDAsOS4zOTctMi42MDEsMTEuODYyLTYuNzg3YzAuMjQ5LTAuNDIzLDAuNzkzLTAuNTYyLDEuMjE1LTAuMzE0YzAuNDIyLDAuMjQ4LDAuNTYyLDAuNzkyLDAuMzE1LDEuMjE1ICAgIEMyNi4xMzksMjkuOTE5LDIxLjAwNywzMi44NTUsMTUuNTI5LDMyLjg1NXoiIGZpbGw9IiM4Yzg1OGMiLz4KCTwvZz4KCTxnPgoJCTxwYXRoIGQ9Ik0zMC4xNywxOC4yMTRjLTAuMTUzLDAtMC4zMDktMC4wNC0wLjQ1LTAuMTIzbC01LjU2MS0zLjI4NGMtMC40MjItMC4yNDktMC41NjItMC43OTMtMC4zMTMtMS4yMTUgICAgYzAuMjUtMC40MjIsMC43OTQtMC41NjIsMS4yMTYtMC4zMTJsNC44NTIsMi44NjVsMy4xMjMtNC40NzNjMC4yODEtMC40MDIsMC44MzQtMC41LDEuMjM1LTAuMjJjMC40MDIsMC4yOCwwLjUsMC44MzMsMC4yMiwxLjIzNSAgICBsLTMuNTk0LDUuMTQ2QzMwLjcyNiwxOC4wOCwzMC40NTEsMTguMjE0LDMwLjE3LDE4LjIxNHoiIGZpbGw9IiM4Yzg1OGMiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);\n  background-size: contain;\n  vertical-align: baseline;\n  -webkit-animation: my-uiblock-rotating 2s linear infinite;\n  -moz-animation: my-uiblock-rotating 2s linear infinite;\n  -ms-animation: my-uiblock-rotating 2s linear infinite;\n  -o-animation: my-uiblock-rotating 2s linear infinite;\n  animation: my-uiblock-rotating 2s linear infinite;\n}\n.my-uiblock-cntr {\n  position: relative;\n}\n@-webkit-keyframes my-uiblock-rotating {\n  from {\n    -ms-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  to {\n    -ms-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -webkit-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n@keyframes my-uiblock-rotating {\n  from {\n    -ms-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  to {\n    -ms-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -webkit-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n", "" ]);
    }, /* 73 */
    /***/
    function(module, exports) {
        module.exports = '<div class="my-popup"></div>';
    }, /* 74 */
    /***/
    function(module, exports, __webpack_require__) {
        var content = __webpack_require__(75);
        "string" === typeof content && (content = [ [ module.i, content, "" ] ]);
        var options = {
            hmr: true
        };
        options.transform = void 0;
        options.insertInto = void 0;
        __webpack_require__(7)(content, options);
        content.locals && (module.exports = content.locals);
    }, /* 75 */
    /***/
    function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(6)();
        // imports
        // module
        exports.push([ module.i, ".my-popup {\n  -webkit-box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.4);\n  -moz-box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.4);\n  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.4);\n  background-color: white;\n  position: absolute;\n  padding: 0.5em;\n  min-height: 1em;\n  width: 15em;\n  z-index: 100;\n  overflow: auto;\n}\n.my-popup,\n.my-popup * {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n.my-popup::-webkit-scrollbar {\n  width: 0.5em;\n  background-color: #F5F5F5;\n}\n.my-popup::-webkit-scrollbar-thumb {\n  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);\n  background-color: #555;\n}\n", "" ]);
    }, /* 76 */
    /***/
    function(module, exports) {
        module.exports = '<ul class="my-menu"></ul>';
    }, /* 77 */
    /***/
    function(module, exports) {
        module.exports = "<li>\r\n    <span>{{title}}</span>\r\n</li>";
    }, /* 78 */
    /***/
    function(module, exports, __webpack_require__) {
        var content = __webpack_require__(79);
        "string" === typeof content && (content = [ [ module.i, content, "" ] ]);
        var options = {
            hmr: true
        };
        options.transform = void 0;
        options.insertInto = void 0;
        __webpack_require__(7)(content, options);
        content.locals && (module.exports = content.locals);
    }, /* 79 */
    /***/
    function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(6)();
        // imports
        // module
        exports.push([ module.i, ".my-menu {\n  position: relative;\n  display: block;\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.my-menu > * {\n  display: block;\n  width: 100%;\n  overflow: hidden;\n  margin-bottom: 0.5em;\n  padding: 0.5em;\n  border-left: 3px solid transparent;\n  cursor: pointer;\n}\n.my-menu > *:last-child {\n  margin-bottom: 0;\n}\n.my-menu > *:hover,\n.my-menu-selected {\n  border-left-color: darkgrey;\n  color: black;\n}\n.my-menu-CE {\n  display: inline-block;\n}\n", "" ]);
    }, /* 80 */
    /***/
    function(module, exports) {
        module.exports = '<div class="Picker">\r\n    <span class="Picker-title" tabindex="0">{{labels.title}}</span>\r\n    <span class="Picker-actions">\r\n        <i class="Picker-icon Picker-clear">x</i>\r\n        <i class="Picker-icon Picker-showMenu">+</i>\r\n    </span>\r\n</div>';
    }, /* 81 */
    /***/
    function(module, exports, __webpack_require__) {
        var content = __webpack_require__(82);
        "string" === typeof content && (content = [ [ module.i, content, "" ] ]);
        var options = {
            hmr: true
        };
        options.transform = void 0;
        options.insertInto = void 0;
        __webpack_require__(7)(content, options);
        content.locals && (module.exports = content.locals);
    }, /* 82 */
    /***/
    function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(6)();
        // imports
        // module
        exports.push([ module.i, ".Picker {\n  position: relative;\n  border: 1px solid #c8c8c8;\n  cursor: pointer;\n  padding: 0.5em 0.2em;\n  white-space: nowrap;\n  overflow: hidden;\n}\n.Picker,\n.Picker * {\n  box-sizing: border-box;\n}\n.Picker-icon {\n  opacity: 0.8;\n  margin-right: 10px;\n}\n.Picker-icon:last-child {\n  margin-right: 0;\n}\n.Picker-icon:hover {\n  opacity: 1;\n}\n.Picker-title,\n.Picker-actions {\n  box-sizing: border-box;\n  display: inline-block;\n  vertical-align: middle;\n}\n.Picker-title {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  padding: 0 0.5rem;\n  width: calc(100% - (65px + 1.5em));\n}\n.Picker-title:focus {\n  outline: none;\n}\n.Picker-actions {\n  display: inline-block;\n  width: 70px;\n  text-align: right;\n  padding-right: 0.5em;\n}\n.Picker-noChoices {\n  opacity: 0.5;\n}\n.Picker--noClear .Picker-clear {\n  display: none;\n}\n.Picker-CE {\n  display: inline-block;\n}\n", "" ]);
    }, /* 83 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return PickerCE;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__utils_getCustomElementFromWidget__ = __webpack_require__(14);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__Picker__ = __webpack_require__(38);
        var PickerCE = Object(__WEBPACK_IMPORTED_MODULE_0__utils_getCustomElementFromWidget__.a)({
            Widget: __WEBPACK_IMPORTED_MODULE_1__Picker__.b,
            tagName: "cml-picker",
            className: "Picker-CE",
            liveProps: {
                choices: function(newValue, pickerWdg) {
                    pickerWdg && pickerWdg.setChoices(newValue);
                },
                selected: function(newValue, pickerWdg) {
                    pickerWdg && pickerWdg.setSelected(newValue);
                }
            }
        });
    }, /* 84 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return MenuCE;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__utils_getCustomElementFromWidget__ = __webpack_require__(14);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__Menu__ = __webpack_require__(19);
        var MenuCE = Object(__WEBPACK_IMPORTED_MODULE_0__utils_getCustomElementFromWidget__.a)({
            Widget: __WEBPACK_IMPORTED_MODULE_1__Menu__.b,
            tagName: "cml-menu",
            className: "my-menu-CE",
            liveProps: {
                items: function(newItems, wdg) {
                    wdg && this.wdg.setItems(newItems);
                }
            }
        });
    }, /* 85 */
    /***/
    function(module, exports, __webpack_require__) {
        var content = __webpack_require__(86);
        "string" === typeof content && (content = [ [ module.i, content, "" ] ]);
        var options = {
            hmr: true
        };
        options.transform = void 0;
        options.insertInto = void 0;
        __webpack_require__(7)(content, options);
        content.locals && (module.exports = content.locals);
    }, /* 86 */
    /***/
    function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(6)();
        // imports
        // module
        exports.push([ module.i, ".Loader {\n  padding: 0.5em;\n  text-align: center;\n}\n.Loader-img {\n  display: inline-block;\n  width: 5ch;\n  height: 1.2em;\n  background-image: url(" + __webpack_require__(87) + ");\n  background-repeat: no-repeat;\n  background-size: contain;\n}\n.Loader-CE {\n  display: inline-block;\n}\n", "" ]);
    }, /* 87 */
    /***/
    function(module, exports) {
        module.exports = "data:image/gif;base64,R0lGODlhEAALAPQAAP///wAAANra2tDQ0Orq6gYGBgAAAC4uLoKCgmBgYLq6uiIiIkpKSoqKimRkZL6+viYmJgQEBE5OTubm5tjY2PT09Dg4ONzc3PLy8ra2tqCgoMrKyu7u7gAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA";
    }, /* 88 */
    /***/
    function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "a", function() {
            return LoaderCE;
        });
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_0__utils_getCustomElementFromWidget__ = __webpack_require__(14);
        /* harmony import */
        var __WEBPACK_IMPORTED_MODULE_1__Loader__ = __webpack_require__(39);
        var LoaderCE = Object(__WEBPACK_IMPORTED_MODULE_0__utils_getCustomElementFromWidget__.a)({
            Widget: __WEBPACK_IMPORTED_MODULE_1__Loader__.b,
            className: "Loader-CE",
            tagName: "cml-loader"
        });
    } ]);
});
//# sourceMappingURL=common-micro-libs.js.map