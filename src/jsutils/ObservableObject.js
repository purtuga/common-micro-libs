import Compose          from "./Compose"
import objectExtend     from "./objectExtend"
import dataStore        from "./dataStore"
import EventEmitter     from "./EventEmitter"
import nextTick         from "./nextTick"

//=======================================================
const PRIVATE               = dataStore.create();
const ARRAY_PROTOTYPE       = Array.prototype;
const OBJECT                = Object;
const INTERNAL_EVENTS       = EventEmitter.create();

const EV_STOP_DEPENDEE_NOTIFICATION = "1";

// aliases
const emitInternalEvent     = INTERNAL_EVENTS.emit.bind(INTERNAL_EVENTS);
const onInternalEvent       = INTERNAL_EVENTS.on.bind(INTERNAL_EVENTS);
const bindCallTo            = Function.call.bind.bind(Function.call);
const objectDefineProperty  = OBJECT.defineProperty;
const objectHasOwnProperty  = bindCallTo(OBJECT.prototype.hasOwnProperty);
const arrayIndexOf          = bindCallTo(ARRAY_PROTOTYPE.indexOf);
const arrayForEach          = bindCallTo(ARRAY_PROTOTYPE.forEach);
const arraySplice           = bindCallTo(ARRAY_PROTOTYPE.splice);
const objectKeys            = Object.keys;

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
const ObservableObject = Compose.extend(/** @lends ObservableObject.prototype */{
    init(model, options) {
        if (model) {
            // FIXME: need to create prop with original getter/setters - or no?
            objectExtend(this, model);
        }

        const opt = objectExtend({}, this.getFactory().defaults, options);

        if (opt.watchAll) {
            arrayForEach(objectKeys(this), propName => makePropWatchable(this, propName));
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
        if (objectHasOwnProperty(this, prop)) {
            return makePropWatchable(this, prop).on(prop, callback);
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
        return getInstance(this).off(prop, callback);
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
        if (objectHasOwnProperty(this, prop)) {
            return makePropWatchable(this, prop).once(prop, callback);
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
        var watched = getInstance(this).watched;
        if (watched[prop]) {
            watched[prop].notify(true);
        }
    },

    /**
     * Copies the properties of one or more objects into the current observable
     * and makes those properties "watchable".
     *
     * @param {...Object} args
     *
     * @returns {Object}
     */
    assign(...args) {
        return observableAssign(this, ...args);
    },

    /**
     * Sets a property on the observable object and automatically makes it watchable
     *
     * @param {String} propName
     * @param {*} [value]
     * @returns {*}
     */
    setProp(propName, value) {
        return setProp(this, propName, value);
    }
});

/**
 * Returns the private Instance data for this object
 *
 * @private
 * @param {Object} observableObj
 *
 * @return {EventEmitter}
 */
function getInstance(observableObj){
    if (!PRIVATE.has(observableObj)) {
        const instData = EventEmitter.create();
        const watched = instData.watched = {};

        PRIVATE.set(observableObj, instData);

        if (observableObj.onDestroy) {
            observableObj.onDestroy(function(){
                objectKeys(watched).forEach(propName => {
                    watched[propName].destroy();

                    // FIXME remove property getter/setter on the object (if still there)

                    delete watched[propName];
                });

                delete instData.watched;
                PRIVATE.delete(observableObj);
                instData.destroy();
            }.bind(observableObj));
        }
    }
    return PRIVATE.get(observableObj);
}

/**
 * A property setup
 *
 * @class Observable~PropertySetup
 * @extends Compose
 */
const PropertySetup = Compose.extend({
    init(observable, propName) {
        const dependees = this.dependees = [];
        this.propName = propName;
        this._obj = observable;

        const removeDependeeEvListener = onInternalEvent(EV_STOP_DEPENDEE_NOTIFICATION, cb => {
            const cbIndex = arrayIndexOf(dependees, cb);
            if (cbIndex !== -1) {
                arraySplice(dependees, cbIndex, 1);
            }
        });

        this.onDestroy(() => {
            arraySplice(this.dependees, 0);
            removeDependeeEvListener.off();
            this._obj = null;
        })
    },

    propName: "",

    /** @type Array */
    dependees: null,

    oldVal: null,

    newVal: null,

    queued: false,

    isComputed: false,

    /**
     * Notifies everyone that is listening for events on this property
     *
     * @param [noDelay=false]
     */
    notify(noDelay){
        const propSetup = this;

        // Queue the notification if not yet done
        if (propSetup.queued) {
            return;
        }

        propSetup.queued = true;

        const notifyListeners = () => {
            const {propName, _obj:observable} = this;
            propSetup.queued = false;
            getInstance(observable).emit(propName, propSetup.newVal, propSetup.oldVal);
            arrayForEach(this.dependees, cb => cb.call(observable, propName));
            propSetup.oldVal = null;
        };

        if (noDelay) {
            notifyListeners();
            return;
        }

        nextTick(() => notifyListeners());
    }
});

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
 * @return {EventEmitter}
 */
function makePropWatchable(observable, propName, valueGetter, valueSetter){
    let inst            = getInstance(observable);
    let watched         = inst.watched;
    let currentValue, propDescriptor;

    if (watched[propName]){
        return inst;
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
        const propSetup = watched[propName] = PropertySetup.create(observable, propName);
        const dependees = propSetup.dependees;

        propSetup.oldVal = propSetup.newVal = currentValue;

        objectDefineProperty(observable, propName, {
            enumerable:     true,
            configurable:   true,

            // Getter will either delegate to the prior getter(),
            // or return the value that was originally assigned to the property
            get: function(){
                // If there is a dependee listening for changes right now, then
                // store it for future notification
                if (dependeeList && dependeeList.length) {
                    arrayForEach(dependeeList, dependeeCallback => {
                        if (arrayIndexOf(dependees, dependeeCallback) === -1) {
                            dependees.push(dependeeCallback);
                        }
                    });
                }

                return valueGetter ? valueGetter() : propSetup.newVal;
            },

            // Setter is how we detect changes to the value.
            set: function(newValue){
                if (propSetup.isComputed) {
                    return; // TODO: should throw? or console.warn  ?
                }

                let oldValue = valueGetter ? valueGetter() : propSetup.newVal;

                if (valueSetter) {
                    valueSetter.call(observable, newValue);

                } else {
                    propSetup.oldVal = oldValue;
                    propSetup.newVal = newValue;
                }

                // Dirty checking...
                // Only trigger if values are different. Also, only add a trigger
                // if one is not already queued.
                if (!propSetup.queued && newValue !== oldValue) {
                    propSetup.notify();
                }
            }
        });

    } else {
        console.log(new Error("Unable to watch property [" + propName + "] - delete failed"));
    }

    return inst;
}

/**
 * Created a computed property on a given object
 *
 * @method Observable.createComputed
 *
 * @param {Object} observable
 * @param {String} propName
 * @param {Function} valueGenerator
 */
function createComputed(observable, propName, valueGenerator) {
    if (observable && propName && valueGenerator) {
        let runValueGenerator = true;
        let propValue;
        const dependencyChangeNotifier = () => {
            propValue = null;
            runValueGenerator = true;
            // Notify listeners to this property that value has changed
            getInstance(observable).watched[propName].notify();
        };
        const valueGetter = () => {
            // FIXME: should we detect circular loops?

            if (!runValueGenerator) {
                return propValue;
            }

            setDependencyTracker(dependencyChangeNotifier);

            try {
                propValue = valueGenerator.call(observable);
            }
            catch(e) {
                unsetDependencyTracker(dependencyChangeNotifier);
                throw e;
            }

            unsetDependencyTracker(dependencyChangeNotifier);
            runValueGenerator = false;
            return propValue;
        };

        const inst = makePropWatchable(observable, propName, valueGetter, () => {/* FIXME: should this log error? */});
        inst.watched[propName].isComputed = true;

        return Object.create({
            destroy() {
                if (!this.destroy.__done) {
                    this.destroy.__done = true;
                    stopDependeeNotifications(dependencyChangeNotifier);
                    inst.watched[propName].destroy();
                    delete inst.watched[propName];
                    delete observable[propName];
                    observable[propName] = propValue;
                }
            }
        });
    }
}

/**
 * Allows for adding a Dependee notifier to the global list of dependency trackers.
 *
 * @param {ObservableObject~dependeeNotifier} dependeeNotifier
 */
function setDependencyTracker(dependeeNotifier) {

    /**
     * A function that will be called when a dependency value changes
     *
     * @callback ObservableObject~dependeeNotifier
     * @param {String} propName
     *  The ObservableObject property that changed
     */

    if (dependeeNotifier && arrayIndexOf(dependeeList, dependeeNotifier) === -1) {
        dependeeList.push(dependeeNotifier);
    }
}

/**
 * Removes a Dependee notifier from the global list of dependency trackers.
 *
 * @param {ObservableObject~dependeeNotifier} dependeeNotifier
 */
function unsetDependencyTracker(dependeeNotifier) {
    if (!dependeeNotifier) {
        return;
    }
    const index = arrayIndexOf(dependeeList, dependeeNotifier);
    if (index !== -1) {
        arraySplice(dependeeList, index, 1);
    }
}

/**
 * Removes a Dependee notifier from any stored ObservableProperty list of dependees, thus
 * stopping all notifications to that depenedee.
 *
 * @param {ObservableObject~dependeeNotifier} dependeeNotifier
 */
function stopDependeeNotifications(dependeeNotifier) {
    if (dependeeNotifier) {
        emitInternalEvent(EV_STOP_DEPENDEE_NOTIFICATION, dependeeNotifier);
    }
}

/**
 * Sets a property on the Observable Object with the given value. Property will be
 * create or updated and be made "watchable"
 *
 * @param {Object} observable
 * @param {String} propName
 * @param {*} [value]
 *
 * @return {*}
 */
function setProp(observable, propName, value) {
    makePropWatchable(observable, propName);
    return observable[propName] = value;
}

/**
 * Assign the properties of one (or more) objects to the observable and
 * makes those properties "watchable"
 *
 * @param {Object} observable
 * @param {...Object} objs
 *
 * @return {Object} observable
 */
function observableAssign(observable, ...objs) {
    if (objs.length) {
        arrayForEach(objs, obj => {
            arrayForEach(objectKeys(obj), key => {
                observable[key] = obj[key];
                makePropWatchable(observable, key);
            });
        });
    }
    return observable;
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
        arrayForEach(objectKeys(ObservableObject.prototype), function(method){
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
