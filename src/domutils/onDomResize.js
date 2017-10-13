import EventEmitter         from "../jsutils/EventEmitter"
import domAddEventListener  from "./domAddEventListener"

//===============================================================
const PRIVATE               = new WeakMap();
const userAgent             = window.navigator.userAgent;
const IS_IE                 = userAgent.indexOf("MSIE ") !== -1 || userAgent.indexOf("Trident/") !== -1;
const FUNCTION_CALL_BIND    = Function.call.bind.bind(Function.call);
const DOCUMENT              = document;
const createElement         = DOCUMENT.createElement.bind(DOCUMENT);
const setAttribute          = FUNCTION_CALL_BIND(Element.prototype.setAttribute);
const appendChild           = FUNCTION_CALL_BIND(Node.prototype.appendChild);
const EV_RESIZE             = "resize";
const IS_POSITIONED         = /fixed|relative|absolute/i;
const STYLE_BASE            = "position: absolute; top: 0; left: 0; z-index: -5; width: 100%; height: 100%; display: block; pointer-events: none; overflow: hidden;";

/**
 * Execute a callback function every time a given element is resized. Note that the
 * element whose size is to be monitered must be `positioned` in the DOM Flow. If
 * it is not (ex. does not have a css `position` value of `fixed`, `relative` or
 * `absolute`, the element's style `position` property will be set to `relative`.
 *
 * @param {HTMLElement} ele
 * @param {Function} callback
 * @param {String} [event="resize"]
 *
 * @returns {EventEmitter~EventListener}
 */
export default function onDomResize (ele, callback, event = EV_RESIZE) {
    if (ele && callback) {
        return getEleMonitor(ele).on(event ,callback);
    }
}

/**
 * Returns an EventListener for the given DOM Element
 *
 * @return {EventListener}
 */
function getEleMonitor(ele) {
    let eleMonitor;
    if (PRIVATE.has(ele)) {
         eleMonitor = PRIVATE.get(ele);
         eleMonitor.attach(ele);
         return eleMonitor;
    }

    eleMonitor = DomElementResizeMonitor.create();
    PRIVATE.set(ele, eleMonitor);
    eleMonitor.attach(ele);
    return eleMonitor;
}

/**
 * Creates a shadow element that keeps track of its parent's size and emits events when
 * those measurements change
 *
 * @class DomElementResizeMonitor
 * @extends EventEmitter
 */
export const DomElementResizeMonitor = EventEmitter.extend(/** @lends DomElementResizeMonitor.prototype */{
    init() {
        const inst      = { parentPosition: "" };
        const shadowEle = inst.shadowEle = createElement("div");
        const objectEle = createElement('object');

        PRIVATE.set(this, inst);

        // Setup the Div container for the monitor
        setAttribute(shadowEle, "class", "DomElementResizeMonitor");
        setAttribute(shadowEle, "tabindex", "-1");
        setAttribute(shadowEle, "style", `${STYLE_BASE} border: none; background-color: transparent; opacity: 0;`);

        // Setup the <Object> element from where the actual DOM event are fired
        // Approach borrowed from:
        // https://github.com/Akryum/vue-resize/blob/master/src/components/ResizeObserver.vue
        setAttribute(objectEle, "style", STYLE_BASE);
        objectEle.onload = () => {
            inst.objResizeEv = domAddEventListener(objectEle.contentDocument.defaultView, "resize", () => this.emit(EV_RESIZE));
        };

        objectEle.type = 'text/html';

        if (IS_IE) {
            appendChild(shadowEle, objectEle);
        }

        objectEle.data = 'about:blank';

        if (!IS_IE) {
            appendChild(shadowEle, objectEle);
        }

        this.onDestroy(this.getFactory().getDestroyCallback(inst, PRIVATE));
    },

    /**
     * Attach monitor shadow element to the given element and start emitting events.
     *
     * @param {HTMLElement} htmlEle
     */
    attach(htmlEle) {
        if (htmlEle) {
            const inst = PRIVATE.get(this);
            const shadowEle = inst.shadowEle;

            if (shadowEle.parentNode !== htmlEle) {
                inst.parentPosition = htmlEle.style.position;
                appendChild(htmlEle, shadowEle);

                if (!IS_POSITIONED.test(window.getComputedStyle(htmlEle).getPropertyValue("position"))) {
                    htmlEle.style.position = "relative";
                }
            }
        }
    },

    /**
     * Detach monitor from the parent element
     */
    detach() {
        const inst = PRIVATE.get(this);
        const { shadowEle, parentPosition } = inst;

        if (shadowEle) {
            const parentNode = shadowEle.parentNode;
            if (parentNode) {
                parentNode.removeChild(shadowEle);
                parentNode.style.position = parentPosition;
                inst.parentPosition = "";
            }
        }
    }
});


