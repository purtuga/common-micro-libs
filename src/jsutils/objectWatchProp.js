import {objectDefineProperty, objectKeys} from "./runtime-aliases";
import Set from "./Set"
import nextTick from "./nextTick"

//---------------------------------------------------------------------------
export const OBSERVABLE_IDENTIFIER = "___$observable$___"; // FIXME: this should be a Symbol()
const DEFAULT_PROP_DEFINITION = { configurable: true, enumerable: true };
const TRACKERS = new Set();
const WATCHER_IDENTIFIER = "___$watching$___";

/**
 * A lightweight utility to Watch an object's properties and get notified when it changes.
 *
 * @param {Object} obj
 *
 * @param {String} [prop]
 *  the property to be watched. If left undefined, then all existing properties are watched.
 *
 * @param {Function} [callback]
 *  The callback to be executed when property or object changes. If left undefined, then
 *  `obj` is only made observable (internal structure created and all current enumerable'
 *  properties are made "watchable")
 *
 * @return {ObjectUnwatchProp}
 * Return a function to unwatch the property. Function also has a static property named
 * `destroy` that will do the same thing (ex. `unwatch.destroy()` is same as `unwatch()`)
 *
 * @example
 *
 * const oo = {};
 * const unWatchName = objectWatchProp(oo, "name", () => console.log(`name changed: ${oo.name}`));
 *
 * oo.name = "paul"; // console outputs: name changed: paul
 *
 * // stop watching
 * unWatchName();
 * 
 * @example
 * 
 * const oo = {
 *      name: "paul",
 *      country: "usa"
 * };
 * 
 * // watch all changes to object
 * objectWatchProp(oo, null, () => console.log("Something changed in object"));
 *
 */
export function objectWatchProp(obj, prop, callback) {
    if (!obj[OBSERVABLE_IDENTIFIER]) {
        objectDefineProperty(obj, OBSERVABLE_IDENTIFIER, {
            configurable: true,
            writable: true,
            value: {
                props: {},
                watchers: new Set()
            }
        });
        obj[OBSERVABLE_IDENTIFIER].watchers.async = true;
        obj[OBSERVABLE_IDENTIFIER].watchers.notify = notify;
    }

    if (prop && !obj[OBSERVABLE_IDENTIFIER].props[prop]) {
        obj[OBSERVABLE_IDENTIFIER].props[prop] = {
            val: undefined,
            dependents: new Set(),
            watchers: new Set(),
            storeCallback: storeCallback
        };
        obj[OBSERVABLE_IDENTIFIER].props[prop].dependents.async = false;
        obj[OBSERVABLE_IDENTIFIER].props[prop].dependents.notify = notify;

        obj[OBSERVABLE_IDENTIFIER].props[prop].watchers.async = true;
        obj[OBSERVABLE_IDENTIFIER].props[prop].watchers.notify = notify;

        const propOldDescriptor = Object.getOwnPropertyDescriptor(obj, prop) || DEFAULT_PROP_DEFINITION;

        if (!propOldDescriptor.get) {
            obj[OBSERVABLE_IDENTIFIER].props[prop].val = obj[prop];
        }

        objectDefineProperty(obj, prop, {
            configurable: propOldDescriptor.configurable || false,
            enumerable: propOldDescriptor.enumerable || false,
            get() {
                if (TRACKERS.size) {
                    TRACKERS.forEach(
                        obj[OBSERVABLE_IDENTIFIER].props[prop].storeCallback,
                        obj[OBSERVABLE_IDENTIFIER].props[prop]
                    );
                }

                if (propOldDescriptor.get) {
                    return propOldDescriptor.get.call(obj);
                }
                return obj[OBSERVABLE_IDENTIFIER].props[prop].val;
            },
            set(newVal) {
                const priorVal = obj[prop];
                if (propOldDescriptor.set) {
                    newVal = propOldDescriptor.set.call(obj, newVal);
                } else {
                    obj[OBSERVABLE_IDENTIFIER].props[prop].val = newVal;
                }

                if (newVal !== priorVal) {
                    obj[OBSERVABLE_IDENTIFIER].props[prop].watchers.notify();
                    obj[OBSERVABLE_IDENTIFIER].props[prop].dependents.notify();
                    obj[OBSERVABLE_IDENTIFIER].watchers.notify();
                }

                return newVal;
            }
        });
    }

    if (prop && callback) {
        obj[OBSERVABLE_IDENTIFIER].props[prop].storeCallback(callback);
    }
    else if (!prop) {
        // make ALL props observable
        objectKeys(obj).forEach(objProp => {
            if (!obj[OBSERVABLE_IDENTIFIER].props[objProp]) {
                objectWatchProp(obj, objProp);
            }
        });

        if (callback) {
            // FIXME: should use `storeCallback` here?
            obj[OBSERVABLE_IDENTIFIER].watchers.add(callback);
        }
    }

    /**
     * Unwatch an object property or object.
     *
     * @typedef {Function} ObjectUnwatchProp
     * @property {Function} destroy Same as function returned.
     */
    const unWatch = destroyWatcher.bind(
        obj,
        callback,
        (prop ? obj[OBSERVABLE_IDENTIFIER].props[prop] : obj[OBSERVABLE_IDENTIFIER])
    );

    unWatch.destroy = unWatch;
    return unWatch;
}


