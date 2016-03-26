define([
    "./Compose",
    "./dataStore"
], function(
    Compose,
    dataStore
){

    var
    PRIVATE = dataStore.create(),

    /**
     * Emits events. Use it to extend other modules and thus add events to them.
     *
     * @class EventEmitter
     * @extends Compose
     *
     */
    EventEmitter = /** @lends EventEmitter.prototype */{
        /**
         * Add a callback to a given event name
         *
         * @param {String} evName
         * @param {Function} callback
         *  A callback function to listen to the event. The callback function
         *  can cancel any queued event callbacks by returning `true` (boolean).
         *
         * @return {EventListener}
         */
        on: function(evName, callback){
            var setup = getSetup.call(this);

            if (!(evName in setup)) {
                setup[evName] = [];
            }

            setup[evName].push(callback);

            var callbackIndex = setup[evName].length - 1;

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
                    setup[evName][callbackIndex] = null;
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
            var setup = getSetup.call(this);

            if (evName in setup) {
                setup[evName].some(function(thisCallback, index){
                    if (thisCallback === callback) {
                        setup[evName][index] = null;
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
         * @param [String] evName
         * @param [...*] callbackArgs
         */
        emit: function(evName){
            var
            setup   = getSetup.call(this),
            args    = Array.prototype.slice.call(arguments, 1);

            if (evName in setup) {
                setup[evName].some(function(callback){
                    if (typeof callback === "function") {
                        var response = callback.apply(callback, args);

                        // if a boolean true was returned, don't call any more
                        // listeners.
                        if (response && typeof response === "boolean") {
                            return true;
                        }
                    }
                });
            }
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
                {
                    'evName': [
                        // callbacks
                    ]
                }
            */
            PRIVATE.set(this, {});

            // When this object is destroyed, remove all data
            this.onDestroy(function(){
                if (PRIVATE.has(this)) {
                    PRIVATE['delete'](this); // using ['delete'] because of IE
                }
            });
        }
        return PRIVATE.get(this);
    };

    return Compose.extend(EventEmitter);

});
