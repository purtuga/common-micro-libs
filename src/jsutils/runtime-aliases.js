
// Function
    // functionBind(fn, fnParent)
export const functionBind       = Function.bind.call.bind(Function.bind);
    // functionBindCall(Array.prototype.forEach)
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