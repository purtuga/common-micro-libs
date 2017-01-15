import Compose      from "./Compose"
import dataStore    from "./dataStore"
import EventEmitter from "./EventEmitter"


const ArrayPrototype    = Array.prototype;
const objectDefineProp  = Object.defineProperty;
const changeMethods     = [
    'pop',
    'push',
    'shift',
    'splice',
    'unshift'
];

/**
 * An Array like object with the added ability to listen to events.
 * It supports all methods available to a normal array, like `forEach`,
 * `some` and `reduce`
 *
 * @class Collection
 *
 * @extends Compose
 * @extends EventEmitter
 * @extends Array
 *
 * @fires Collection#change
 */
var Collection = /** @lends Collection.prototype */{
    init: function(initialValues){
        if (Array.isArray(initialValues)) {
            this.push(...initialValues);
        }
    },

    /**
     * Returns the size of the collection
     *
     * @returns {Number}
     */
    size: function(){
        return this.length;
    },

    /**
     * Returns a member of the collection given an index (zero based),
     * or updates the item at a given index with a new value.
     *
     * @param {Number} index
     * @param {*} [newValue]
     */
    item: function (index){
        let args    = ArrayPrototype.slice.call(arguments, 0);
        let _array  = this;

        // GET mode..
        if (args.length === 1) {
            return _array[index];
        }

        // Update mode... Emits event
        let updateResponse = _array[index] = args[1];
        _array.emit("change", updateResponse);

        return updateResponse;
    }
};

// Add all methods of Array.prototype to the collection
Object.getOwnPropertyNames(ArrayPrototype).forEach(function(method){
    if (method === "constructor" || typeof ArrayPrototype[method] !== "function") {
        return;
    }

    var doEvents = changeMethods.indexOf(method) !== -1;

    Collection[method] = function(){
        var response = ArrayPrototype[method].apply(this, arguments);

        // If Array method can manipulate the array, then emit event
        if (doEvents) {
            /**
             * Collection was changed. Event will provide the value returned
             * by the Array method that made the change.
             *
             * @event Collection#change
             * @type {*}
             *
             */
            this.emit("change", response);
        }

        return response;
    }
});

Collection = Compose.extend(EventEmitter, Collection);

// Define the "create" factory method that will then redefine each
// our proxyied methods of Array prototype into the array instance
objectDefineProp(Collection, "create", {
    value: function(){
        let instance        = [];
        let thisPrototype   = this.prototype;

        // Copy all methods in this prototype to the Array instance
        for (let prop in thisPrototype){
            /* eslint-disable */
            objectDefineProp(instance, prop, {
                value:          thisPrototype[prop],
                writable:       true,
                configurable:   true
            });
            /* eslint-enable */
        }

        if (instance.init) {
            instance.init.apply(instance, arguments);
        }

        return instance;
    }
});

export default Collection;
