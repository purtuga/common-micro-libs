define([
    "./Compose",
    "./dataStore",
    "./EventEmitter"
], function(
    Compose,
    dataStore,
    EventEmitter
){

    var
    PRIVATE         = dataStore.create(),
    ArrayPrototype  = Array.prototype,
    changeMethods   = [
        'pop',
        'push',
        'shift',
        'splice',
        'unshift'
    ],

    /**
     * An Array like object with the added ability to listen to events
     *
     * @class Collection
     *
     * @extends Compose
     * @extends EventEmitter
     * @extends Array
     *
     * @fires Collection#change
     */
    Collection = /** @lends Collection.prototype */{
        init: function(initialValues){
            var inst = {
                data: Array.isArray(initialValues) ? initialValues : []
            };

            PRIVATE.set(this, inst);
            this.length = inst.data.length;

            this.onDestroy(function(){
                PRIVATE["delete"](this);
            });
        },

        /**
         * The size of the collection.
         *
         * @protected
         *
         * @type {Number}
         */
        length: 0,

        /**
         * Returns the size of the collection
         *
         * @returns {Number}
         */
        size: function(){
            return PRIVATE.get(this).data.length;
        },

        /**
         * Returns a member of the collection given an index (zero based).
         *
         * @param {Number} index
         */
        item: function(index){
            if (typeof index !== "undefined") {
                return PRIVATE.get(this).data[index];
            }
        }
    };

    // Add all methods of Array.prototype to the collection
    Object.getOwnPropertyNames(Array.prototype).forEach(function(method){
        if (method === "constructor" || typeof ArrayPrototype[method] !== "function") {
            return;
        }

        var doEvents = changeMethods.indexOf(method) > -1;

        Collection[method] = function(){
            var inst     = PRIVATE.get(this),
                response = ArrayPrototype[method].apply(inst.data, arguments);

            // If Array method can manipulate the array, then emit event
            if (doEvents) {
                this.length = inst.data.length;

                /**
                 * Collection was changed.
                 *
                 * @event Collection#change
                 */
                this.emit("change", response);
            }

            return response;
        }
    });

    return Compose.extend(EventEmitter, Collection);
});
