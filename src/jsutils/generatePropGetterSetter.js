import {throwIfThisIsPrototype} from "./throwIfThisIsPrototype.js";


//=================================================================================
const storage = new WeakMap();
const createObject = () => Object.create(null);

/**
 * Generate a getter/setter function to be used `Object.defineProperty` that allows
 * for a callback to be executed when the prop's value changes.
 *
 * @param {String} key
 *
 * @param {Function} [valueInitializer]
 *  A callback whose return value will be used as the initial value for the prop.
 *  If this is defined, then `value` argument will be ignored.
 * @param {*} [value]
 *  The initial property value.
 * @param {Function} [notifier]
 *  A callback to be executed when the value changes
 * @param {*} [thisContext=this]
 *  The context for when calling `notifier`. Defaults to the object instance
 * @param {Array} [args=[]]
 *  Any argument to be passed on to the notifier
 * @returns {function(): any}
 *
 * @example
 *
 * const descriptor = { configurable: true };
 * descriptor.get = descriptor.set = generatePropGetterSetter(() => console.log("prop updated"));
 * const obj = Object.create({}, { name: descriptor });
 *
 * obj.name = "paul"; // console output: prop updated
 */
export function generatePropGetterSetter (key, valueInitializer, value, notifier, thisContext, args = []) {
    if (!key){
        throw new TypeError("key is required");
    }

    function getterSetter () {
        throwIfThisIsPrototype(this);
        let contextStorage;

        if (!storage.has(this)) {
            contextStorage = createObject();
            contextStorage.isNotifying = false;
            contextStorage.props = createObject();

            storage.set(this, contextStorage);

        } else {
            contextStorage = storage.get(this);
        }

        if (!(key in contextStorage.props)) {
            contextStorage.props[key] = valueInitializer ? valueInitializer() : value;
        }

        if (arguments.length && arguments[0] !== contextStorage.props[key]) {
            contextStorage.props[key] = arguments[0];

            if (notifier && !contextStorage.isNotifying) {
                contextStorage.isNotifying = true;
                try {
                    notifier.call(thisContext || this, ...args);
                } catch(e) {
                    contextStorage.isNotifying = false;
                    throw e;
                }
                contextStorage.isNotifying = false;
            }
        }

        return contextStorage.props[key];
    }
    getterSetter.isGetterSetter = true;
    return getterSetter;
}
