import getGlobal from "./getGlobal"
import { FakeIterator } from "./Iterator"
import {
    arrayIndexOf,
    arraySplice
} from "./runtime-aliases"

//======================================================

const Map = getGlobal().Map || FakeMap;
export default Map;

export function FakeMap() {
    // FIXME: support for iterable input param
}

Object.defineProperties(FakeMap.prototype, {
    constructor: { value: FakeMap, configurable: true },
    _: {
        get() {
            Object.defineProperty(this, "_", { value: {
                keys: [],
                values: []
            } });
            return this._;
        }
    },
    set: {
        value(key, value) {
            if (arrayIndexOf(this._.keys, key) === -1) {
                this._.keys.push(key);
                this._.values.push(value);
            }
            return this;
        }
    },
    has: {
        value(key) { return arrayIndexOf(this._.keys, key) !== -1; }
    },
    size: {
        get() { return this._.keys.length; }
    },
    clear: {
        value() {
            arraySplice(this._.keys, 0);
            arraySplice(this._.values, 0);
        }
    },
    delete: {
        value(key) {
            const idx = arrayIndexOf(this._.keys, key);
            if (idx !== -1) {
                arraySplice(this._.keys, idx, 1);
                arraySplice(this._.values, idx, 1);
                return true;
            }
            return false;
        }
    },
    keys: {
        value() {
            return new FakeIterator(this._.keys);
        }
    },
    values: {
        value() {
            return new FakeIterator(this._.values);
        }
    },
    entries: {
        value() {
            return new FakeIterator(this._.keys, this._.values);
        }
    },
    forEach: {
        value(cb) {
            this._.keys.forEach((item, i) => cb(this._.values[i], item, this));
        }
    }
});
