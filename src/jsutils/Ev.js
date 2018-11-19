const LISTENER_STORAGE = Symbol("state");

/**
 * Supper tiny minimalist EventEmitter
 */
export class Ev {
    /**
     * Set an event listener
     * @param {String} evName
     * @param {Function} callback
     * @returns {EvOff}
     */
    on(evName, callback) {
        getStoreFor(this, evName).add(callback);
        /**
         * @typedef {Function} EvOff
         */
        return () => getStoreFor(this, evName).delete(callback);
    }

    /**
     * Emit an event
     * @param {String} evName
     * @param {*} data
     */
    emit(evName, data) {
        getStoreFor(this, evName).forEach(callback => callback(data));
    }

    /**
     * Clear the all the event listeners
     */
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