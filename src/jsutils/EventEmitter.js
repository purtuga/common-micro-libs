import Compose from "./Compose";
import dataStore from "./dataStore";
import Set from "./es6-Set";

//----------------------------------------------------------------
const PRIVATE           = dataStore.create();
const arraySlice        = Function.call.bind(Array.prototype.slice);
const isFunction        = function(fn){return typeof fn === "function";};
const objectKeys        = Object.keys;

/**
 * Emits events. Use it to extend other modules and thus add events to them.
 *
 * @class EventEmitter
 * @extends Compose
 */
const EventEmitter = Compose.extend(/** @lends EventEmitter.prototype */{
    /**
     * Add a callback to a given event name
     *
     * @param {String} evName
     *  The event name to be listened to or a list of event sperated by a space.
     *  The EventEmitter instance can be used as the `evName` as well which will
     *  essentially listen to all events.
     *  Note that this special event however, will change the arguments
     *  passed to the callback by pre-pending the Event Name (`String`) and
     *  appending the Component instance.
     *
     * @param {Function} callback
     *  A callback function to listen to the event. The callback function
     *  can cancel any queued event callbacks by returning `true` (boolean).
     *
     * @return {EventEmitter#EventListener}
     *
     * @example
     *
     * events.on("some-event", (...args) => {});
     *
     * // List to all events
     * events.on(events, (evNameTriggered, ...args) => {}
     */
    on: function(evName, callback){
        let { all, listeners }  = getSetup.call(this);
        let events              = getEventNameList(evName).reduce((eventList, eventName) => {
            let off;

            // If eventName is `this` then listen to all events
            if (eventName === this) {
                all.add(callback);
                off = () => all.delete(callback);
            }
            else {
                if (!(eventName in listeners)) {
                    listeners[eventName] = new Set();
                }

                listeners[eventName].add(callback);
                off = () => listeners[eventName].delete(callback);
            }

            eventList[eventName] = { off };
            return eventList;
        }, {});
        /**
         * EventEmitter Listener object, returned when one of the listener setter methods
         * (ex. `on()`, `once()`, `pipe`) are used.
         *
         * @typedef {Object} EventEmitter~EventListener
         *
         * @property {Object} listeners
         *  An object with the individual listeners. Each respective event listener
         *  has an `off()` method to turn that listener off.
         *
         * @property {Function} off
         *  Remove callback from event.
         */
        let response = {
            off: function(){
                objectKeys(events).forEach(eventName => events[eventName].off());
            }
        };

        response.listeners = events;
        return response;
    },

    /**
     * Remove a callback from a given event
     *
     * @param {String} evName
     * @param {Function} callback
     *
     */
    off: function(evName, callback){
        const { all, listeners } = getSetup.call(this);

        if (evName === this) {
            all.delete(callback);
            return;
        }

        if (listeners[evName]) {
            listeners.delete(callback);
        }
    },

    /**
     * Add a callback to a given event name that is executed only once.
     *
     * @param {String} evName
     *  The event name. This can be a list of event delimited with a space. Each
     *  event listeners will be triggered at most once.
     * @param {Function} callback
     *
     * @return {EventEmitter#EventListener}
     */
    once: function(evName, callback){
        let events = getEventNameList(evName).reduce((eventListeners, eventName) => {
            let eventNameListener = this.on(evName, function(...args){
                eventNameListener.off();
                callback(...args);
            });

            eventListeners[eventName] = eventNameListener;
            return eventListeners;
        }, {});

        let response = {
            off: function(){
                objectKeys(events).forEach(eventName => events[eventName].off());
            }
        };

        response.listeners = events;
        return response;
    },

    /**
     * Emit an event and execute any callback listening. Any of the listening
     * events can cancel the calling of queued callbacks by returning `true`
     * (boolean)
     *
     * @param {String} evName
     *  The event name to be triggered. __NOTE__: can not be a `"*"` or the EventEmitter
     *  instance since they holds special meaning.
     *
     * @param {...*} callbackArgs
     */
    emit: function(evName){
        if (evName === "*" || evName === this) {
            console.log("EventEmitter#emit(): can not emit to events to '*'"); // jshint ignore:line
            return;
        }

        let setup           = getSetup.call(this);
        let eventListeners  = setup.listeners;
        let eventPipes      = setup.pipes;
        let eventAll        = setup.all;
        let args            = arraySlice(arguments, 1);
        let isCanceled      = false;
        let callbackHandler = function(callback){
            if (isFunction(callback)) {
                var response = callback.apply(callback, args);

                // if a boolean true was returned, don't call any more listeners.
                if (response === true) {
                    isCanceled = true;
                    return true;
                }
            }
        };

        // Regular event listeners
        if (eventListeners[evName] && eventListeners[evName].size) {
            for (let cb of eventListeners[evName]) {
                if (callbackHandler(cb)) {
                    break;
                }
            }
        }

        // Event listeners for all events
        if (
            !isCanceled &&
            (
                "*" in eventListeners ||
                eventAll.size
            )
        ) {
            // Special event "*": pass event name and instance
            args = arraySlice(arguments, 0);
            args.push(this);

            if (eventListeners["*"] && eventListeners["*"].size) {
                for (let cb of eventListeners["*"]) {
                    if (callbackHandler(cb)) {
                        break;
                    }
                }
            }

            if (eventAll.size) {
                for (let cb of eventAll) {
                    if (callbackHandler(cb)) {
                        break;
                    }
                }
            }

            // set args back to original
            args = arraySlice(arguments, 1);
        }

        if (eventPipes.size) {
            for (let pipe of eventPipes) {
                pipe && pipe(evName, args);
            }
        }
    },

    /**
     * Emit the events from one instance of EventEmitter to another. Useful
     * for when multiple components are used together as part of a larger
     * component and have the need to emit events to a common EventEmitter.
     *
     * @param {EventEmitter} pipeTo
     *  The EventEmitter instance object to where events should be piped.
     *
     * @param {String} [prefix]
     *  If defined, prefix will be added to any event emited. Example:
     *  if defining `foo-` as the prefix, then every event emitted will
     *  prefixed wth this value. So a `click` event on the source will
     *  be piped as `foo-click`.
     *
     * @param {Boolean} [includeInstance=true]
     *  When set to `true` (default), the piped event will include the source
     *  instance as an additional argument to the event that is piped.
     *
     *  @return {EventListener}
     */
    pipe: function(pipeTo, prefix, includeInstance){
        if (!pipeTo || !pipeTo.on) {
            return { off: function(){} };
        }

        const pipes = getSetup.call(this).pipes;

        const pipeEvToReceiver = (triggeredEvName, args) => {
            if (prefix) {
                args.unshift(prefix + triggeredEvName);

            } else {
                args.unshift(triggeredEvName);
            }

            if (includeInstance || typeof includeInstance === "undefined") {
                args.push(this);
            }

            pipeTo.emit.apply(pipeTo, args);
        };

        pipes.add(pipeEvToReceiver);

        return {
            off() {
                pipes.delete(pipeEvToReceiver);
            }
        };
    },

    /**
     * Returns a boolean indicating if the current EventEmitter has listener
     * @returns {Boolean}
     */
    hasListeners() {
        const { listeners, pipes } = getSetup.call(this);
        return objectKeys(listeners).some(evName => !!listeners[evName].size) || !!pipes.size;
    }
});

