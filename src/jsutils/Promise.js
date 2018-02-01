import getGlobal from "./getGlobal"
import nextTick from "./nextTick"
import {
    objectDefineProperties,
    objectDefineProperty } from "./runtime-aliases"

//================================================================================
export const Promise = getGlobal().Promise || FakePromise;
export default Promise;

const STATE_PENDING     = "1";
const STATE_FULFILLED   = "2";
const STATE_REJECTED    = "3";

export function FakePromise (executor) {
    if (!(this instanceof FakePromise)) {
        throw new Error("must use `new`");
    }
    try {
        executor(
            fulfillPromise.bind(this, this),
            rejectPromise.bind(this, this)
        );
    } catch (e) {
        rejectPromise(this, e);
    }
}

objectDefineProperties(FakePromise.prototype, {
    constructor: { value: FakePromise },

    _state: lazyProp("_state", function () { return STATE_PENDING; }),

    _result: lazyProp("_result", function () {}),

    _cb: lazyProp("_cb", function () {return [];}),

    then: {
        value(onFulfilled, onRejected) {
            const parentPromise = this;
            const thenPromise = new FakePromise(function() {
                nextTick(function () {
                    const resolve = function resolve() {
                        try {
                            if (parentPromise._state === STATE_FULFILLED) {
                                fulfillPromise(thenPromise, onFulfilled ? onFulfilled(parentPromise._result) : parentPromise._result);
                            }
                            else if (parentPromise._state === STATE_REJECTED) {
                                rejectPromise(thenPromise, onRejected ? onRejected(parentPromise._result) : parentPromise._result)
                            }
                        }
                        catch (e) {
                            rejectPromise(thenPromise, e);
                        }
                    };
                    if (parentPromise._state === STATE_PENDING) {
                        parentPromise._cb.push(resolve);
                    }
                    else {
                        resolve();
                    }
                });
            });
            return thenPromise;
        }
    },

    catch: {
        value(onRejected) {
            return this.then(undefined, onRejected);
        }
    }
});

objectDefineProperty(FakePromise, "resolve", {
    value(result) {
        return new FakePromise(resolve => {
            nextTick(() => resolve(result));
        });
    }
});

objectDefineProperty(FakePromise, "reject", {
    value(result) {
        return new FakePromise((resolve, reject) => {
            nextTick(() => reject(result));
        });
    }
});

objectDefineProperty(FakePromise, "all", {
    value(iterable) {
        const results = [];
        return iterable.reduce((priorPromise, value, idx) => {
            results[idx] = undefined;
            // Ensure a promise value
            if (!value || !value.then) {
                value = FakePromise.resolve(value);
            }
            return priorPromise.then(() => value.then(r => results[idx] = r));
        }, FakePromise.resolve()).then(() => results);
    }
});


function lazyProp(propName, valueCb) {
    const setup = { configurable: true };
    setup.get = setup.set = function() {
        objectDefineProperty(this, propName, { value: valueCb(), writable: true });
        if (arguments.length === 1) { // Setter was used?
            this[propName] = arguments[0];
        }
        return this[propName];
    };
    return setup;
}


function fulfillPromise(promise, result) {
    if (promise._state === STATE_PENDING) {
        // Result is a promise... Wait for it to resolve and then provide its value to this one.
        if (result && "function" === typeof result.then) {
            result.then(
                r => fulfillPromise(promise, r),
                e => rejectPromise(promise, e)
            );
            return;
        }

        promise._state = STATE_FULFILLED;
        promise._result = result;
        promise._cb.splice(0).forEach(cb => cb(result));
    }
}

function rejectPromise(promise, result) {
    if (promise._state === STATE_PENDING) {
        // Result is a promise... Wait for it to resolve and then provide its value to this one.
        if (result && "function" === typeof result.then) {
            result.then(
                r => fulfillPromise(promise, r),
                e => rejectPromise(promise, e)
            );
            return;
        }

        promise._state = STATE_REJECTED;
        promise._result = result;
        promise._cb.splice(0).forEach(cb => cb(result));
    }
}
