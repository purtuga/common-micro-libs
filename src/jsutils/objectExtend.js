
var _toString = Function.call.bind(Object.prototype.toString);


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
export default function objectExtend(mergeIntoObj, ...mergeObjects) {

    var
    response    = mergeIntoObj || {},
    // mergeObjects    = Array.prototype.slice.call(arguments, 1),
    total       = mergeObjects.length,
    deepMerge   = false,
    i, key;

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
            if (mergeObjects[i].hasOwnProperty(key)){

                if (deepMerge &&  _toString(mergeObjects[i][key]) === "[object Object]") {
                    response[key] = objectExtend( true, response[key], mergeObjects[i][key]);
                    
                } else {
                    response[key] = mergeObjects[i][key];
                }
                
                //response[key] = mergeObjects[i][key];
            }
        }

    }
    return response;
}