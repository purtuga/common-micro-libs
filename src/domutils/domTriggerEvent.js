define([], function(){

    var keyboardEvents  = ['keyup', 'keydown', 'keypress'],
        mouseEvents     = ['mouseup', 'mousedown'];


    /**
     * @private
     *
     * @returns {Event}
     */
    function getNewGenericEvent(eventName){
        var event;

        try {
            event = new Event(eventName);

        } catch(e) {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventName, true, true);
        }
        return event;
    }

    /**
     * @private
     *
     * @returns {Event}
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
     */
    function getNewKeyboardEvent(eventName, options){
        var event;

        try {
            event = new KeyboardEvent(eventName, options);

        } catch(e) {
            event = getNewGenericEvent(eventName);
        }
        return event;
    }

    /**
     * @private
     *
     * @returns {Event}
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent
     */
    function getNewMouseEvent(eventName){
        var event;

        try {
            event = new MouseEvent(eventName);

        } catch(e) {
            event = getNewGenericEvent(eventName);
        }
        return event;

    }

    /**
     * Triggers an events on a given DOM Element.
     *
     * @param {HTMLElement} ele
     * @param {String} eventName
     * @param {Object} [options]
     *
     */
    return function(ele, eventName, options){
        if (!ele || !eventName) {
            return;
        }

        if (typeof ele[eventName] === "function") {
            ele[eventName]();
            return;
        }

        var evInstance;

        if (keyboardEvents.indexOf(eventName) !== -1) {
            evInstance = getNewKeyboardEvent(eventName, options);

        } else if (mouseEvents.indexOf(eventName) !== -1) {
            evInstance = getNewMouseEvent(eventName, options);
        }

        ele.dispatchEvent(evInstance);
    };
});