define(function(){

    /**
     * Returns an Object property value using dot notation and thus
     * find the key no matter how deep it is in the given object.
     *
     * @param {Object} obj
     *  The object to be used in retrieving the key value.
     *
     * @param {String} prop
     *  A property name whose value will be returned. This property
     *  definition could be defined using dot notation is wanting to
     *  retrieve a property deep in the object. Example:
     *  `name`, or `i18n.en-us.name`
     */
    return function getObjectPropValue(obj, prop){
        if (!obj || !prop) {
            return;
        }

        var
        keys = prop.split("."),
        key;

        while ((key = keys.shift())) {
            if (!obj || !(obj instanceof Object) || !(key in obj)) {
                return;
            }
            obj = obj[key];
        }

        return obj;
    };
});