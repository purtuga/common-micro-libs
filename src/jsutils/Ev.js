const LISTENER_STORAGE = Symbol("state");

/**
 * Supper tiny minimalist EventEmitter
 * @implements MinimalEventEmitter
 */
export class Ev {
    on(evName, callback) {
        getStoreFor(this, evName).add(callback);
        /**
         * @typedef {Function} EvOff
         */
        return () => getStoreFor(this, evName).delete(callback);
    }

    emit(evName, data) {
        getStoreFor(this, evName).forEach(callback => callback(data));
    }

    clear() {
        getStoreFor(this).clear();
    }
}

/**
 * @private
 * @return {Map|Set}
 *  If called with no `evName`, then the entire store is returned (a `Map`)
 */
function getStoreFor(inst, evName) {
    if (!inst[LISTENER_STORAGE]) {
        inst[LISTENER_STORAGE] = new Map();
    }
    if (!evName) {
        return inst[LISTENER_STORAGE];
    }
    if (!inst[LISTENER_STORAGE].has(evName)) {
        inst[LISTENER_STORAGE].set(evName, new Set());
    }
    return inst[LISTENER_STORAGE].get(evName);
}


/**
 * Minimal EventEmitter interface provinding only the basics
 *
 * @interface MinimalEventEmitter
 */

/**
 * Set an event listener
 * @function
 * @name MinimalEventEmitter#on
 * @param {String} evName
 * @param {Function} callback
 * @returns {EvOff}
 */

/**
 * Emit an event
 *
 * @function
 * @name MinimalEventEmitter#emit
 * @param {String} evName
 * @param {*} data
 */

/**
 * Clear the all the event listeners
 * @function
 * @name MinimalEventEmitter#clear
 */