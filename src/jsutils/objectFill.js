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
export default function objectFill (target, ...fillers) {
    fillers.forEach(filler => {
        if (filler) {
            Object.keys(filler).forEach(fillerAttr => {
                if (!(fillerAttr in target)) {
                    target[fillerAttr] = filler[fillerAttr];
                }
            });
        }
    });

    return target;
}