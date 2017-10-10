import Compose          from "./Compose"
import objectExtend     from "./objectExtend"
import dataStore        from "./dataStore"
import EventEmitter     from "./EventEmitter"
import nextTick         from "./nextTick"

//=======================================================
const PRIVATE               = dataStore.create();
const ARRAY_PROTOTYPE       = Array.prototype;
const OBJECT                = Object;
const OBJECT_PROTOTYPE      = OBJECT.prototype;
const INTERNAL_EVENTS       = EventEmitter.create();
const IS_COMPUTED_NOTIFIER  = "__od_cn__";

const EV_STOP_DEPENDEE_NOTIFICATION = "1";

// aliases
const emitInternalEvent     = INTERNAL_EVENTS.emit.bind(INTERNAL_EVENTS);
const onInternalEvent       = INTERNAL_EVENTS.on.bind(INTERNAL_EVENTS);
const bindCallTo            = Function.call.bind.bind(Function.call);
const objectCreate          = OBJECT.create;
const objectDefineProperty  = OBJECT.defineProperty;
const objectHasOwnProperty  = bindCallTo(OBJECT_PROTOTYPE.hasOwnProperty);
const arrayIndexOf          = bindCallTo(ARRAY_PROTOTYPE.indexOf);
const arrayForEach          = bindCallTo(ARRAY_PROTOTYPE.forEach);
const arraySplice           = bindCallTo(ARRAY_PROTOTYPE.splice);
const objectKeys            = Object.keys;
const isPureObject          = o => o && OBJECT_PROTOTYPE.toString.call(o) === "[object Object]";
const noopEventListener     = objectCreate({ off() {} });

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
        const opt = objectExtend({}, this.getFactory().defaults, options);

        if (model) {
            // FIXME: need to create prop that uses original getter/setters from `model` - or no?
            objectExtend(this, model);

            if (opt.watchAll) {
                makeObservable(this, null, opt.deep);
            }

            getInstance(this).opt = opt;
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
        return watchObservableProp(this, prop, callback);
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
        unwatchObservableProp(this, prop, callback);
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
        return watchObservablePropOnce(this, prop, callback);
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
        makePropWatchable(this, propName);
        return this[propName] = value;
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

        instData.opt = objectExtend({}, ObservableObject.defaults);

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


const queueDependeeNotifier = (() => {
    const dependeeNotifiers = [];
    const execNotifiers     = () => arrayForEach(arraySplice(dependeeNotifiers, 0), notifierCb => notifierCb());

    return notifierCb => {
        if (!notifierCb || arrayIndexOf(dependeeNotifiers, notifierCb) !== -1) {
            return;
        }

        // Computed property notifiers are lightweight, so execute
        // these now and don't queue them.
        if (notifierCb[IS_COMPUTED_NOTIFIER]) {
            notifierCb();
            return;
        }

        const callNextTick = !dependeeNotifiers.length;
        dependeeNotifiers.push(notifierCb);

        if (callNextTick) {
            nextTick(execNotifiers);
        }
    };
})();

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

        // Queue up calling all dependee notifiers
        arrayForEach(this.dependees, cb => queueDependeeNotifier(cb));

        // If emitting of events for this property was already queued, exit
        if (propSetup.queued) {
            return;
        }

        propSetup.queued = true;

        const notifyListeners = () => {
            const {propName, _obj:observable} = this;
            propSetup.queued = false;
            getInstance(observable).emit(propName, propSetup.newVal, propSetup.oldVal);
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
                    newValue = valueSetter.call(observable, newValue);

                } else {
                    propSetup.oldVal = oldValue;
                    propSetup.newVal = newValue;
                }

                // Dirty checking...
                // Only trigger if values are different. Also, only add a trigger
                // if one is not already queued.
                if (newValue !== oldValue) {
                    if (inst.opt.deep && newValue && isPureObject(newValue)) {
                        makeObservable(newValue, null, true);
                    }

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
export function createComputed(observable, propName, valueGenerator) {
    if (observable && propName && valueGenerator) {
        let runValueGenerator = true;
        let propValue;
        const dependencyChangeNotifier = () => {
            // Trigger the Object property setter(). This does nothing as far as the
            // computed value does, but provides compatibility for any code that
            // might have overwritten the setter in order ot also listen for changes
            // outside of this lib.
            observable[propName] = "";

            // Reset the internally cached prop value and set the flag to run the
            // generator and then notify listeners.
            propValue = null;
            runValueGenerator = true;
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
        const valueSetter = () => {
            /* FIXME: should this anything? */
            return propValue;
        };

        dependencyChangeNotifier[IS_COMPUTED_NOTIFIER] = true;

        const inst = makePropWatchable(observable, propName, valueGetter, valueSetter);
        inst.watched[propName].isComputed = true;

        let isDestroyDone = false;
        const destroy = () => {
            if (!isDestroyDone) {
                isDestroyDone = true;
                stopDependeeNotifications(dependencyChangeNotifier);
                inst.watched[propName].destroy();
                delete inst.watched[propName];
                delete observable[propName];
                observable[propName] = propValue;
            }
        };
        return Object.create({ destroy });
    }
}

/**
 * Allows for adding a Dependee notifier to the global list of dependency trackers.
 *
 * @param {Function} dependeeNotifier
 */
export function setDependencyTracker(dependeeNotifier) {
    if (dependeeNotifier && arrayIndexOf(dependeeList, dependeeNotifier) === -1) {
        dependeeList.push(dependeeNotifier);
    }
}

/**
 * Removes a Dependee notifier from the global list of dependency trackers.
 *
 * @param {Function} dependeeNotifier
 */
export function unsetDependencyTracker(dependeeNotifier) {
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
 * @param {Function} dependeeNotifier
 */
export function stopDependeeNotifications(dependeeNotifier) {
    if (dependeeNotifier) {
        emitInternalEvent(EV_STOP_DEPENDEE_NOTIFICATION, dependeeNotifier);
    }
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
export function observableAssign(observable, ...objs) {
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

/**
 * Makes an Object observable or a given property of the object observable.
 *
 * @param {Object} observable
 *  The object that should be made observable.
 *
 * @param {String} [propName]
 *  if left unset, then all existing `own properties` of the object will
 *  be made observable.
 *
 * @param {Boolean} [deep=false]
 *  If set to `true` then the object, or the value the given `prop` (if defined)
 *  will be "walked" and any object found made an observable as well.
 */
export function makeObservable(observable, propName, deep) {
    if (observable) {
        if (propName) {
            makePropWatchable(observable, propName);
        }
        else {
            arrayForEach(objectKeys(observable), prop => makePropWatchable(observable, prop));
        }

        if (deep) {
            arrayForEach(objectKeys(observable), key => {
                if (observable[key] && isPureObject(observable[key])) {
                    makeObservable(observable[key], null, deep);
                }
            });
        }
    }
}

/**
 *
 * @param {Object} observable
 * @param {String} propName
 * @param {Function} notifier
 * @returns {EventEmitter#EventListener}
 */
export function watchObservableProp(observable, propName, notifier) {
    if (objectHasOwnProperty(observable, propName)) {
        return makePropWatchable(observable, propName).on(propName, notifier);
    }
    else {
        return noopEventListener;
    }
}

/**
 * Watch for changes on a given object property.
 *
 * @param {Object} observable
 * @param {String} propName
 * @param {Function} notifier
 * @returns {EventEmitter#EventListener}
 */
export function watchObservablePropOnce(observable, propName, notifier) {
    if (objectHasOwnProperty(observable, propName)) {
        return makePropWatchable(observable, propName).once(propName, notifier);
    }
    else {
        return noopEventListener;
    }
}

/**
 * Stop watching an object property.
 *
 * @param {Object} observable
 * @param {String} propName
 * @param {Function} notifier
 */
export function unwatchObservableProp(observable, propName, notifier) {
    return getInstance(observable).off(propName, notifier);
}


/**
 * Adds ObservableObject capabilities to an object.
 *
 * @method ObservableObject.mixin
 *
 * @param {Object} observable
 *
 * @return {Object}
 *  Same object that was given on input will be returned
 */
export function observableMixin(observable) {
    if (observable) {
        arrayForEach(objectKeys(ObservableObject.prototype), function(method){
            if (!(method in observable) || observable[method] !== ObservableObject.prototype[method]) {
                objectDefineProperty(observable, method, {
                    value:          ObservableObject.prototype[method],
                    enumerable:     false,
                    configurable:   true
                });
            }
        });
    }
    return observable;
}


ObservableObject.createComputed = createComputed;
ObservableObject.mixin = observableMixin;

ObservableObject.defaults = {
    watchAll:   true,
    deep:       true
};

export default ObservableObject;
