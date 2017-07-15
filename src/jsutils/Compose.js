import objectExtend from "./objectExtend"
import dataStore    from "./dataStore"

/**
 * Composes new factory methods from a list of given Objects/Classes.
 *
 * @class Compose
 *
 * @example
 *
 * var Widget = Compose.create(Model, Events);
 *
 * myWidget = Widget.create();
 *
 */


// return all KEYs of an object, even those that are not iterable
function objectKeys(prototype){
    var k, keys = [];
    for (k in prototype){
        keys.push(k);
    }
    return keys;
}

var objectCreate        = Object.create;
var objectDefineProp    = Object.defineProperty;
var instData            = dataStore.stash;

// Base instance methods for Compose'd object
var baseMethods = /** @lends Compose.prototype */{

    /**
     * Property indicating whether instance has been destroyed
     */
    isDestroyed: false,

    /**
     * instance initializing code
     */
    init: function(){},

    /**
     * Destroys the instance, by removing its private data.
     */
    destroy:    function(){
        var
            hasCallbacks = this.__onDestroy,
            onDestroyCallbacks;

        if (hasCallbacks) {
            onDestroyCallbacks = instData.get(hasCallbacks);

            if (Array.isArray(onDestroyCallbacks)) {
                onDestroyCallbacks.forEach(function(callback, i){
                    if ("function" === typeof callback) {
                        callback();
                    }
                    onDestroyCallbacks[i] = null;
                });
            }
            instData["delete"](hasCallbacks);
        }

        instData["delete"](this);
        this.isDestroyed = true;
    },

    /**
     * Adds a callback to the queue to be called when this object's `.destroy()`
     * is called.
     *
     * @param {Function} callback
     */
    onDestroy: function(callback){
        if (!this.__onDestroy) {
            objectDefineProp(this, "__onDestroy", {value: function(){}});
        }

        if ("function" === typeof callback) {
            var
                key                 = this.__onDestroy,
                onDestroyCallbacks  = instData.get(key);

            if (!onDestroyCallbacks) {
                onDestroyCallbacks = [];
                instData.set(key, onDestroyCallbacks);
            }
            onDestroyCallbacks.push(callback);
        }
    },

    /**
     * Returns the factory for this instance.
     *
     * @return {Compose}
     */
    getFactory: function(){} // set by .extend()
};

var staticMethods = /** @lends Compose */{

    /**
     * Creates an new factory based on the prototye of the current Factory
     * and any other Factory given on input.
     *
     * @return {Compose}
     */
    extend: function(){
        var args    = Array.prototype.slice.call(arguments);
        var Factory = function(){};

        Factory.prototype = args.reduce(function(newProto, obj){
            if (obj) {
                var thisObjProto = (obj.prototype || obj);
                objectKeys(thisObjProto).forEach(function(objKey){
                    newProto[objKey] = thisObjProto[objKey];
                });
            }
            return newProto;
        }, objectCreate(this.prototype));

        // Add a method to the Factory prototype that allows retrieval of
        // factory static properties.
        Factory.prototype.getFactory = function(){
            return Factory;
        };

        // Extend new factory with statics from this factory
        return objectExtend(true, Factory, this);
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
        var instance = objectCreate(this.prototype);
        if (instance.init) {
            instance.init.apply(instance, arguments);
        }
        return instance;
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
    getDestroyCallback(instanceState, stateStore) {
        return () => {
            if (instanceState) {
                // Destroy all Compose object
                Object.keys(instanceState).forEach(function (prop) {
                    if (instanceState[prop]) {
                        [
                            "destroy",      // Compose
                            "remove",       // DOM Events Listeners
                            "off"           // EventEmitter Listeners
                        ].some((method) => {
                            if (instanceState[prop][method]) {
                                instanceState[prop][method]();
                                return true;
                            }
                        });

                        instanceState[prop] = undefined;
                    }
                });
            }

            if (stateStore && stateStore.has && stateStore.has(instanceState)) {
                stateStore['delete'](instanceState);
            }
        }
    }
};

var Compose = function(){};

Compose.prototype = objectCreate(baseMethods);
objectExtend(Compose, staticMethods);

export default Compose;
