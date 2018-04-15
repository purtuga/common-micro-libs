import {objectDefineProperty, objectKeys} from "./runtime-aliases";
import Set from "./Set"
import nextTick from "./nextTick"

//---------------------------------------------------------------------------
const OBSERVABLE_IDENTIFIER = "___$observable$___"; // FIXME: this should be a Symbol()
const DEFAULT_PROP_DEFINITION = { configurable: true, enumerable: true };

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
                watchers: new Set(),
                notify
            }
        });

        // create context bound `execWatchers` which is used to feed `nextTick`
        obj[OBSERVABLE_IDENTIFIER].execWatchers = execWatchers.bind(obj[OBSERVABLE_IDENTIFIER]);
    }

    if (prop && !obj[OBSERVABLE_IDENTIFIER].props[prop]) {
        obj[OBSERVABLE_IDENTIFIER].props[prop] = {
            val: undefined,
            watchers: new Set(),
            isQueued: false,
            notifyParent: obj[OBSERVABLE_IDENTIFIER].notify.bind(obj[OBSERVABLE_IDENTIFIER]),
            notify
        };

        // create context bound `execWatchers` which is used to feed `nextTick`
        obj[OBSERVABLE_IDENTIFIER].props[prop].execWatchers = execWatchers.bind(obj[OBSERVABLE_IDENTIFIER].props[prop]);

        const propOldDescriptor = Object.getOwnPropertyDescriptor(obj, prop) || DEFAULT_PROP_DEFINITION;

        if (!propOldDescriptor.get) {
            obj[OBSERVABLE_IDENTIFIER].props[prop].val = obj[prop];
        }

        objectDefineProperty(obj, prop, {
            configurable: propOldDescriptor.configurable || false,
            enumerable: propOldDescriptor.enumerable || false,
            get() {
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
                    obj[OBSERVABLE_IDENTIFIER].props[prop].notify();
                }

                return newVal;
            }
        });
    }

    if (prop && callback) {
        obj[OBSERVABLE_IDENTIFIER].props[prop].watchers.add(callback);
    }
    else if (!prop) {
        // make ALL props observable
        objectKeys(obj).forEach(prop => objectWatchProp(obj, prop));

        if (callback) {
            obj[OBSERVABLE_IDENTIFIER].watchers.add(callback);
        }
    }

    /**
     * Unwatch an object property or object.
     *
     * @typedef {Function} ObjectUnwatchProp
     * @property {Function} destroy Same as function returned.
     */
    const unWatch = () => (
        prop ?
            obj[OBSERVABLE_IDENTIFIER].props[prop].watchers.delete(callback) :
            obj[OBSERVABLE_IDENTIFIER].watchers.delete(callback)
    );

    unWatch.destroy = unWatch;
    return unWatch;
}

function notify() {
    if (this.isQueued) {
        return;
    }
    this.isQueued = true;
    nextTick(this.execWatchers);
}

function execWatchers() {
    this.watchers.forEach(watchersForEachHandler);
    if (this.notifyParent) {
        this.notifyParent();
    }
    this.isQueued = false;
}

function watchersForEachHandler(cb) {
    cb();
}

export default objectWatchProp;
