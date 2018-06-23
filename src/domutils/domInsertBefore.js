/**
 * Shortcut/Functional alias to `Node.insertBefore` method.
 *
 * @param {Node|DocumentFragment} newNode
 * @param {Node} referenceNode
 *
 * @returns {Node|DocumentFragment}
 */
export function domInsertBefore(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode && referenceNode.parentNode.insertBefore) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }
    return newNode;
}
export default domInsertBefore;