/**
 * Returns the instance setup object. Creates it if it does not have one.
 * @private
 * @this EventEmitter
 */
function getSetup(){
    if (!PRIVATE.has(this)) {
        /*
            listeners: {
                'evName': Set[ Callbacks ]
            },
            pipes: Set[ Callbacks ]
            all: Set[ Callbacks ]
        */
        PRIVATE.set(this, {
            listeners:  {},
            pipes:      new Set(),
            all:        new Set()
        });

        // When this object is destroyed, remove all data
        if (this.onDestroy) {
            this.onDestroy(function(){
                if (PRIVATE.has(this)) {
                    PRIVATE['delete'](this); // using ['delete'] because of IE
                }
            }.bind(this));
        }
    }
    return PRIVATE.get(this);
}

function getEventNameList(eventNamesStr) {
    if ("string" === typeof eventNamesStr) {
        return eventNamesStr.split(/\s+/);
    }
    return [eventNamesStr];
}

/**
 * Adds event emitter functionality to an object
 *
 * @param {Object} target
 */
EventEmitter.mixin = function (target) {
    if (target) {
        ["on", "off", "emit", "once", "pipe"].forEach(method => {
            Object.defineProperty(target, method, {
                configurable: true,
                value: EventEmitter.prototype[method].bind(target)
            });
        });
    }
};

export default EventEmitter;