function notify() {
    // this: new Set()
    //      Set instance could have two additional attributes: async ++ isQueued
    if (this.async && this.isQueued) {
        return;
    }
    if (!this.async) {
        this.forEach(execCallback);
        return;
    }
    this.isQueued = true;
    // FIXME: can we use static function below on input to nextTick()
    nextTick(() => {
        this.forEach(execCallback);
        this.isQueued = false;
    });
}

function execCallback(cb) {
    cb();
}

function storeCallback(callback) {
    // this === PropState
    if (callback.asDependent) {
        setCallbackAsWatcherOf(callback, this.dependents);
        this.dependents.add(callback);
    } else {
        setCallbackAsWatcherOf(callback, this.watchers);
        this.watchers.add(callback);
    }
}

function destroyWatcher(callback, propSetup) {
    // this == obj
    if (callback) {
        propSetup.dependents.delete(callback);
        propSetup.watchers.delete(callback);
        unsetCallbackAsWatcherOf(callback, propSetup.dependents);
        unsetCallbackAsWatcherOf(callback, propSetup.watchers);
    }
}

/**
 * Sets a callback to be added to the list of watchers for any property
 * that is accessed after this function is called.
 *
 * @param {Function} callback
 *  The callback to be added to dependency list of watchers.
 *  NOTE: the callback will modified to include a new property
 *  `stopWatchingAll()` which can be used to remove the given callback
 *  from ALL dependencies that include it.
 *
 */
export function setDependencyTracker(callback) {
    TRACKERS.add(callback);
}

/**
 * Removes a callback from being added to a property's watchers as they
 * are accessed.
 *
 * @param {Function} callback
 */
export function unsetDependencyTracker(callback) {
    TRACKERS.delete(callback);
}

/**
 * Removes the given callback from all property watchers lists that it may
 * be included in.
 *
 * @param {Function} callback
 */
export function stopTrackerNotification(callback) {
    if (callback[WATCHER_IDENTIFIER]) {
        callback[WATCHER_IDENTIFIER].stopWatchingAll();
    }
}


/**
 * Store a reference to the Set instance provided on input, on the callback.
 * @private
 * @param {Function} callback
 * @param {Set} watchersSet
 */
function setCallbackAsWatcherOf(callback, watchersSet) {
    if (!callback[WATCHER_IDENTIFIER]) {
        objectDefineProperty(callback, WATCHER_IDENTIFIER, {
            configurable: true,
            writable: true,
            value: {
                watching: new Set()
            }
        });
        objectDefineProperty(callback, "stopWatchingAll", {
            configurable: true,
            writable: true,
            value() {
                callback[WATCHER_IDENTIFIER].watching.forEach(watcherList =>
                    watcherList.delete(callback)
                );
                callback[WATCHER_IDENTIFIER].watching.clear();
            }
        });
    }

    callback[WATCHER_IDENTIFIER].watching.add(watchersSet);
}

/**
 * Removes the reference to the given Set instance from the callback function provided
 * @private
 * @param {Function} callback
 * @param {Set} watchersSet
 */
function unsetCallbackAsWatcherOf(callback, watchersSet) {
    if (callback[WATCHER_IDENTIFIER]) {
        callback[WATCHER_IDENTIFIER].watching.delete(watchersSet);
    }
}

export default objectWatchProp;
