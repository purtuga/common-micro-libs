/**
 * Given an object and a set of properties, this method will return a new
 * object with only the requested properties.
 *
 * @param {Object} obj
 * @param {...String|String[]} props
 *
 * @returns {Object}
 */
export default function objectPick(obj,...props) {
    // Yes, I could have used lodash.pick... but after I looked at its source,
    // the code seemed like it covers many more robust uses cases...I just need
    // to pick properties from a plain object.

    if (!obj){
        return {};
    }

    if (Array.isArray(props[0])) {
        props = props[0];
    }

    return props.reduce((result, prop) => {
        if (prop in obj) {
            result[prop] = obj[prop];
        }
        return result;
    }, {});
}