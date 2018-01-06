import dataStore from "./dataStore"


//=================================================================
const PRIVATE = dataStore.create();

class Component extends HTMLElement {
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

function getInstanceState(instance) {
    if (!PRIVATE.has(instance)) {
        PRIVATE.set(this, {
            destroyCallbacks: []
        });
    }
    return PRIVATE.get(instance);
}