/**
 * Shortcut/Functional alias to `Node.insertBefore` method.
 *
 * @param {Node|DocumentFragment} newNode
 * @param {Node} referenceNode `newNode` will be placed after this one
 *
 * @returns {Node|DocumentFragment}
 */
export function domInsertBefore(newNode, referenceNode) {
    const parentNode = referenceNode.parentNode;

    if (!referenceNode.nextSibling) {
        parentNode.appendChild(newNode);
    } else {
        parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    return newNode;
}
export default domInsertBefore;

