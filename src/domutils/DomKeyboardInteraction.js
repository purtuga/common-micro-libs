define([
    "../jsutils/objectExtend",
    "../jsutils/dataStore",
    "../jsutils/EventEmitter",

    "./domAddEventListener",
    "./domFind",
    "./domChildren",
    "./domHasClass",
    "./domAddClass",
    "./domRemoveClass",
    "./domToggleClass",
    "./scrollEleIntoView"
],
function(
    objectExtend,
    dataStore,
    EventEmitter,

    domAddEventListener,
    domFind,
    domChildren,
    domHasClass,
    domAddClass,
    domRemoveClass,
    domToggleClass,
    scrollEleIntoView
){

    var 
    PRIVATE = dataStore.create(),
    
    KEY_ESC     = 27,
    KEY_DOWN    = 40,
    KEY_UP      = 38,
    KEY_ENTER   = 13;

    /**
     * Adds Keyboard navigation support (up, down, enter, esc) to the
     * children of a given element controlled from an input field.
     * For use in cases where the user's cursor may be focused on an
     * input field and wanting to control selection of HTML elements
     * in a group.  As focus moves from Element to Element, the `focusClass`
     * CSS class (see input params) will be applied to the element.
     *
     * The keyboard action that will be applies are:
     *
     * -    Up Arrow: move focus to prior selection
     * -    Down Arrow: move focus to prior selection
     *
     * @class DomKeyboardInteraction
     * @extends EventEmitter
     *
     * @param {Object} options
     *
     * @param {HTMLElement} options.input
     *
     * @param {HTMLElement} options.eleGroup
     *
     * @param {String} [options.eleSelector=""]
     *  The selector to be used in retrieving the list of element that will
     *  receive focus with the keyboard actions. Selector will be used on
     *  `options.eleGroup`. If not defined, the children of `options.eleGroup`
     *  will be used to set focus
     *
     * @param {String} [options.focusClass="my-isFocused"]
     *  The CSS class name that will be applied to the Element that gains focus.
     *
     * @param {String} [options.selectedClass="my-isSelected"]
     *  The CSS Class name that will be applied to the Element that should be
     *  marked as selected.
     *
     * @param {Boolean} [options.preventDefault=true]
     *  If set to true, `preventDefault` method of the event will be called.
     *
     * @param {Boolean} [options.stopPropagation=true]
     *  If se to `true`, `stopPropagation` method of the event will be called.
     *
     * @example
     *
     * var keyboardInteraction = DomKeyboardInteraction.create({
     *      input: inputFieldElement,
     *      eleGroup: choicesElement,
     *      eleSelector: ".choice"
     * });
     */

    var DomKeyboardInteraction = /** @lends DomKeyboardInteraction.prototype */{
        init: function(options){

            var 
            inst            = {
                                opt: objectExtend({}, DomKeyboardInteraction.defaults, options)
                            },
            opt             = inst.opt,
            domListeners    = [];
            
            PRIVATE.set(this, inst);

            if (!opt.input || !opt.eleGroup) {
                throw new TypeError("options.input and options.eleGroup are required");
            }

            // Helper methods
            inst.hasFocus = function(ele){
                return domHasClass(ele, opt.focusClass);
            };
            inst.setFocus = function(ele){
                return domAddClass(ele, opt.focusClass);
            };
            inst.removeFocus = function(ele){
                return domRemoveClass(ele, opt.focusClass);
            };
            inst.getChildren = function(){
                return opt.eleSelector ?
                    domFind(opt.eleGroup, opt.eleSelector) :
                    domChildren(opt.eleGroup);
            };
            
            domListeners.push(domAddEventListener(opt.input, "keydown", function(ev){
                var key         = ev.which || ev.keyCode,
                    eventName   = "",
                    focusEle;

                switch (key) {
                    case KEY_DOWN:
                        eventName = "keyDown";
                        focusEle = this.focusNext();
                        break;

                    case KEY_UP:
                        eventName = "keyUp";
                        focusEle = this.focusPrevious();
                        break;

                    case KEY_ENTER:
                        eventName = "keyEnter";
                        focusEle = toggleSelected.call(this);
                        break;

                    case KEY_ESC:
                        eventName = "keyEsc";
                        // FIXME: complete ESC key - what should we do?

                        break;
                }

                if (eventName) {
                    ev.focusElement = focusEle;

                    if (opt.preventDefault) {
                        ev.preventDefault();
                    }

                    if (opt.stopPropagation) {
                        ev.stopPropagation();
                    }

                    this.emit(eventName, ev);
                }
            }.bind(this)));

            this.onDestroy(function(){
                var ev;
                while ((ev = domListeners.shift())){
                    ev.remove();
                }

                PRIVATE.delete(this);
            }.bind(this));
        },

        /**
         * Sets focus on the next result item
         *
         * @return {HTMLElement|undefined}
         *  Returns the Element currently with focus
         */
        focusNext: function(){
            var
            inst            = PRIVATE.get(this),
            scrollingParent = inst.opt.eleGroup,
            groupChildren   = inst.getChildren(),
            hasFocus        = inst.hasFocus,
            setFocus        = inst.setFocus,
            currentFocusEle, currentFocusEleIndex;

            if (!groupChildren.length) {
                return;
            }

            // Find currently focused element (if any)
            groupChildren.some(function(ele, index){
                if (hasFocus(ele)) {
                    currentFocusEleIndex= index;
                    currentFocusEle = ele;
                    return true;
                }
            });

            // Nothing selected? - set first item
            if (!currentFocusEle) {
                setFocus(groupChildren[0]);
                scrollEleIntoView(groupChildren[0], scrollingParent);
                return groupChildren[0];
            }

            inst.removeFocus(currentFocusEle);

            // If currently in the last item, select the first one again
            if (currentFocusEleIndex === (groupChildren.length - 1)) {
                setFocus(groupChildren[0]);
                scrollEleIntoView(groupChildren[0], scrollingParent);
                return groupChildren[0];
            }

            setFocus(groupChildren[currentFocusEleIndex + 1]);
            scrollEleIntoView(groupChildren[currentFocusEleIndex + 1], scrollingParent);

            return groupChildren[currentFocusEleIndex + 1];
        },

        /**
         * Sets focus on previous result item
         *
         * @return {HTMLElement|undefined}
         */
        focusPrevious: function(){
            var
            inst            = PRIVATE.get(this),
            opt             = inst.opt,
            scrollingParent = opt.eleGroup,
            groupChildren   = inst.getChildren(),
            lastIndex       = groupChildren.length - 1,
            hasFocus        = inst.hasFocus,
            setFocus        = inst.setFocus,
            currentFocusEle, currentFocusEleIndex;

            if (!groupChildren.length) {
                return;
            }

            // Find currently focused element (if any)
            groupChildren.some(function(ele, index){
                if (hasFocus(ele)) {
                    currentFocusEleIndex= index;
                    currentFocusEle = ele;
                    return true;
                }
            });

            // Nothing selected? - set last item
            if (!currentFocusEle) {
                setFocus(groupChildren[lastIndex]);
                scrollEleIntoView(groupChildren[lastIndex], scrollingParent);
                return groupChildren[lastIndex];
            }

            inst.removeFocus(currentFocusEle);

            // If currently in the first item, select the last one again
            if (currentFocusEleIndex === 0) {
                setFocus(groupChildren[lastIndex]);
                scrollEleIntoView(groupChildren[lastIndex], scrollingParent);
                return groupChildren[lastIndex];
            }

            setFocus(groupChildren[currentFocusEleIndex - 1]);
            scrollEleIntoView(groupChildren[currentFocusEleIndex - 1], scrollingParent);

            return groupChildren[currentFocusEleIndex - 1];
        },

        /**
         * Resets the focus
         */
        resetFocus: function(){
            var focusedEle = this.getFocusEle();
            if (focusedEle) {
                PRIVATE.get(this).removeFocus(focusedEle);
            }
        },

        /**
         * Returns the DOM element currently with focus
         *
         * @return {HTMLElement}
         */
        getFocusEle: function(){
            var inst = PRIVATE.get(this),
                response;

            inst.getChildren().some(function(ele){
                if (inst.hasFocus(ele)) {
                    response = ele;
                    return true;
                }
            });

            return response;
        }
    };

    function toggleSelected() {
        var inst            = PRIVATE.get(this),
            selectedClass   = inst.opt.selectedClass,
            focusedEle;

        if (selectedClass) {
            focusedEle = this.getFocusEle();

            if (focusedEle) {
                domToggleClass(focusedEle, selectedClass);
            }
        }

        return focusedEle;
    }

    DomKeyboardInteraction = EventEmitter.extend(DomKeyboardInteraction);
    DomKeyboardInteraction.defaults = {
        input:          null,
        eleGroup:       null,
        focusClass:     'my-isFocused',
        selectedClass:  'my-isSelected',
        eleSelector:    ''
    };

    return DomKeyboardInteraction;
});