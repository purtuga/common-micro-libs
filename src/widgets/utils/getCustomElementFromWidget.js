import Component    from "../../jsutils/Component"
import dataStore    from "../../jsutils/dataStore"
import domAddClass  from "../../domutils/domAddClass"

//==============================================================
const objectKeys = Object.keys;
const PRIVATE = dataStore.create();


/**
 * Returns a Custom Element for the given Widget constructor provided on input.
 * Each component defined (HTMLElement) will have a property named `wdg` that
 * holds the Widget's instance (Note: this could be `null` if the CE was disconnected).
 *
 * @param {Object} options
 * @param {Widget} options.Widget
 *  The Widget Class.
 *
 * @param {String} options.className
 *  The CSS class name(s) that should be auto-applied to the Customer Element
 *
 * @param {String} [options.tagName=""]
 *  The HTML custom tag name to use for the return Component `register` method.
 *
 * @param {Object} [options.liveAttr]
 *  An object with the HTML attributes that will be monitored for changes.
 *  The callback will be executed when the prop changes with the new value, old value,
 *  widget instance and Component (ex. `callback(new, old, wdg, component)`.
 *
 * @param {Object} [options.liveProps]
 *  An object with the propName whose value is a callback for when the prop
 *  changes on the instance.
 *  The callback will be given the new prop value on input as well as the
 *  Widget instance and Component instance.
 *  The callback will be called within the context of the Component instance.
 *
 * @return {HTMLElement}
 */
export function getCustomElementFromWidget({ Widget, className, liveProps, tagName, liveAttr = {} }) {
    const liveAttributes = Object.keys(liveAttr);

    const WidgetComponent = class extends Component {
        static get tagName() { return tagName || "" }
        static get observedAttributes() { return liveAttributes; }

        init() {
            if (!PRIVATE.has(this)) {
                this.innerHTML = "";
            }
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (liveAttr[name]) {
                liveAttr[name](newValue, oldValue, this.wdg, this);
            }
        }

        connectedCallback() {
            // ON connect, which can happen multiple times, we check if the widget is already
            // created.
            // If not, we initialize it and attache it to the CE
            // IF already defined, then ensure it is visible. During disconnects we hide the widget,
            // which helps when a user might `cloneNode` on a CE that is NOT using shadowDOM
            super.connectedCallback();

            if (!PRIVATE.has(this)) {
                this.textContent = ""; // we don't want any prior content of this element
                const state = { pendingDestroy: false, cssDisplay: "" };
                const wdg = this.wdg = new Widget(getWidgetOptionsFromComponent(Widget, this));

                PRIVATE.set(this, state);
                this.appendChild(wdg.getEle());

                if (className) {
                    domAddClass(this, className);
                }

                if (wdg.pipe) {
                    wdg.onDestroy(wdg.pipe(this).off);
                }

                this.onDestroy(() => {
                    wdg.destroy();
                    PRIVATE.delete(this);
                    this.wdg = null;
                });
            }
            else {
                const state = PRIVATE.get(this);
                if (state.pendingDestroy) {
                    state.pendingDestroy = false;
                    this.wdg.getEle().style.display = state.cssDisplay;
                    state.cssDisplay = ""
                }
            }
        }

        disconnectedCallback() {
            super.disconnectedCallback();
            if (PRIVATE.has(this) && this.wdg) {
                const state = PRIVATE.get(this);
                if (!state.pendingDestroy) {
                    state.pendingDestroy = true;
                    state.cssDisplay = this.wdg.getEle().style.display;
                    this.wdg.getEle().style.display = "none";
                }
            }
        }
    };

    if (liveProps) {
        Object.defineProperties(WidgetComponent.prototype, objectKeys(liveProps).reduce((props, propName) => {
            let propValue = (propName in Widget.defaults) ? Widget.defaults[propName] : undefined;
            props[propName] = {
                get() { return propValue; },
                set(newValue) {
                    propValue = newValue;
                    liveProps[propName].call(this, newValue, this.wdg, this);
                }
            };
            return props;
        }, {}));
    }

    return WidgetComponent;
}

export default getCustomElementFromWidget;

/**
 * Given a Widget Constructor (class) and a component instance, this method will return
 * an object with the options for the given widget.
 *
 * @param {Widget} Widget
 * @param {HTMLElement} componentInstance
 *
 * @returns {Object}
 */
export function getWidgetOptionsFromComponent(Widget, componentInstance) {
    const widgetOptions = {};

    objectKeys(Widget.defaults).forEach(key => {
        // If set as a Prop on the component, use that value
        if (key in componentInstance && componentInstance[key] !== Widget.defaults[key]) {
            widgetOptions[key] = componentInstance[key];
        }
        // if set as an attribute on the component, then use that value
        else if (componentInstance.hasAttribute(key)) {
            widgetOptions[key] = componentInstance.getAttribute(key);
        }
    });

    return widgetOptions;
}
