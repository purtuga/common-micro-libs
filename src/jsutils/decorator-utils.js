const INPUT_ARGS = [
    "kind",
    "key",
    "placement",
    "descriptor",
    "initializer",
    "extras",
    "finisher"
];

//============================================================

/**
 * Create a decorator element descriptor
 *
 * @param {String} kind Possible values: `field`, `class`, `method`, `initializer`
 * @param {String|Symbol} key
 * @param {String} placement Possible value: "static", "prototype" or "own"
 * @param {Object} descriptor
 * @param {Function} [initializer]
 * @param {Function} [extras]
 * @param {Function} [finisher]
 *
 * @returns {{kind: string, key: string|Symbol, placement: string, descriptor: object}}
 *
 * @see https://github.com/tc39/proposal-decorators/blob/master/METAPROGRAMMING.md
 */
function getElementDescriptor () {
    const args = [...arguments];
    const elementDescriptor = {};

    INPUT_ARGS.forEach((descriptorProp, i) => {
        if (args[i]) {
            elementDescriptor[descriptorProp] = args[i];
        }
    });

    return elementDescriptor;

    // A typical descriptor:
    // {
    //     "kind": "method",
    //     "key": "private",
    //     "placement": "prototype",
    //     "descriptor": {
    //         "writable": true,
    //         "configurable": true,
    //         "enumerable": false,
    //         "value": 'the value here'
    //     }
    // }
}


//---------------------------------------------------------------[ EXPORTS ]---
export {
    getElementDescriptor
}
