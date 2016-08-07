var MapPolyfill = (function(){


//-------------------------------------
// POLYFILL FOR ES6 MAP
// http://devdocs.io/javascript/global_objects/map
//-------------------------------------
// Code below as taken from es6-shim project by Paul Millr. It was a
// copy and paste to grab only the code associated with Map.
//
// For more details:
// https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js
// https://github.com/paulmillr/es6-shim
//
// @license es6-shim Copyright 2013-2016 by Paul Miller (http://paulmillr.com) and contributors,  MIT License
//
// es6-shim: v0.35.1
// see https://github.com/paulmillr/es6-shim/blob/0.35.1/LICENSE
// Details and documentation:
// https://github.com/paulmillr/es6-shim/

    var getGlobal = function () {
        /* global self, window, global */
        // the only reliable means to get the global object is
        // `Function('return this')()`
        // However, this causes CSP violations in Chrome apps.
        if (typeof self !== 'undefined') { return self; }
        if (typeof window !== 'undefined') { return window; }
        if (typeof global !== 'undefined') { return global; }
        throw new Error('unable to locate global object');
    };

    var globals = getGlobal();

//[PT] use global if one exists
    if (typeof globals.Map !== "undefined") {
        return globals.Map;
    }

// ------------------- START POLYFILL ---------------------------------

    var _forEach = Function.call.bind(Array.prototype.forEach);
    var _toString = Function.call.bind(Object.prototype.toString);
    var _apply = Function.call.bind(Function.apply);
    var _call = Function.call.bind(Function.call);
    var keys = Object.keys;
    var _reduce = Function.call.bind(Array.prototype.reduce);
    var isArray = Array.isArray;
    var create = Object.create;

    var throwsError = function (func) {
        try {
            func();
            return false;
        } catch (e) {
            return true;
        }
    };

    var isCallable = typeof /abc/ === 'function' ? function IsCallableSlow(x) {
        // Some old browsers (IE, FF) say that typeof /abc/ === 'function'
        return typeof x === 'function' && _toString(x) === '[object Function]';
    } : function IsCallableFast(x) { return typeof x === 'function'; };

    var _hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

    var $String = String;

    var emptyObject = function emptyObject() {
        // accomodate some older not-quite-ES5 browsers
        return Object.create ? Object.create(null) : {};
    };

// taken directly from https://github.com/ljharb/is-arguments/blob/master/index.js
// can be replaced with require('is-arguments') if we ever use a build process instead
    var isStandardArguments = function isArguments(value) {
        return _toString(value) === '[object Arguments]';
    };
    var isLegacyArguments = function isArguments(value) {
        return value !== null &&
            typeof value === 'object' &&
            typeof value.length === 'number' &&
            value.length >= 0 &&
            _toString(value) !== '[object Array]' &&
            _toString(value.callee) === '[object Function]';
    };
    var isArguments = isStandardArguments(arguments) ? isStandardArguments : isLegacyArguments;

    var numberIsNaN = Number.isNaN || function isNaN(value) {
            // NaN !== NaN, but they are identical.
            // NaNs are the only non-reflexive value, i.e., if x !== x,
            // then x is NaN.
            // isNaN is broken: it converts its argument to number, so
            // isNaN('foo') => true
            return value !== value;
        };

    var arePropertyDescriptorsSupported = function () {
        // if Object.defineProperty exists but throws, it's IE 8
        return !throwsError(function () {
            Object.defineProperty({}, 'x', { get: function () {} });
        });
    };

    var supportsDescriptors = !!Object.defineProperty && arePropertyDescriptorsSupported();

    var defineProperty = function (object, name, value, force) {
        if (!force && name in object) { return; }
        if (supportsDescriptors) {
            Object.defineProperty(object, name, {
                configurable: true,
                enumerable: false,
                writable: true,
                value: value
            });
        } else {
            object[name] = value;
        }
    };

// Our ArrayIterator is private; see
// https://github.com/paulmillr/es6-shim/issues/252
    var ArrayIterator = function (array, kind) {
        this.i = 0;
        this.array = array;
        this.kind = kind;
    };

    var Symbol = globals.Symbol || {};

    var Type = {
        string: function (x) { return _toString(x) === '[object String]'; },
        symbol: function (x) {
            return typeof globals.Symbol === 'function' && typeof x === 'symbol';
        }
    };


// This is a private name in the es6 spec, equal to '[Symbol.iterator]'
// we're going to use an arbitrary _-prefixed name to make our shims
// work properly with each other, even though we don't have full Iterator
// support.  That is, `Array.from(map.keys())` will work, but we don't
// pretend to export a "real" Iterator interface.
    var $iterator$ = Type.symbol(Symbol.iterator) ? Symbol.iterator : '_es6-shim iterator_';

// Firefox ships a partial implementation using the name @@iterator.
// https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
// So use that name if we detect it.
    if (globals.Set && typeof new globals.Set()['@@iterator'] === 'function') {
        $iterator$ = '@@iterator';
    }

    var ES = {
        // http://www.ecma-international.org/ecma-262/6.0/#sec-call
        Call: function Call(F, V) {
            var args = arguments.length > 2 ? arguments[2] : [];
            if (!ES.IsCallable(F)) {
                throw new TypeError(F + ' is not a function');
            }
            return _apply(F, V, args);
        },

        RequireObjectCoercible: function (x, optMessage) {
            /* jshint eqnull:true */
            if (x == null) {
                throw new TypeError(optMessage || 'Cannot call method on ' + x);
            }
            return x;
        },

        // This might miss the "(non-standard exotic and does not implement
        // [[Call]])" case from
        // http://www.ecma-international.org/ecma-262/6.0/#sec-typeof-operator-runtime-semantics-evaluation
        // but we can't find any evidence these objects exist in practice.
        // If we find some in the future, you could test `Object(x) === x`,
        // which is reliable according to
        // http://www.ecma-international.org/ecma-262/6.0/#sec-toobject
        // but is not well optimized by runtimes and creates an object
        // whenever it returns false, and thus is very slow.
        TypeIsObject: function (x) {
            if (x === void 0 || x === null || x === true || x === false) {
                return false;
            }
            return typeof x === 'function' || typeof x === 'object';
        },

        ToObject: function (o, optMessage) {
            return Object(ES.RequireObjectCoercible(o, optMessage));
        },

        IsCallable: isCallable,

        SameValue: function (a, b) {
            if (a === b) {
                // 0 === -0, but they are not identical.
                if (a === 0) { return 1 / a === 1 / b; }
                return true;
            }
            return numberIsNaN(a) && numberIsNaN(b);
        },

        SameValueZero: function (a, b) {
            // same as SameValue except for SameValueZero(+0, -0) == true
            return (a === b) || (numberIsNaN(a) && numberIsNaN(b));
        },

        GetIterator: function (o) {
            if (isArguments(o)) {
                // special case support for `arguments`
                return new ArrayIterator(o, 'value');
            }
            var itFn = ES.GetMethod(o, $iterator$);
            if (!ES.IsCallable(itFn)) {
                // Better diagnostics if itFn is null or undefined
                throw new TypeError('value is not an iterable');
            }
            var it = ES.Call(itFn, o);
            if (!ES.TypeIsObject(it)) {
                throw new TypeError('bad iterator');
            }
            return it;
        },

        GetMethod: function (o, p) {
            var func = ES.ToObject(o)[p];
            if (func === void 0 || func === null) {
                return void 0;
            }
            if (!ES.IsCallable(func)) {
                throw new TypeError('Method not callable: ' + p);
            }
            return func;
        },

        IteratorComplete: function (iterResult) {
            return !!iterResult.done;
        },

        IteratorClose: function (iterator, completionIsThrow) {
            var returnMethod = ES.GetMethod(iterator, 'return');
            if (returnMethod === void 0) {
                return;
            }
            var innerResult, innerException;
            try {
                innerResult = ES.Call(returnMethod, iterator);
            } catch (e) {
                innerException = e;
            }
            if (completionIsThrow) {
                return;
            }
            if (innerException) {
                throw innerException;
            }
            if (!ES.TypeIsObject(innerResult)) {
                throw new TypeError("Iterator's return method returned a non-object.");
            }
        },

        IteratorNext: function (it) {
            var result = arguments.length > 1 ? it.next(arguments[1]) : it.next();
            if (!ES.TypeIsObject(result)) {
                throw new TypeError('bad iterator');
            }
            return result;
        },

        IteratorStep: function (it) {
            var result = ES.IteratorNext(it);
            var done = ES.IteratorComplete(result);
            return done ? false : result;
        },

        ToString: function ToString(string) {
            return $String(string);
        }
    };

// Given an argument x, it will return an IteratorResult object,
// with value set to x and done to false.
// Given no arguments, it will return an iterator completion object.
    var iteratorResult = function (x) {
        return { value: x, done: arguments.length === 0 };
    };


    var addIterator = function (prototype, impl) {
        var implementation = impl || function iterator() { return this; };
        defineProperty(prototype, $iterator$, implementation);
        if (!prototype[$iterator$] && Type.symbol($iterator$)) {
            // implementations are buggy when $iterator$ is a Symbol
            prototype[$iterator$] = implementation;
        }
    };

    var emulateES6construct = function (o, defaultNewTarget, defaultProto, slots) {
        // This is an es5 approximation to es6 construct semantics.  in es6,
        // 'new Foo' invokes Foo.[[Construct]] which (for almost all objects)
        // just sets the internal variable NewTarget (in es6 syntax `new.target`)
        // to Foo and then returns Foo().

        // Many ES6 object then have constructors of the form:
        // 1. If NewTarget is undefined, throw a TypeError exception
        // 2. Let xxx by OrdinaryCreateFromConstructor(NewTarget, yyy, zzz)

        // So we're going to emulate those first two steps.
        if (!ES.TypeIsObject(o)) {
            throw new TypeError('Constructor requires `new`: ' + defaultNewTarget.name);
        }
        var proto = defaultNewTarget.prototype;
        if (!ES.TypeIsObject(proto)) {
            proto = defaultProto;
        }
        var obj = create(proto);
        for (var name in slots) {
            if (_hasOwnProperty(slots, name)) {
                var value = slots[name];
                defineProperty(obj, name, value, true);
            }
        }
        return obj;
    };


    var addIterableToMap = function addIterableToMap(MapConstructor, map, iterable) {
        if (isArray(iterable) || Type.string(iterable)) {
            _forEach(iterable, function (entry) {
                if (!ES.TypeIsObject(entry)) {
                    throw new TypeError('Iterator value ' + entry + ' is not an entry object');
                }
                map.set(entry[0], entry[1]);
            });
        } else if (iterable instanceof MapConstructor) {
            _call(MapConstructor.prototype.forEach, iterable, function (value, key) {
                map.set(key, value);
            });
        } else {
            var iter, adder;
            if (iterable !== null && typeof iterable !== 'undefined') {
                adder = map.set;
                if (!ES.IsCallable(adder)) { throw new TypeError('bad map'); }
                iter = ES.GetIterator(iterable);
            }
            if (typeof iter !== 'undefined') {
                while (true) {
                    var next = ES.IteratorStep(iter);
                    if (next === false) { break; }
                    var nextItem = next.value;
                    try {
                        if (!ES.TypeIsObject(nextItem)) {
                            throw new TypeError('Iterator value ' + nextItem + ' is not an entry object');
                        }
                        _call(adder, map, nextItem[0], nextItem[1]);
                    } catch (e) {
                        ES.IteratorClose(iter, true);
                        throw e;
                    }
                }
            }
        }
    };

    var Value = {
        getter: function (object, name, getter) {
            if (!supportsDescriptors) {
                throw new TypeError('getters require true ES5 support');
            }
            Object.defineProperty(object, name, {
                configurable: true,
                enumerable: false,
                get: getter
            });
        }
    };

// Define configurable, writable and non-enumerable props
// if they don’t exist.
    var defineProperties = function (object, map, forceOverride) {
        _forEach(keys(map), function (name) {
            var method = map[name];
            defineProperty(object, name, method, !!forceOverride);
        });
    };

// Map and Set require a true ES5 environment
// Their fast path also requires that the environment preserve
// property insertion order, which is not guaranteed by the spec.
    var testOrder = function (a) {
        var b = keys(_reduce(a, function (o, k) {
            o[k] = true;
            return o;
        }, {}));
        return a.join(':') === b.join(':');
    };
    var preservesInsertionOrder = testOrder(['z', 'a', 'bb']);
// some engines (eg, Chrome) only preserve insertion order for string keys
    var preservesNumericInsertionOrder = testOrder(['z', 1, 'a', '3', 2]);

    var fastkey = function fastkey(key) {
        if (!preservesInsertionOrder) {
            return null;
        }
        if (typeof key === 'undefined' || key === null) {
            return '^' + ES.ToString(key);
        } else if (typeof key === 'string') {
            return '$' + key;
        } else if (typeof key === 'number') {
            // note that -0 will get coerced to "0" when used as a property key
            if (!preservesNumericInsertionOrder) {
                return 'n' + key;
            }
            return key;
        } else if (typeof key === 'boolean') {
            return 'b' + key;
        }
        return null;
    };

    var Map = (function () {

        var empty = {};

        var MapEntry = function MapEntry(key, value) {
            this.key = key;
            this.value = value;
            this.next = null;
            this.prev = null;
        };

        MapEntry.prototype.isRemoved = function isRemoved() {
            return this.key === empty;
        };

        var isMap = function isMap(map) {
            return !!map._es6map;
        };

        var requireMapSlot = function requireMapSlot(map, method) {
            if (!ES.TypeIsObject(map) || !isMap(map)) {
                throw new TypeError('Method Map.prototype.' + method + ' called on incompatible receiver ' + ES.ToString(map));
            }
        };

        var MapIterator = function MapIterator(map, kind) {
            requireMapSlot(map, '[[MapIterator]]');
            this.head = map._head;
            this.i = this.head;
            this.kind = kind;
        };

        MapIterator.prototype = {
            next: function next() {
                var i = this.i;
                var kind = this.kind;
                var head = this.head;
                if (typeof this.i === 'undefined') {
                    return iteratorResult();
                }
                while (i.isRemoved() && i !== head) {
                    // back up off of removed entries
                    i = i.prev;
                }
                // advance to next unreturned element.
                var result;
                while (i.next !== head) {
                    i = i.next;
                    if (!i.isRemoved()) {
                        if (kind === 'key') {
                            result = i.key;
                        } else if (kind === 'value') {
                            result = i.value;
                        } else {
                            result = [i.key, i.value];
                        }
                        this.i = i;
                        return iteratorResult(result);
                    }
                }
                // once the iterator is done, it is done forever.
                this.i = void 0;
                return iteratorResult();
            }
        };
        addIterator(MapIterator.prototype);

        var Map$prototype;
        var MapShim = function Map() {
            if (!(this instanceof Map)) {
                throw new TypeError('Constructor Map requires "new"');
            }
            if (this && this._es6map) {
                throw new TypeError('Bad construction');
            }
            var map = emulateES6construct(this, Map, Map$prototype, {
                _es6map: true,
                _head: null,
                _storage: emptyObject(),
                _size: 0
            });

            var head = new MapEntry(null, null);
            // circular doubly-linked list.
            head.next = head.prev = head;
            map._head = head;

            // Optionally initialize map from iterable
            if (arguments.length > 0) {
                addIterableToMap(Map, map, arguments[0]);
            }
            return map;
        };
        Map$prototype = MapShim.prototype;

        Value.getter(Map$prototype, 'size', function () {
            if (typeof this._size === 'undefined') {
                throw new TypeError('size method called on incompatible Map');
            }
            return this._size;
        });

        defineProperties(Map$prototype, {
            get: function get(key) {
                requireMapSlot(this, 'get');
                var fkey = fastkey(key);
                if (fkey !== null) {
                    // fast O(1) path
                    var entry = this._storage[fkey];
                    if (entry) {
                        return entry.value;
                    } else {
                        return;
                    }
                }
                var head = this._head;
                var i = head;
                while ((i = i.next) !== head) {
                    if (ES.SameValueZero(i.key, key)) {
                        return i.value;
                    }
                }
            },

            has: function has(key) {
                requireMapSlot(this, 'has');
                var fkey = fastkey(key);
                if (fkey !== null) {
                    // fast O(1) path
                    return typeof this._storage[fkey] !== 'undefined';
                }
                var head = this._head;
                var i = head;
                while ((i = i.next) !== head) {
                    if (ES.SameValueZero(i.key, key)) {
                        return true;
                    }
                }
                return false;
            },

            set: function set(key, value) {
                requireMapSlot(this, 'set');
                var head = this._head;
                var i = head;
                var entry;
                var fkey = fastkey(key);
                if (fkey !== null) {
                    // fast O(1) path
                    if (typeof this._storage[fkey] !== 'undefined') {
                        this._storage[fkey].value = value;
                        return this;
                    } else {
                        entry = this._storage[fkey] = new MapEntry(key, value);
                        i = head.prev;
                        // fall through
                    }
                }
                while ((i = i.next) !== head) {
                    if (ES.SameValueZero(i.key, key)) {
                        i.value = value;
                        return this;
                    }
                }
                entry = entry || new MapEntry(key, value);
                if (ES.SameValue(-0, key)) {
                    entry.key = +0; // coerce -0 to +0 in entry
                }
                entry.next = this._head;
                entry.prev = this._head.prev;
                entry.prev.next = entry;
                entry.next.prev = entry;
                this._size += 1;
                return this;
            },

            'delete': function (key) {
                requireMapSlot(this, 'delete');
                var head = this._head;
                var i = head;
                var fkey = fastkey(key);
                if (fkey !== null) {
                    // fast O(1) path
                    if (typeof this._storage[fkey] === 'undefined') {
                        return false;
                    }
                    i = this._storage[fkey].prev;
                    delete this._storage[fkey];
                    // fall through
                }
                while ((i = i.next) !== head) {
                    if (ES.SameValueZero(i.key, key)) {
                        i.key = i.value = empty;
                        i.prev.next = i.next;
                        i.next.prev = i.prev;
                        this._size -= 1;
                        return true;
                    }
                }
                return false;
            },

            clear: function clear() {
                requireMapSlot(this, 'clear');
                this._size = 0;
                this._storage = emptyObject();
                var head = this._head;
                var i = head;
                var p = i.next;
                while ((i = p) !== head) {
                    i.key = i.value = empty;
                    p = i.next;
                    i.next = i.prev = head;
                }
                head.next = head.prev = head;
            },

            keys: function keys() {
                requireMapSlot(this, 'keys');
                return new MapIterator(this, 'key');
            },

            values: function values() {
                requireMapSlot(this, 'values');
                return new MapIterator(this, 'value');
            },

            entries: function entries() {
                requireMapSlot(this, 'entries');
                return new MapIterator(this, 'key+value');
            },

            forEach: function forEach(callback) {
                requireMapSlot(this, 'forEach');
                var context = arguments.length > 1 ? arguments[1] : null;
                var it = this.entries();
                for (var entry = it.next(); !entry.done; entry = it.next()) {
                    if (context) {
                        _call(callback, context, entry.value[1], entry.value[0], this);
                    } else {
                        callback(entry.value[1], entry.value[0], this);
                    }
                }
            }
        });
        addIterator(Map$prototype, Map$prototype.entries);

        return MapShim;
    }());

})();

export default MapPolyfill;
