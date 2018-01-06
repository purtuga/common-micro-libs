/**
 * Finds an element in the array by executing an iterator callback. Can
 * return either the found element (default) or its index.
 *
 * @param {Array} arr
 * @param {Function|Object} iterator
 * @param {Boolean} [returnIndex]
 * @returns {*}
 */
export function arrayFindBy(arr, iterator, returnIndex) {
    let response;

    if (returnIndex) {
        response = -1;
    }

    arr.some((arrayItem, index) => {
        if (iterator(arrayItem, index)) {
            if (returnIndex) {
                response = index;

            } else {
                response = arrayItem;
            }

            return true;
        }
    });

    return response;
}
export default arrayFindBy;