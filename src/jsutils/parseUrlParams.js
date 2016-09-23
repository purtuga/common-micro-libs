/**
 * Converts a string that was serialized with jQuery.param back to the object.
 *
 * @param {String} str
 *  The string containing the URL params. If string starts with a `?` mark
 *  (default when using `location.search`) it will be removed prior to
 *  parsing it.
 *
 * @return {Object}
 *
 * @example:
 *
 *  parseParams('foo=bar&foo=bar2&bar=foo');
 *  parseParams('foo[]=bar&foo[]=bar2&bar[]=foo');
 *
 *  // Both invocation return:
 *  //
 *  //  {
 *  //      "foo": [
 *  //          "bar",
 *  //          "bar2"
 *  //      ],
 *  //      "bar": "foo"
 *  //  }
 */
var parseParams = function parseParamsFn(str) {

    if (str.charAt(0) === "?") {
        str = str.substr(1);
    }

    var obj         = {}, pair,
        pairs       = str.split("&"),
        prevkey, prev, arg,
        injectParam = function(key, val) {

            var firstBracket = key.indexOf('[');

            if (firstBracket === -1) {
                if (obj[key] !== undefined) {
                    if (!(obj[key] instanceof Array)) {
                        obj[key] = [ obj[key] ];
                    }

                    obj[key].push(val);

                } else {
                    obj[key] = val;
                }

                return;
            }

            prevkey = key.substring(0, firstBracket);
            key     = key.substr(firstBracket);
            prev    = obj;

            key.replace(/\[([^\]]+)?\]/g, function(chunk, idx/*, pos*/) {
                var newobj, newkey;

                if (chunk.match(/\[\d*\]/)) {
                    newobj = prev[prevkey] || [];
                    newkey = idx || '[]';

                } else {
                    newobj = prev[prevkey] || {};
                    newkey = idx;
                }

                if (prevkey === '[]') {
                    prev.push(newobj);

                } else {
                    prev[prevkey] = newobj;
                }

                prev    = newobj;
                prevkey = newkey;
            });

            if (prevkey === '[]') {
                prev.push(val);

            } else {
                prev[prevkey] = val;
            }
        };

    // If not string was passed in, return an empty object
    if (!str) {
        return obj;
    }

    for( arg = 0; arg < pairs.length; arg++ ) {
        pair = pairs[ arg ].split( "=" );
        injectParam(
            decodeURIComponent(String(pair[0]).replace(/\+/g, " ")),
            decodeURIComponent(String(pair[1] || "").replace(/\+/g, " "))
        );
    }

    return obj;
};

export default parseParams;
