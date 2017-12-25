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
export function objectFill (target, ...fillers) {
    fillers.forEach(filler => {
        if (filler) {
            Object.keys(filler).forEach(attrName => {
                if (!(attrName in target)) {
                    target[attrName] = filler[attrName];
                }
                else if (isPureObject(target[attrName] && isPureObject(filler[attrName]))) {
                    objectFill(target[attrName], filler[attrName]);
                }
            });
        }
    });

    return target;
}

function isPureObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
}

// Default export
export default objectFill;