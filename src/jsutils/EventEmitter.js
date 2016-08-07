import Compose   from "./Compose"
import dataStore from "./dataStore"


var PRIVATE     = dataStore.create()
var arraySlice  = Array.prototype.slice;
var isFunction  = function(fn){return typeof fn === "function";};

/**
 * Emits events. Use it to extend other modules and thus add events to them.
 *
 * @class EventEmitter
 * @extends Compose
 *
 */
var EventEmitter = /** @lends EventEmitter.prototype */{
    /**
     * Add a callback to a given event name
     *
     * @param {String} evName
     *  The event name to be listened to. A `"*"` can be defined  as well
     *  which will essentially listen to all events. Note that this special
     *  event however, will change the arguments passed to the callback by
     *  pre-pending the Event Name (`String`) and appending the
     *  Component instance.
     *
     * @param {Function} callback
     *  A callback function to listen to the event. The callback function
     *  can cancel any queued event callbacks by returning `true` (boolean).
     *
     * @return {EventListener}
     */
    on: function(evName, callback){
        var listeners = getSetup.call(this).listeners,
            callbackIndex;

        if (!(evName in listeners)) {
            listeners[evName] = [];
        }

        listeners[evName].push(callback);
        callbackIndex = listeners[evName].length - 1;

        /**
         * Event Listener
         *
         * @typedef {Object} EventListener
         *
         * @property {Function} off
         *  Remove callback from event.
         */
        return Object.create({
            off: function(){
                listeners[evName][callbackIndex] = null;
            }
        });
    },

    /**
     * Remove a callback from a given event
     *
     * @param {String} evName
     * @param {Function} callback
     *
     */
    off: function(evName, callback){
        var listeners = getSetup.call(this).listeners;

        if (evName in listeners) {
            listeners[evName].some(function(thisCallback, index){
                if (thisCallback === callback) {
                    listeners[evName][index] = null;
                    return true;
                }
            });
        }
    },

    /**
     * Add a callback to a given event name that is executed only once.
     *
     * @param {String} evName
     * @param {Function} callback
     *
     * @return {EventListener}
     */
    once: function(evName, callback){
        var eventListener   = this.on(evName, function(){
            eventListener.off();
            callback.apply(callback, arguments);
        });
        return eventListener;
    },

    /**
     * Emit an event and execute any callback listening. Any of the listening
     * events can cancel the calling of queued callbacks by returning `true`
     * (boolean)
     *
     * @param {String} evName
     *  The event name to be triggered. __NOTE__: can not be a `"*"` since it
     *  holds special meaning.
     *
     * @param {...Function} callbackArgs
     */
    emit: function(evName){
        if (evName === "*") {
            try { console.warning("EventEmitter#emit(): can not emit to events to '*'"); } catch(e){} // jshint ignore:line
            return;
        }

        var
        setup           = getSetup.call(this),
        eventListeners  = setup.listeners,
        eventPipes      = setup.pipes,
        args            = arraySlice.call(arguments, 1),
        isCanceled      = false,
        callbackHandler = function(callback){
            if (isFunction(callback)) {
                var response = callback.apply(callback, args);

                // if a boolean true was returned, don't call any more
                // listeners.
                if (response && typeof response === "boolean") {
                    isCanceled = true;
                    return true;
                }
            }
        };

        if (evName in eventListeners || "*" in eventListeners) {
            // Regular event listeners
            (eventListeners[evName] || []).some(callbackHandler);

            if (!isCanceled) {
                // Special event "*": pass event name and instance
                args = arraySlice.call(arguments, 0);
                args.push(this);

                (eventListeners["*"] || []).some(callbackHandler);

                // set args back to original
                args = arraySlice.call(arguments, 1);
            }
        }

        eventPipes.forEach(function(pipe){
            if (isFunction(pipe)) {
                pipe(evName, args);
            }
        });
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
            return null;
        }
        var pipes = getSetup.call(this).pipes,
            callbackIndex;

        pipes.push(function(triggeredEvName, args){
            if (prefix) {
                args.unshift(prefix + triggeredEvName);

            } else {
                args.unshift(triggeredEvName);
            }

            if (includeInstance || typeof includeInstance === "undefined") {
                args.push(this);
            }

            pipeTo.emit.apply(pipeTo, args);
        }.bind(this));

        callbackIndex = pipes.length - 1;

        return Object.create({
            off: function(){
                pipes[callbackIndex] = null;
            }
        });
    }
},

/**
 * Returns the instance setup object. Creates it if it does not have one.
 * @private
 * @this EventEmitter
 */
getSetup = function(){
    if (!PRIVATE.has(this)) {
        /*
            listeners: {
                'evName': [
                    // callbacks
                ]
            },
            pipes: [
                // pipeEmitters
            ]
        */
        PRIVATE.set(this, {
            listeners:  {},
            pipes:      []
        });

        // When this object is destroyed, remove all data
        this.onDestroy(function(){
            if (PRIVATE.has(this)) {
                PRIVATE['delete'](this); // using ['delete'] because of IE
            }
        }.bind(this));
    }
    return PRIVATE.get(this);
};

EventEmitter = Compose.extend(EventEmitter);

export default EventEmitter;

