import {consoleError} from "./runtime-aliases.js";

//======================================================================
const PRIVATE = new WeakMap();

/**
 * A base class
 */
export class BaseClass {
    constructor(){
        if (this.init) { // for backwards compatibility
            this.init(...arguments);
        }
    }

    /**
     * Add a callback to be executed when `.destroy()` is executed
     *
     * @param {FUnction} callback
     */
    onDestroy(callback) {
        if (!PRIVATE.has(this)) {
            PRIVATE.set(this, new Set());
        }
        PRIVATE.get(this).add(callback);
    }

    /**
     * Run destroy logic, which by default is to run all callbacks stored via `.onDestroy()`
     */
    destroy() {
        const callbackList = PRIVATE.get(this);
        if (callbackList) {
            callbackList.forEach(callback => {
                try {
                    callback();
                } catch (e) {
                    consoleError(e);
                }
            });
            callbackList.clear();
        }
    }
}