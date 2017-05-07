/**
 * Adds an event handler to a DOM element and returns back an
 * object that allows for removal of the event.
 *
 * @function domAddEventListener
 *
 * @param {HTMLElement} ele
 * @param {String} event
 *  The event to listen to (ex. `click`). Multiple events can be defined
 *  by separating them with whitespace
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
export default function domAddEventListener(ele, event, callback, capture) {
    let events      = event.split(/\s+/);
    let evListeners = {};

    events.forEach(evName => {
        ele.addEventListener(evName, callback, capture);
        evListeners[evName] = {
            remove: () => ele.removeEventListener(evName, callback, capture)
        }
    });

    /**
     * A DOM Event listener.
     *
     * @typedef {Object} DOMEventListener
     *
     * @property {Function} remove
     * @property {Object} listeners
     *  List of listeners that were bound to the DOM element. Each listeners has a
     *  corresponding `.remove()` method.
     */
    return Object.create({
        listeners: evListeners,
        remove: function () {
            events.forEach(evName => evListeners[evName].remove());
        }
    });
}