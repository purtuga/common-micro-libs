import objectExtend from "./objectExtend"
import dataStore from "./dataStore"
import queueCallback from "./queueCallback"

//=========================================================
const PRIVATE = dataStore.create();
const COMMON_DESTROY_METHOD_NAME = [
    "destroy",      // Compose
    "remove",       // DOM Events Listeners
    "off"           // EventEmitter Listeners
];

// return all KEYs of an object, even those that are not iterable
function objectKeys(prototype){
    let k, keys = [];
    for (k in prototype){
        keys.push(k);
    }
    return keys;
}

// Base instance methods for Compose'd object
const baseMethods = /** @lends Compose.prototype */{

    /**
     * Property indicating whether instance has been destroyed
     */
    isDestroyed: false,

    /**
     * instance initializing code
     */
    init(){},

    /**
     * Destroys the instance, by removing its private data.
     * Any attached `onDestroy` callback will be executed `async` - queued and
     * called on next event loop
     *
     * @param {Boolean} [executeCallbacksNow=false]
     */
    destroy(executeCallbacksNow){
        if (PRIVATE.has(this)) {
            let destroyCallbacks = PRIVATE.get(this);
            PRIVATE.delete(this);

            if (executeCallbacksNow) {
                destroyCallbacks.forEach(callOnDestroyCallback);
            }
            else {
                queueCallback(() => destroyCallbacks.forEach(callOnDestroyCallback));
            }
        }

        if ("boolean" === typeof this.isDestroyed) {
            this.isDestroyed = true;
        }
    },

    /**
     * Adds a callback to the queue to be called when this object's `.destroy()`
     * is called.
     *
     * @param {Function} callback
     */
    onDestroy(callback){
        getInstanceState(this).push(callback);
    },

    /**
     * Returns the factory for this instance.
     *
     * @return {Compose}
     */
    getFactory(){
        if (this.constructor) {
            return this.constructor;
        }
    }
};


const staticMethods = /** @lends Compose */{
    /**
     * Creates an new factory based on the prototye of the current Factory
     * and any other Factory given on input.
     *
     * @return {Compose}
     */
    extend: function(...args){
        let Class = class extends this {};

        objectExtend(Class.prototype, args.reduce(function(newProto, obj){
            if (obj) {
                const thisObjProto = (obj.prototype || obj);
                objectKeys(thisObjProto).forEach(function(objKey){
                    newProto[objKey] = thisObjProto[objKey];
                });
            }
            return newProto;
        }, {}));

        return Class;
    },

    /**
     * Checks if the Object given on input looks like an instance of this Factory.
     *
     * @return {Boolean}
     */
    isInstanceOf: function(instanceObj){

        if (!instanceObj) {
            return false;
        }

        var neededKeys = objectKeys(this.prototype);

        // If any prototype key is not in the object prototype, then return false
        return !neededKeys.some(function(protoKey){
            return typeof instanceObj[protoKey] === "undefined";
        });

    },

    /**
     * Creates an instance object based on this factory.
     *
     * @return {Object}
     */
    create: function(){
        return new this(...arguments);
    },

    /**
     * Returns a standard callback that can be used to remove cleanup instance state
     * from specific Store (WeakMap). Returned function will destroy known Instances
     * that have destroy methods.
     *
     * @param {Object} instanceState
     * @param {WeakMap} [stateStore]
     *
     * @return {Function}
     *
     * @example
     *
     * const MY_PRIVATE = new WeakMap();
     * cont NewWdg = Componse.extend({
     *      init() {
     *          const state = {};
     *          MY_PRIVATE.set(this, state);
     *          ...
     *
     *          this.onDestroy(Compose.getDestroyCallback(state, MY_PRIVATE));
     *      }
     * });
     */
    getDestroyCallback: getDestroyCallback
};


/**
 * Returns a standard callback that can be used to remove cleanup instance state
 * from specific Store (WeakMap). Returned function will destroy known Instances
 * that have destroy methods.
 *
 * @method Compose~getDestroyCallback
 *
 * @param {Object} instanceState
 * @param {WeakMap} [stateStore]
 *
 * @return {Function}
 *
 * @example
 *
 * const MY_PRIVATE = new WeakMap();
 * cont NewWdg = Componse.extend({
 *      init() {
 *          const state = {};
 *          MY_PRIVATE.set(this, state);
 *          ...
 *
 *          this.onDestroy(Compose.getDestroyCallback(state, MY_PRIVATE));
 *      }
 * });
 */
export function getDestroyCallback (instanceState, stateStore) {
    return () => {
        if (instanceState) {
            // Destroy all Compose object
            Object.keys(instanceState).forEach(function (prop) {
                if (instanceState[prop]) {
                    COMMON_DESTROY_METHOD_NAME.some((method) => {
                        if (
                            instanceState[prop][method] &&
                            (method !== "remove" || !(instanceState[prop] instanceof Node)) // Caution: should not remove DOM elements.
                        ) {
                            instanceState[prop][method]();
                            return true;
                        }
                    });

                    instanceState[prop] = undefined;
                }
            });
        }

        if (stateStore && stateStore.has && stateStore.has(instanceState)) {
            stateStore.delete(instanceState);
        }
    }
}

function getInstanceState(inst) {
    if (!PRIVATE.has(inst)) {
        PRIVATE.set(inst, []);
    }

    return PRIVATE.get(inst);
}

function callOnDestroyCallback (callback){
    if ("function" === typeof callback) {
        callback();
    }
}

function getNewConstructor () {
    function ComposeConstructor(...args) {
        // Called with `new`?
        if (this && this.constructor && this instanceof this.constructor) {
            return this.init(...args);
        }

        // called directly
        return new ComposeConstructor(...args);
    }

    ComposeConstructor.prototype.constructor = ComposeConstructor;
    return ComposeConstructor;
}

/**
 * Composes new factory methods from a list of given Objects/Classes.
 *
 * @class Compose
 * @borrows Compose~getDestroyCallback as Compose.getDestroyCallback
 *
 * @example
 *
 * var Widget = Compose.create(Model, Events);
 *
 * myWidget = Widget.create();
 *
 */
const Compose = getNewConstructor();
objectExtend(Compose.prototype, baseMethods);
objectExtend(Compose, staticMethods);

export default Compose;
export { Compose };
