/* global setImediate:true */
let reIsNativeCode = /native code/i;

/**
 * Executes a function at the end of the current event Loop - during micro-task processing
 *
 * @param {Function} callback
 */
let nextTick = (function(){
    if (typeof setImediate !== "undefined" && reIsNativeCode.test(setImediate.toString())) {
        return setImediate;
    }

    // Native Promsie? Use it.
    if (typeof Promise === 'function' && reIsNativeCode.test(Promise.toString())) {
        let resolved = Promise.resolve();
        return function _nextTickPromise(fn) {
            resolved.then(fn).catch(e => console.error(e)); // eslint-disable-line
        };
    }

    // fallback to setTimeout
    // From: https://bugzilla.mozilla.org/show_bug.cgi?id=686201#c68
    let immediates = [];
    let processing = false;

    function processPending() {
        setTimeout(function() {
            immediates.shift()();
            if (immediates.length) {
                processPending();
            } else {
                processing = false;
            }
        }, 0);
    }

    return function _nextTickSetTimeout(fn) {
        immediates.push(fn);
        if (!processing) {
            processing = true;
            processPending();
        }
    };
})();

let isQueued = false;
const queuedCallbacks = new Set();
let i, t;
const flushQueue = () => {
    const callbacks = [ ...queuedCallbacks ];
    queuedCallbacks.clear();
    isQueued = false;
    for (i = 0, t = callbacks.length; i < t; i++) {
        callbacks[i]();
    }
};

/**
 * Queues a callback to be executed on nextTick. Unlike calling `nextTick` directly
 * `queue()` will ensure that the same callback is not executed more than once when
 * `nextTick` runs.
 *
 * @param {Function} callback
 */
function queueForNextTick(callback) {
    queuedCallbacks.add(callback);
    if (!isQueued) {
        isQueued = true;
        nextTick(flushQueue);
    }
}

/**
 * Queue a callback for next tick
 * @type {queueForNextTick}
 */
nextTick.queue = queueForNextTick;

//-----------------------------------------------------------[ EXPORTS ]---
export default nextTick;
export {
    nextTick,
    queueForNextTick
}
