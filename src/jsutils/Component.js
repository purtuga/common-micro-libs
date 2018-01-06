import dataStore from "./dataStore"


//=================================================================
const PRIVATE = dataStore.create();

export class Component extends HTMLElement {
    emit(eventName, data) {
        this.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }

    destroy() {
        getInstanceState(this).destroyCallbacks.splice(0).forEach(cb => cb());
    }

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