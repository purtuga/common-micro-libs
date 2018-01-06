import Set from "./es6-Set"

//===============================================
const callbacks = new Set();
let queue;

/**
 * Queue a callback to be executed after at the start of next event loop.
 * This differs from `nextTick` in that callbacks are not executed during
 * micro-processing, but rather on next event loop, so this is not ideal
 * for logic that can cause UI reflow.
 *
 * @param {Function} cb
 */
export function queueCallback(cb) {
    if ("function" === typeof cb) {
        callbacks.add(cb);

        if (!queue) {
            queue = setTimeout(flushQueue, 0);
        }
    }
}
export default queueCallback;

function flushQueue() {
    const cbList  = [...callbacks];
    callbacks.clear();
    queue = null;
    let cb;
    while (cb = cbList.shift()) {
        cb();
        cb = null;
    }
}
