import {defineProperty} from "./runtime-aliases";
import {throwIfThisIsPrototype} from "./throwIfThisIsPrototype.js"

//---------------------------------------------------------------------------------

/**
 * Binds the given method to the Class instance on first `get`.
 *
 * @return {Function|Object}
 *
 * @example
 *
 * class Foo {
 *     @bound
 *     bar() {}
 * }
 */
export function bound(options) {
    if (options.key && options.kind) {
        return _bound(options);
    }
    return _bound;
}

function _bound(decoratorDescriptor) {
    const {kind, key, descriptor} = decoratorDescriptor;
    if (kind === "method" && descriptor.value) {
        let isDoingLazySetup = false; // Fuck you IE!
        const method = descriptor.value;

        delete descriptor.value;
        delete descriptor.writable;

        descriptor.get = function () {
            throwIfThisIsPrototype(this);

            if (isDoingLazySetup) {
                return;
            }
            isDoingLazySetup = true;

            const boundMethod = method.bind(this);
            defineProperty(this, key, boundMethod);
            isDoingLazySetup = false;

            return boundMethod;
        }
    }

    return decoratorDescriptor;

    // Decorator Element descriptor:
    //
    // {
    //     "kind": "method",
    //     "key": "private",
    //     "placement": "prototype",
    //     "descriptor": {
    //         "writable": true,
    //         "configurable": true,
    //         "enumerable": false,
    //         "value": function(){}
    //     }
    // }
}
