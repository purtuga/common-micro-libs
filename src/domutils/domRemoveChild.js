/**
 * Safely remove a node from its parent. Check if node has a parent and if so,
 * then it removes it from that parent.
 *
 * @param {Node} childNode
 * @returns {Node}
 */
export function domRemoveChild(childNode) {
    if (childNode && childNode.parentNode) {
        childNode.parentNode.removeChild(childNode);
    }
    return childNode;
}
