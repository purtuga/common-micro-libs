const OBJECT_TYPE   = "[object Object]";
const _toString     = Function.call.bind(Object.prototype.toString);
const _hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

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
export function objectExtend(mergeIntoObj, ...mergeObjects) {
    let response    = mergeIntoObj || {};
    let total       = mergeObjects.length;
    let deepMerge   = false;
    let i;
    let key;

    if (typeof mergeIntoObj === "boolean") {
        deepMerge   = mergeIntoObj;
        response    = mergeObjects.shift() || {};
        total       = mergeObjects.length;
    }

    for (i = 0; i < total; i++) {
        if (!mergeObjects[i]) {
            continue;
        }

        for (key in mergeObjects[i]) {
            if (_hasOwnProperty(mergeObjects[i], key)){
                if (
                    deepMerge &&
                    _toString(response[key]) === OBJECT_TYPE &&
                    _toString(mergeObjects[i][key]) === OBJECT_TYPE
                ) {
                    response[key] = objectExtend( true, response[key], mergeObjects[i][key]);

                } else {
                    response[key] = mergeObjects[i][key];
                }
            }
        }
    }
    return response;
}
export default objectExtend;