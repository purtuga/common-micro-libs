/**
 * return a value to a given method
 *
 * @function
 * @param {Function} fn
 * @param {*} ctx The context to be assigned to `fn`
 * @return {Function}
 *
 * @example
 *
 * f = functionBin(function() { console.log(`Hello ${this.name}`); }, { name: "Jackson" });
 * f(); // => "Hello Jackson"
 */
export const functionBind = Function.bind.call.bind(Function.bind);

/**
 * return a bound `.call` to the given method.
 *
 * @type function
 * @param {Function} fn
 * @return {Function}
 * @example
 *
 * forEach = functionBindCall(Array.prototype.forEach);
 * // same as doing: Array.prototype.forEach.call (but returns a new "call" method);
 */
export const functionBindCall = functionBind(Function.call.bind, Function.call);

// Object ===============================================================================
export const toString                 = functionBindCall(Object.prototype.toString);
export const isObject                 = obj => toString(obj) === "[object Object]";
export const isString                 = obj => toString(obj) === "[object String]";
export const isFunction               = obj => toString(obj) === "[object Function]";
export const isNull                   = obj => toString(obj) === "[object Null]";
export const isUndefined              = obj => toString(obj) === "[object Undefined]";
export const objectDefineProperty     = Object.defineProperty;
export const objectDefineProperties   = Object.defineProperties;
export const objectKeys               = Object.keys;
export const getPropertyDescriptor    = (value, getter, setter, configurable = true, enumerable = false, writable = true) => {
    const descriptor = {
        configurable,
        enumerable
    };

    if (getter || setter) {
        descriptor.get = getter;
        descriptor.set = setter;
    } else {
        descriptor.writable = writable;
        descriptor.value = value;
    }
    return descriptor;
};
export const defineProperty = (obj, prop, value, getter, setter, configurable = true, enumerable = false, writable = true) => {
    objectDefineProperty(obj, prop, getPropertyDescriptor(value, getter, setter, configurable, enumerable, writable));
    return obj;
};


// Array ===============================================================================
const arr = [];
export const isArray        = Array.isArray;
export const arrayForEach   = functionBindCall(arr.forEach);
export const arrayIndexOf   = functionBindCall(arr.indexOf);
export const arraySplice    = functionBindCall(arr.splice);
export const arraySlice    = functionBindCall(arr.slice);


// Logging ===============================================================================
export const consoleLog = console.log; // eslint-disable-line
export const consoleError = console.error || consoleLog; // eslint-disable-line
export const consoleWarn = console.warn || consoleLog; // eslint-disable-line


// Iterators ===============================================================================
export const SymbolIterator = "undefined" !== typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator";


// DOM ===============================================================================
// *** In a NodeJS env - set HTMLElement to an empty object ***
if (process.env.NODE_ENV !== "production") {
    if (typeof HTMLElement === "undefined") {
        global.HTMLElement = class {}; // eslint-disable-line
        global.document = class {};
    }
    consoleWarn("DEPRECATION WARNING: DOM aliases exposed via '@purtuga/common/src/jsutils/runtime-aliases.js' no longer valid. Use '@purtuga/common/src/domutils/dom-runtime-aliases.js' instead");
}
// *!*!*!*!*!      IMPORTANT      *!*!*!*!*!!*
//      THESE ARE DEPRECATED AND MOVED TO
//      src/domutils/dom-runtime-aliases.js
const HTMLElementPrototype = HTMLElement.prototype;
export const doc = document;
export const head = doc.head;
export const createDocFragment = () => doc.createDocumentFragment();
export const createElement = tagName => doc.createElement(tagName);
export const createTextNode = data => doc.createTextNode(data || "");
export const appendChild = functionBindCall(HTMLElementPrototype.appendChild);
export const insertBefore = functionBindCall(HTMLElementPrototype.insertBefore);
export const hasAttribute = functionBindCall(HTMLElementPrototype.hasAttribute);
export const getAttribute = functionBindCall(HTMLElementPrototype.getAttribute);
export const setAttribute = functionBindCall(HTMLElementPrototype.setAttribute);
export const removeAttribute = functionBindCall(HTMLElementPrototype.removeAttribute);
export const isDocFragment = node => toString(node) === "[object DocumentFragment]";
