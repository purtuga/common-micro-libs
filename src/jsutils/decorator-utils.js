
//============================================================

/**
 * Create a decorator element descriptor
 *
 * @param {String|Symbol} key
 * @param {Object} descriptor
 * @param {String} [kind="method"]
 *  Possible values: `field`, `class`, `method`, `initializer`
 * @param {String} [placement="prototype"]
 *  Possible value: "static", "prototype" or "own"
 * @param {Function} [initializer]
 * @param {Function} [extras]
 * @param {Function} [finisher]
 *
 * @returns {{kind: string, key: string|Symbol, placement: string, descriptor: object}}
 *
 * @see https://github.com/tc39/proposal-decorators/blob/master/METAPROGRAMMING.md
 */
function getElementDescriptor (key, descriptor, kind = "method", placement = "prototype", initializer, extras, finisher) {
    return {
        key,
        descriptor,
        kind,
        placement,
        ...(initializer ? { initializer } : null),
        ...(extras ? { extras } : null),
        ...(finisher ? { finisher } : null)
    };
}


//---------------------------------------------------------------[ EXPORTS ]---
export {
    getElementDescriptor
}
