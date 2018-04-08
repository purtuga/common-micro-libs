import {objectDefineProperty} from "./runtime-aliases";
import Set from "./Set"
import nextTick from "./nextTick"

//---------------------------------------------------------------------------
const OBSERVABLE_IDENTIFIER = "___$observable$___"; // FIXME: this should be a Symbol()
const DEFAULT_PROP_DEFINITION = { configurable: true, enumerable: true };


/**
 * A lightweight utility to Watch an object's property and get notified when it changes.
 *
 * @param {Object} obj
 * @param {String} prop
 * @param {Function} callback
 *
 * @return {Function}
 * Return a function to unwatch the property. Function also has a static property named
 * `destroy` that will do the same thing (ex. `unwatch.destroy()` is same as `unwatch()`)
 *
 * @example
 *
 * const oo = {};
 * const unWatchName = watchProp(oo, "name", () => console.log(`name changed: ${oo.name}`));
 *
 * oo.name = "paul"; // console outputs: name changed: paul
 *
 * // stop watching
 * unWatchName();
 *
 */
export function objectWatchProp(obj, prop, callback) {
    if (!obj[OBSERVABLE_IDENTIFIER]) {
        objectDefineProperty(obj, OBSERVABLE_IDENTIFIER, {
            configurable: true,
            writable: true,
            value: {
                props: {}
            }
        });
    }

    if (!obj[OBSERVABLE_IDENTIFIER].props[prop]) {
        obj[OBSERVABLE_IDENTIFIER].props[prop] = {
            val: undefined,
            watchers: new Set(),
            isQueued: false,
            notify() {
                if (this.isQueued) {
                    return;
                }
                this.isQueued = true;
                nextTick(() => {
                    this.watchers.forEach(cb => cb());
                    this.isQueued = false;
                });
            }
        };
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

    obj[OBSERVABLE_IDENTIFIER].props[prop].watchers.add(callback);

    const unWatch = () => obj[OBSERVABLE_IDENTIFIER].props[prop].watchers.delete(callback);
    unWatch.destroy = unWatch;

    return unWatch;
}

export default objectWatchProp;
