import getGlobal from "./getGlobal"
import { FakeIterator } from "./Iterator"
import {
    objectDefineProperties,
    objectDefineProperty,
    arrayIndexOf
} from "./runtime-aliases"

//============================================================

export const Set = getGlobal().Set || FakeSet;
export default Set;

export function FakeSet() {
    // FIXME: support for iterable input
}

objectDefineProperties(FakeSet.prototype, {
    constructor: { value: FakeSet, configurable: true },
    _: {
        get() {
            objectDefineProperty(this, "_", { value: [] });
            return this._;
        }
    },
    add: {
        value(item) {
            if (arrayIndexOf(this._, item) === -1) {
                this._.push(item);
            }
            return this;
        }
    },
    has: {
        value(item) { return arrayIndexOf(this._, item) !== -1; }
    },
    size: {
        get() { return this._.length; }
    },
    clear: {
        value() { this._.splice(0); }
    },
    delete: {
        value(item) {
            const idx = arrayIndexOf(this._, item);
            if (idx !== -1) {
                this._.splice(idx, 1);
                return true;
            }
            return false;
        }
    },
    values: {
        value() {
            return new FakeIterator(this._);
        }
    },
    entries: {
        value() {
            return new FakeIterator(this._, this._);
        }
    },
    forEach: {
        value(cb) {
            this._.forEach(item => cb(item, item, this));
        }
    }
});