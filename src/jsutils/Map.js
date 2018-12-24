import { GLOBAL } from "./getGlobal"
import { FakeIterator } from "./Iterator"
import {
    arrayIndexOf,
    arraySplice,
    objectDefineProperty,
    objectDefineProperties,
    SymbolIterator
} from "./runtime-aliases"

//======================================================

export const Map = GLOBAL.Map && GLOBAL.Map.prototype[SymbolIterator] ? GLOBAL.Map : FakeMap;
export default Map;

export function FakeMap() {
    // FIXME: support for iterable input param
}

objectDefineProperties(FakeMap.prototype, {
    constructor: { value: FakeMap, configurable: true },
    _: {
        get() {
            objectDefineProperty(this, "_", { value: {
                keys: [],
                values: []
            } });
            return this._;
        }
    },
    get: {
        value(key) {
            return this._.values[arrayIndexOf(this._.keys, key)];
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
        value(cb, thisArg) {
            this._.keys.forEach((item, i) => cb.call(thisArg, this._.values[i], item));
        }
    },
    [SymbolIterator]: {
        value() {
            return this.entries();
        }
    }
});

