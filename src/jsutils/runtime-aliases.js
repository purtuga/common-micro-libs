
// Function
    // functionBind(fn, fnParent)
export const functionBind       = Function.bind.call.bind(Function.bind);
    // usage: functionBindCall(Array.prototype.forEach) // generates a bound function to Array.prototype.forEach.call
export const functionBindCall   = functionBind(Function.call.bind, Function.call);

// Object
export const objectDefineProperty     = Object.defineProperty;
export const objectDefineProperties   = Object.defineProperties;
export const objectKeys               = Object.keys;


// Array
const arr = [];
export const isArray        = Array.isArray;
export const arrayForEach   = functionBindCall(arr.forEach);
export const arrayIndexOf   = functionBindCall(arr.indexOf);
export const arraySplice    = functionBindCall(arr.splice);

// Logging
export const consoleLog = console.log;
export const consoleError = console.error || consoleLog;

// Iterators
export const SymbolIterator = "undefined" !== typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator";