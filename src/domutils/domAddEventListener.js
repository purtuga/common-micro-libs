define(function () {
    /**
     * Adds an event handler to a DOM element and returns back an
     * object that allows for removal of the event.
     *
     * @function domAddEventListener
     *
     * @param {HTMLElement} ele
     * @param {String} event
     * @param {Function} callback
     * @param {Boolean} [capture]
     *
     * @return DOMEventListener
     *
     * @example
     *
     * var listener = domAddEventHandler(myEle, "click", function(){});
     * ...
     * listener.remove();
     */
    return function (ele, event, callback, capture) {
        ele.addEventListener(event, callback, capture);
        /**
         * A DOM Event listener.
         *
         * @typedef DOMEventListener
         *
         * @property {Function} remove
         */
        return Object.create({
            remove: function(){
                ele.removeEventListener(event, callback, capture);
            }
        });
    };
});