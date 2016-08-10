/**
 * Extends an object with the properties of another.
 *
 * @name objectExtend
 *
 * @param {Object} mergeIntoObj
 * @param {...Object} copyObj1
 *
 * @return {Object}
 */
export default function objectExtend(mergeIntoObj) {


    // For when we support deep merge: check if tru object Object.prototype.toString.call(n) === "[object Object]"

    var
    response    = mergeIntoObj || {},
    copyObjs    = Array.prototype.slice.call(arguments, 1),
    total       = copyObjs.length,
    i, key;
    for (i = 0; i < total; i++) {

        if (!copyObjs[i]) {
            continue;
        }

        for (key in copyObjs[i]) {
            if (copyObjs[i].hasOwnProperty(key)){
                response[key] = copyObjs[i][key];
            }
        }

    }
    return response;
}