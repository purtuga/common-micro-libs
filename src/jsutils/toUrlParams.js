var
uriEncode       = window.encodeURIComponent,
isArray         = Array.isArray,
isOfTypeObject  = function(obj){
    return typeof obj === "object";
},

/**
 * Converts an Object of data, including rich object (deep structures)
 * into a URL encoded string, ready to be used in an URI.
 *
 * @function toUrlParams
 *
 * @param {Object|Array} paramObj
 * @param [keyPrefix]
 *
 * @returns {string}
 */
toUrlParams = function(paramObj, keyPrefix) {
    // Objects and Array both are typeof Array. If the
    // input is not one of them, then just encode and
    // return
    if (!isOfTypeObject(paramObj)) {
        return uriEncode(paramObj);
    }

    var isObjArray      = isArray(paramObj),
        keyValuePairs   = [];

    // If this is na array and we have no keyPrefix, then
    // create one... We need something to attach the array to.
    if (isObjArray && !keyPrefix) {
        keyPrefix = "_";
    }

    // Process either the Object or Array that was passed on input
    (isObjArray ? paramObj : Object.keys(paramObj)).forEach(function (paramName, index){
        if (isObjArray) {
            paramName = index;
        }

        var paramValue  = paramObj[paramName],
            urlParamKey;

        urlParamKey = keyPrefix ? keyPrefix + "["+ paramName + "]" : paramName;

        // if there is more to be done on this param, then call
        // toUrlparams() again
        if (isOfTypeObject(paramValue)) {
            keyValuePairs.push(toUrlParams(paramValue, urlParamKey));

        } else {
            keyValuePairs.push(uriEncode(urlParamKey) + "=" + uriEncode(paramValue));
        }
    });

    return keyValuePairs.join("&");
};

export default toUrlParams;
export { toUrlParams };