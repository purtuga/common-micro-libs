import {
    objectDefineProperty,
    objectDefineProperties
} from "./runtime-aliases"

//-----------------------------------------------------------------------
const $iterator$ = "undefined" !== typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator";

// Great reference: http://2ality.com/2015/02/es6-iteration.html
export function FakeIterator(keys, values) {
    objectDefineProperty(this, "_", { value: {
        keys:   keys.slice(0),
        values: values ? values.slice(0) : null,
        idx:    0,
        total:  keys.length
    } });
}
export default FakeIterator;

objectDefineProperties(FakeIterator.prototype, {
    constructor: { value: FakeIterator },
    next: {
        enumerable: true,
        configurable: true,
        value() {
            const response = {
                done: this._.idx === this._.total
            };

            if (response.done) {
                response.value = undefined;
                return response;
            }

            const nextIdx = this._.idx++;

            response.value = this._.keys[nextIdx];

            if (this._.values) {
                response.value = [ response.value, this._.values[nextIdx] ];
            }

            return response;
        }
    }
});
objectDefineProperty(FakeIterator.prototype, $iterator$, { value(){ return this; } });

