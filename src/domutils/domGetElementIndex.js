/**
 * Given a `HTMLElement`, its index position within the `parentElement` will be returned.
 * If Element is not attached to a parent, then `-1` will be returned.
 *
 * @param {HTMLElement} element
 *
 * @return {Number}
 */
export function domGetElementIndex(element) {
    if (!element || !element.parentNode) {
        return -1;
    }

    const children = element.parentNode.children;

    for (let i = 0, t = children.length; i < t; i++) {
        if (children.item(i) === element) {
            return i;
        }
    }
}