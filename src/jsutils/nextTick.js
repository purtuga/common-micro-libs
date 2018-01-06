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
        return function _nextTick(fn) {
            resolved.then(fn).catch(e => console.log(e));
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

    return function _nextTick(fn) {
        immediates.push(fn);
        if (!processing) {
            processing = true;
            processPending();
        }
    };
})();

export default nextTick;
export { nextTick };
