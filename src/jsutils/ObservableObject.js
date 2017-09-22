import Compose          from "./Compose"
import objectExtend     from "./objectExtend"
import dataStore        from "./dataStore"
import EventEmitter     from "./EventEmitter"
import nextTick         from "./nextTick"

//=======================================================
const PRIVATE                 = dataStore.create();

// aliases
const objectDefineProperty    = Object.defineProperty;
const objectHasOwnProperty    = Object.prototype.hasOwnProperty;

let dependeeList = [];

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
let ObservableObject = Compose.extend(/** @lends ObservableObject.prototype */{
    init(model, options) {
        if (model) {
            // FIXME: need to create prop with original getter/setters - or no?
            objectExtend(this, model);
        }

        const opt = objectExtend({}, this.getFactory().defaults, options);

        if (opt.watchAll) {
            Object.keys(this).forEach(propName => makePropWatchable(this, propName));
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
            makePropWatchable(this, prop);
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
            makePropWatchable(this, prop);
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
});

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
 * @param {ObservableObject} observable
 * @param {String} propName
 * @param {Function} [valueGetter]
 * @param {Function} [valueSetter]
 *
 */
function makePropWatchable(observable, propName, valueGetter, valueSetter){
    let inst            = getInstance.call(observable);
    let watched         = inst.watched;
    let currentValue, propDescriptor;

    if (watched[propName]){
        return;
    }

    propDescriptor = Object.getOwnPropertyDescriptor(observable, propName);

    if (propDescriptor) {
        if (propDescriptor.configurable === false) {
            // TODO: should we throw()?
            return;
        }

        valueGetter = valueGetter || propDescriptor.get;
        valueSetter = valueSetter || propDescriptor.set;

        if (!valueGetter) {
            currentValue = propDescriptor.value;
        }
    }

    // if we're able to remove the current property (ex. Constants would fail),
    // then change this attribute to be watched
    if (delete observable[propName]) {
        watched[propName] = {
            dependees: [],
            oldVal: currentValue,
            newVal: currentValue,
            queued: false,
            notify: function(delay){
                // Queue the notification if not yet done
                if (watched[propName].queued) {
                    return;
                }

                watched[propName].queued = true;

                const callListeners = function(){
                    watched[propName].queued = false;
                    inst.emit(propName, watched[propName].newVal, watched[propName].oldVal);
                    watched[propName].dependees.forEach(cb => cb.call(observable));
                };

                if (!delay) {
                    callListeners();
                    return;
                }

                nextTick(() => callListeners());
            }
        };

        objectDefineProperty(observable, propName, {
            enumerable:     true,
            configurable:   true,

            // Getter will either delegate to the prior getter(),
            // or return the value that was originally assigned to the property
            get: function(){
                // If there is a dependee listening for changes right now, then
                // store it for future notification
                if (dependeeList && dependeeList.length) {
                    dependeeList.forEach(dependeeCallback => {
                        if (watched[propName].dependees.indexOf(dependeeCallback) === -1) {
                            watched[propName].dependees.push(dependeeCallback);
                        }
                    });
                }

                return valueGetter ? valueGetter() : watched[propName].newVal;
            },

            // Setter is how we detect changes to the value.
            set: function(newValue){
                let oldValue = valueGetter ? valueGetter() : watched[propName].newVal;

                if (valueSetter) {
                    valueSetter.call(observable, newValue);

                } else {
                    watched[propName].oldVal = oldValue;
                    watched[propName].newVal = newValue;
                }

                // Dirty checking...
                // Only trigger if values are different. Also, only add a trigger
                // if one is not already queued.
                if (!watched[propName].queued && newValue !== oldValue) {
                    watched[propName].notify(true);
                }
            }
        });

    } else {
        try {
            console.log("ObservableObject(Error) Unable to watch property [" + propName + "] - delete failed");
        } catch(e){}
    }
}

/**
 * Created a computed property on a given object
 *
 * @method Observable.createComputed
 *
 * @param {Object} obj
 * @param {String} propName
 * @param {Function} valueGenerator
 */
function createComputed(obj, propName, valueGenerator) {
    if (obj && propName && valueGenerator) {
        let runValueGenerator = true;
        let value;
        let dependencyChangeNotifier = () => {
            value = null;
            runValueGenerator = true;
        };
        const addToDependeeList = () => {
            if (dependeeList.indexOf(addToDependeeList) === -1) {
                dependeeList.push(dependencyChangeNotifier);
            }
        };
        const removeFromDependeeList = () => {
            let index = dependeeList.indexOf(addToDependeeList);
            if (index !== -1) {
                dependeeList.splice(index, 1);
            }
        };

        makePropWatchable(obj, propName,
            // Getter
            () => {
                if (!runValueGenerator) {
                    return value;
                }

                runValueGenerator = false;
                addToDependeeList();

                try {
                    value = valueGenerator.call(obj);
                }
                catch(e) {
                    removeFromDependeeList();
                    throw e;
                }

                removeFromDependeeList();

                return value
            },

            // Setter
            () => {
                // FIXME: should we output to console?
            }
        );
    }
}


ObservableObject.createComputed = createComputed;


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

ObservableObject.defaults = {
    watchAll: true
};

export default ObservableObject;
