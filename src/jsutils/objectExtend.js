import {isObject} from "./runtime-aliases.js";

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
            if (mergeObjects[i].hasOwnProperty(key)) {
                if (
                    deepMerge &&
                    isObject(response[key]) &&
                    isObject(mergeObjects[i][key])
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