/**
 * Check if the given `this` value matches its own Constructor's prototype, and
 * if so, throw an error.
 * Good to use with lazy properties that set themselves up on first access
 *
 * @param {Object} THIS
 * @throws
 */
export function throwIfThisIsPrototype(THIS) {
    if (THIS.constructor && THIS === THIS.constructor.prototype) {
        throw new Error("Can not be accessed directly on constructor.prototype!");
    }
}