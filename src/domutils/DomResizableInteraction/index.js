import EventEmitter         from "../../jsutils/EventEmitter"
import objectExtend         from "../../jsutils/objectExtend"
import dataStore            from "../../jsutils/dataStore"
import domAddEventListener  from "../domAddEventListener"
import domAddClass          from "../domAddClass"
import domRemoveClass       from "../domRemoveClass"

import "./DomResizableInteraction.less"

//========================================================================
const PRIVATE                   = dataStore.create();
const WINDOW                    = window;
const DOCUMENT                  = WINDOW.document;
const DOCUMENT_ELEMENT          = DOCUMENT.documentElement || DOCUMENT.body;
const EV_RESIZE                 = "resize";
const EV_START                  = `${ EV_RESIZE }-start`;
const EV_END                    = `${ EV_RESIZE }-end`;
const CSS_CLASS_NO_USER_SELECT  = "dri--noUserSelect";

/**
 * Utility to make a given DOM element resizable by dragging its
 * edges.
 *
 * @class DomResizableInteraction
 * @extends EventEmitter
 *
 * @param {Object} options
 * @param {HTMLElement} options.ele
 * @param {Boolean|String|HTMLElement} [options.seHandle=true]
 *  The Bottom-Right drag handle. Can be:
 *
 *  -   `Boolean`: indicating if handle should be used or not. In such case,
 *      this utility will insert its own markup to represent the handle.
 *  -   `String`: a selector identifing the drag handle (selector is applied
*       to `options.ele`)
 *  -   `HTMLElement`: An HTML element
 *
 * @fires DomResizableInteraction#resize-start
 * @fires DomResizableInteraction#resize-end
 * @fires DomResizableInteraction#resize
 */
export const DomResizableInteraction = EventEmitter.extend(/** @lends DomResizableInteraction.prototype */{
    init(options) {
        console.warn("DomResizableInteraction: Deprecated! Use @purtuga/interactions"); // eslint-disable-line

        if (PRIVATE.get(this)) {
            return;
        }

        let inst = {
            opt:  objectExtend({}, this.getFactory().defaults, options)
        };

        PRIVATE.set(this, inst);
        setupHandles.call(this);

        this.onDestroy(() => {
            // Destroy all Compose object
            Object.keys(inst).forEach(function (prop) {
                if (inst[prop]) {
                    [
                        "destroy",      // Compose
                        "remove",       // DOM Events Listeners
                        "off"           // EventEmitter Listeners
                    ].some((method) => {
                        if (inst[prop][method]) {
                            inst[prop][method]();
                            return true;
                        }
                    });

                    inst[prop] = undefined;
                }
            });

            PRIVATE['delete'](this);
        });
    }
});

function setupHandles() {
    let inst        = PRIVATE.get(this);
    // let {seHandle}  = inst.opt;

    // FIXME: support for Boolean and selector definitions for handles

    inst.seHandleEle = inst.opt.seHandle;

    inst.handleEvents = addEventHandlingToHandle.call(this, {
        handle: inst.seHandleEle,
        movement: "all"
    });
}

/**
 * Adds event handling to a give handle.
 *
 * @param {Object} options
 * @param {HTMLElement} options.handle
 * @param {Object} [options.movement="all"]
 *  The type of movement the handle allows. Valid values are:
 *
 *  -   `all`: All directions (north-south/east-west)
 *  -   `ns`: vertically only (north south)
 *  -   `ew`: Horizontally only (east west)
 *
 * @return {Object}
 *  An object containing a `.remove()` method that can be used to
 *  destruct all event handlers
 */
function addEventHandlingToHandle(options = {movement: "all"}) {
    let inst        = PRIVATE.get(this);
    let domEvents   = {};
    let emit        = this.emit.bind(this);
    let {
        ele:resizableEle,
        minWidth,
        minHeight   }   = inst.opt;
    let {
        handle,
        movement = "all" }  = options;
    let boxWidth;
    let boxHeight;
    let handleX;
    let handleY;
    let resizeWhenMouseMoves = handleEle => {
        let newWidth    = boxWidth + (handleEle.clientX - handleX);
        let newHeight   = boxHeight + (handleEle.clientY - handleY);
        let fireEvent   = false;

        if (newWidth >= minWidth && (movement === "all" || movement === "ew")) {
            resizableEle.style.width = newWidth + "px";
            fireEvent = true;
        }

        if (newHeight >= minHeight && (movement === "all" || movement === "ns")) {
            resizableEle.style.height = newHeight + "px";
            fireEvent = true;
        }

        if (fireEvent) {
            /**
             * Element was resized
             *
             * @event DomResizableInteraction#resize
             */
            emit(EV_RESIZE);
        }
    };
    let stopResizing = () => {
        let fireEvent = false;

        if (domEvents.mousemove) {
            domEvents.mousemove.remove();
            domEvents.mousemove = null;
            fireEvent = true;
        }

        if (domEvents.mouseup) {
            domEvents.mouseup.remove();
            domEvents.mouseup = null;
            fireEvent = true;
        }

        domRemoveClass(DOCUMENT_ELEMENT, CSS_CLASS_NO_USER_SELECT);

        if (fireEvent) {
            /**
             * Resizing of element has ended (user released the mouse (mouseup).
             *
             * @event DomResizableInteraction#resize-end
             */
            emit(EV_END);
        }
    };

    domEvents.mousedown = domAddEventListener(handle, "mousedown touchstart", handleEle => {
        boxWidth    = resizableEle.clientWidth;
        boxHeight   = resizableEle.clientHeight;
        handleX     = handleEle.clientX;
        handleY     = handleEle.clientY;

        domAddClass(DOCUMENT_ELEMENT, CSS_CLASS_NO_USER_SELECT);
        domEvents.mousemove = domAddEventListener(WINDOW, "mousemove touchmove", resizeWhenMouseMoves, false);
        domEvents.mouseup = domAddEventListener(WINDOW, "mouseup touchend", stopResizing, false);

        /**
         * Resizing of element is about to start (user moused down on handle)
         *
         * @event DomResizableInteraction#resize-start
         */
        emit(EV_START);
    }, false);

    return Object.create({
        remove() {
            Object.keys(domEvents).forEach(evName => {
                if (domEvents[evName]) {
                    domEvents[evName].remove();
                    domEvents[evName] = null;
                }
            });
        }
    });
}


DomResizableInteraction.defaults = {
    ele:        null,
    minWidth:   50,
    minHeight:  50,
    // drag handles
    seHandle:   true
};


export default DomResizableInteraction;


