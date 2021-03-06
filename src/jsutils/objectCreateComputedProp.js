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
 *  A callback function that will be used to retrieve the computed prop's
 *  value. Function is called with a context (`this`) of the object and
 *  will receive one input param - the Object itself.
 * @param {Boolean} [enumerable=true]
 *
 */
export function objectCreateComputedProp(obj, prop, setter, enumerable = true) {
    let propValue;
    let needsInitialization = true;
    let allowSet = false;
    let needsNewValue = true;

    const dependencyTracker = () => {
        // If this computed property has watchers or dependents,
        // then update prop value.
        // else:
        // Just mark it as needing a new value, which means that the
        // property value will not be re-generated until the next
        // time the object prop is accessed.
        if (
            obj[OBSERVABLE_IDENTIFIER].props[prop].dependents.size ||
            obj[OBSERVABLE_IDENTIFIER].props[prop].watchers.size
        ) {
            setPropValue();
        }
        else {
            needsNewValue = true;
        }
    };

    const setPropValue = silentSet => {
        setDependencyTracker(dependencyTracker);
        try {
            if (silentSet) {
                propValue = setter.call(obj);
            } else {
                // Update is done via the prop assignment, which means that
                // all dependent/watcher notifiers is handled as part of the
                // objectWatchProp() functionality.
                // Doing the update this way also supports the use of these
                // objects with other library that may also intercept getter/setters.
                allowSet = true;
                obj[prop] = setter.call(obj, obj);
            }
        } catch (e) {
            allowSet = false;
            needsNewValue = false;
            unsetDependencyTracker(dependencyTracker);
            throw e;
        }
        allowSet = false;
        needsNewValue = false;
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
            else if (needsNewValue) {
                setPropValue();
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
