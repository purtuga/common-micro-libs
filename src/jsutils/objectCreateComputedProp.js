import {objectDefineProperty} from "./runtime-aliases"
import {
    OBSERVABLE_IDENTIFIER,
    watchProp,
    setDependencyTracker,
    unsetDependencyTracker
} from "./objectWatchProp";

/**
 * Creates a computed property on a given object.
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
                // Update is done via the prop assignment so that if (for some reason)
                // this is being used with a library that also intercepts object
                // get/set methods, then it is notified of change.
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

    // Does property already exists? Delete it.
    if (prop in obj) {
        delete obj[prop];

        // Was prop an observable? if so, signal that interceptors must be redefined.
        if (obj[OBSERVABLE_IDENTIFIER] && obj[OBSERVABLE_IDENTIFIER].props[prop]) {
            obj[OBSERVABLE_IDENTIFIER].props[prop].setupInterceptors = true;
        }
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
