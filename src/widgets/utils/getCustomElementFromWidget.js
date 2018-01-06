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
 *  The class name(s) that should be auto-applied to the Customer Element
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
export function getCustomElementFromWidget({ Widget, className, liveProps }) {
    const WidgetComponent = class extends Component {
        connectedCallback() {
            super.connectedCallback();

            if (!PRIVATE.has(this)) {
                const state = {};
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

function getWidgetOptionsFromComponent(Widget, componentInstance) {
    const widgetOptions = {};

    objectKeys(Widget.defaults).forEach(key => {
        // If set as a Prop on the component, use that value
        if (key in componentInstance && componentInstance[key] !== Widget.defaults[key]) {
            widgetOptions[key] = componentInstance[key];
        }

        // if set as an attribute on the component, then use that value
        if (componentInstance.hasAttribute(key)) {
            widgetOptions[key] = componentInstance.getAttribute(key);
        }
    });

    return widgetOptions;
}
