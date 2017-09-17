import Compose          from "./Compose"
import objectExtend     from "./objectExtend"
import dataStore        from "./dataStore"
import EventEmitter     from "./EventEmitter"

//=======================================================
const PRIVATE                 = dataStore.create();
const GLOBAL_NOTIFY_DELAY     = 10;

const objectDefineProperty    = Object.defineProperty;
const objectHasOwnProperty    = Object.prototype.hasOwnProperty;

/**
 * Adds the ability to observe `Object` property values for changes.
 * Uses an internal `EventEmitter` instance to list and trigger events,
 * and `Object.defineProperty` getter/setters to setup watchers on
 * property values.
 *
 * Currently has no support for addition or deletion from the object,
 * but with the ES7 forth coming Proxy functionality, that will be
 * added.
 *
 * @class ObservableObject
 * @extends Compose
 *
 * @example
 *
 * // Used as a mixin
 * var myObj = {
 *      first: "paul",
 *      last: "tavares"
 * };
 *
 * ObservableObject.mixin(myObj);
 *
 * myObj.on("first", function(newValue, oldValue){
 *      alert("first name was changed");
 * });
 *
 * @example
 *
 * // Used as part of a class prototype
 * var MyModel = Compose.extend(ObservableObject);
 *
 * var user = MyModel.create({
 *      first: "paul",
 *      last: "tavares"
 * });
 *
 * user.on("first", function(newValue, oldValue){
 *  alert("first name was change")
 * });
 *
 */
let ObservableObject = /** @lends ObservableObject.prototype */{
    init(model) {
        if (model) {
            objectExtend(this, model);
        }
    },

    /**
     * Add a callback to changes on a given property
     *
     * @param {String} prop
     *  Object property name
     *
     * @param {Function} callback
     *  A callback function to list to the event. The callback function
     *  can cancel any queued event callbacks by returning `true` (boolean).
     *
     * @return {EventListener}
     */
    on: function(prop, callback){
        if (objectHasOwnProperty.call(this, prop)) {
            watchProp.call(this, prop);
            return getInstance.call(this).on(prop, callback);
        }
    },

    /**
     * Remove a callback the listening queue of a for a given property name
     *
     * @param {String} prop
     *  Object property name
     *
     * @param {Function} callback
     *  The callback that should be removed.
     */
    off: function(prop, callback){
        var inst = getInstance.call(this);
        if (inst[prop]) {
            return inst.off(prop, callback);
        }
    },

    /**
     * Add a callback for changes on a given property that is called only once
     *
     * @param {String} prop
     *  Object property name
     *
     * @param {Function} callback
     *  The callback that should be removed.
     */
    once: function(prop, callback){
        if (objectHasOwnProperty.call(this, prop)) {
            watchProp.call(this, prop);
            return getInstance.call(this).once(prop, callback);
        }
    },

    /**
     * Emit an event and execute any callback listening. Any of the listening
     * events can cancel the calling of queued callbacks by returning `true`
     * (boolean)
     *
     * @param {String} prop
     */
    emit: function(prop){
        var watched = getInstance.call(this).watched;
        if (watched[prop]) {
            watched[prop].notify();
        }
    }
};

/**
 * Returns the private Instance data for this object
 *
 * @private
 * @this ObservableObject
 *
 * @return {EventEmitter}
 */
function getInstance(){
    if (!PRIVATE.has(this)) {
        var instData = EventEmitter.create();
        instData.watched = {};

        PRIVATE.set(this, instData);

        if (this.onDestroy) {
            this.onDestroy(function(){
                delete instData.watched;
                PRIVATE.delete(this);
                instData.destroy();
            }.bind(this));
        }
    }
    return PRIVATE.get(this);
}

/**
 * Checks to see if a given property on this object already has a watcher
 * and if not, it sets one up for it.
 *
 * @private
 * @this ObservableObject
 *
 * @param {String} prop
 */
function watchProp(prop){
    let observable      = this;
    let inst            = getInstance.call(observable);
    let watched         = inst.watched;
    let eventRunning    = false;
    let currentValue, propDescriptor, priorGetter, priorSetter;

    if (!watched[prop]){
        propDescriptor = Object.getOwnPropertyDescriptor(observable, prop);

        if (propDescriptor) {
            if (propDescriptor.configurable === false) {
                return;
            }
            priorGetter = propDescriptor.get;
            priorSetter = propDescriptor.set;
        }

        currentValue = this[prop];

        // if we're able to remove the current property (ex. Constants would fail),
        // then change this attribute to be watched
        if (delete this[prop]) {
            watched[prop] = {
                oldVal: currentValue,
                newVal: currentValue,
                queued: null,
                notify: function(delay){
                    // Trigger event, but only if this update was not a
                    // result of an earlier event trigger to this same prop.
                    if (eventRunning) {
                        return;
                    }

                    eventRunning = true;

                    var callListeners = function(){
                        inst.emit(prop, watched[prop].newVal, watched[prop].oldVal);
                        watched[prop].queued = null;
                        eventRunning = false;
                    };

                    if (delay === undefined) {
                        callListeners();
                        return;
                    }

                    watched[prop].queued = setTimeout(callListeners, GLOBAL_NOTIFY_DELAY);
                }
            };

            currentValue = undefined;

            objectDefineProperty(this, prop, {
                enumerable:     true,
                configurable:   true,

                get: function(){
                    return priorGetter ? priorGetter() : watched[prop].newVal;
                },

                set: function(newValue){
                    let oldValue = priorGetter ? priorGetter() : watched[prop].newVal;

                    if (priorSetter) {
                        priorSetter.call(observable, newValue);

                    } else {
                        watched[prop].oldVal = oldValue;
                        watched[prop].newVal = newValue;
                    }

                    // Dirty checking...
                    // Only trigger if values are different. Also, only add a trigger
                    // if one is not already queued.
                    if (!watched[prop].queued && newValue !== oldValue) {
                        watched[prop].notify(20);
                    }
                }
            });

        } else {
            try {
                console.log("ObservableObject(Error) Unable to watch property [" + prop + "]");
            } catch(e){}
        }
    }
}

ObservableObject = Compose.extend(ObservableObject);

/**
 * Adds ObservableObject capabilities to an object.
 *
 * @method ObservableObject.mixin
 *
 * @param {Object} obj
 *
 * @return {Object}
 *  Same object that was given on input will be returned
 */
ObservableObject.mixin = function(obj){
    if (obj) {
        Object.keys(ObservableObject.prototype).forEach(function(method){
            if (!(method in obj) || obj[method] !== ObservableObject.prototype[method]) {
                objectDefineProperty(obj, method, {
                    value:          ObservableObject.prototype[method],
                    enumerable:     false,
                    configurable:   true
                });
            }
        });
    }
    return obj;
};

export default ObservableObject;
