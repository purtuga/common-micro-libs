import {objectDefineProperty} from "./runtime-aliases"
import {
    OBSERVABLE_IDENTIFIER,
    watchProp,
    setDependencyTracker,
    unsetDependencyTracker
} from "./objectWatchProp";

/**
 * Creates a computed property on a given object
 *
 * @param {Object} obj
 * @param {String} prop
 * @param {Function} setter
 * @param {Boolean} [enumerable=true]
 *
 */
export function objectCreateComputedProp(obj, prop, setter, enumerable = true) {
    let propValue;
    let needsInitialization = true;
    let allowSet = false;

    const dependencyTracker = () => {
        setPropValue();
    };

    const setPropValue = silentSet => {
        setDependencyTracker(dependencyTracker);
        try {
            if (silentSet) {
                propValue = setter.call(obj);
            } else {
                allowSet = true;
                obj[prop] = setter.call(obj);
            }
        } catch (e) {
            unsetDependencyTracker(dependencyTracker);
            allowSet = false;
            throw e;
        }
        allowSet = false;
        unsetDependencyTracker(dependencyTracker);
    };

    // Delete the property setup, if it is currently defined
    if (obj[OBSERVABLE_IDENTIFIER] && obj[OBSERVABLE_IDENTIFIER].props[prop]) {
        delete obj[OBSERVABLE_IDENTIFIER].props[prop];
    }

    objectDefineProperty(obj, prop, {
        configurable: true,
        enumerable: !!enumerable,
        get() {
            if (needsInitialization) {
                needsInitialization = false;
                setPropValue(true);
            }
            return propValue;
        },
        set(newValue) {
            if (allowSet) {
                propValue = newValue;
            }
            return propValue;
        }
    });

    watchProp(obj, prop);
}
