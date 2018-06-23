import {WeakMap} from "./WeakMap";

/**
 * Returns an object that contains an initialized WeakMap (`stash` property)
 * where data can be stored.
 *
 * @namespace dataStore
 *
 */
var dataStore = /** @lends dataStore */{
    /**
     * Stash data here.
     * @type WeakMap
     */
    stash:  new WeakMap(),
    /**
     * Create a private data store and return it.
     * @return {WeakMap}
     */
    create: function(){
        return new WeakMap();
    }
};

export default dataStore;
export { dataStore };
