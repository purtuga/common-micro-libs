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
export const isObject                 = obj => Object.prototype.toString.call(obj) === "[object Object]";
export const objectDefineProperty     = Object.defineProperty;
export const objectDefineProperties   = Object.defineProperties;
export const objectKeys               = Object.keys;
export const defineProperty = (obj, prop, value, getter, setter, configurable = true, enumerable = false, writable = true) => {
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

    objectDefineProperty(obj, prop, descriptor);

    return obj;
};


// Array ===============================================================================
const arr = [];
export const isArray        = Array.isArray;
export const arrayForEach   = functionBindCall(arr.forEach);
export const arrayIndexOf   = functionBindCall(arr.indexOf);
export const arraySplice    = functionBindCall(arr.splice);


// Logging ===============================================================================
export const consoleLog = console.log; // eslint-disable-line
export const consoleError = console.error || consoleLog; // eslint-disable-line
export const consoleWarn = console.warn || consoleLog; // eslint-disable-line


// Iterators ===============================================================================
export const SymbolIterator = "undefined" !== typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator";


// DOM ===============================================================================
const HTMLElementPrototype = HTMLElement.prototype;
export const doc = document;
export const head = doc.head;
export const createDocFragment = () => doc.createDocumentFragment();
export const createElement = tagName => doc.createElement(tagName);
export const createTextNode = data => doc.createTextNode(data || "");
export const appendChild = functionBindCall(HTMLElementPrototype.appendChild);
export const insertBefore = functionBindCall(HTMLElementPrototype.insertBefore);
export const hasAttribute = functionBindCall(HTMLElementPrototype.hasAttribute);
export const setAttribute = functionBindCall(HTMLElementPrototype.setAttribute);
export const removeAttribute = functionBindCall(HTMLElementPrototype.removeAttribute);