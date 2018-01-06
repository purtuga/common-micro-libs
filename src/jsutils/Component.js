import dataStore from "./dataStore"


//=================================================================
const PRIVATE = dataStore.create();

/**
 * An html component - a Custom Element.
 */
export class Component extends HTMLElement {
    // Taken from: https://github.com/WebReflection/document-register-element#skipping-the-caveat-through-extends
    constructor(_) { return (_ = super(_)).init(), _; }

    /**
     * Run initialization logic
     */
    init() {}

    /**
     * Registers the component on the page with the given name (html tagName).
     * Shortcut to `customElements.define()` method of `CustomElementRegistry`
     *
     * @param {String} name
     */
    static registerAs(name) {
        registerCustomElementAs(this, name);
    }

    /**
     * Dispatches a native `CustomEvent`
     *
     * @param {String} eventName
     * @param {*} data
     */
    emit(eventName, data) {
        this.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }

    /**
     * Destroy the instance of the widget
     */
    destroy() {
        getInstanceState(this).destroyCallbacks.splice(0).forEach(cb => cb());
    }

    /**
     * Adds a callback to be executed when Component is destroyed.
     * @param {Function} callback
     */
    onDestroy(callback) {
        getInstanceState(this).destroyCallbacks.push(callback);
    }
}
export default Component;

function getInstanceState(instance) {
    if (!PRIVATE.has(instance)) {
        PRIVATE.set(instance, {
            destroyCallbacks: []
        });
    }
    return PRIVATE.get(instance);
}

/**
 * Registers a component on the document. Shortcut to `customElements.define`;
 *
 * @param {HTMLElement} Constructor
 * @param {String} name
 */
export function registerCustomElementAs(Constructor, name) {
    customElements.define(name, Constructor);
}
