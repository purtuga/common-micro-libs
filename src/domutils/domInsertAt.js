import {insertBefore, appendChild} from "../jsutils/runtime-aliases.js";

/**
 * Inserts a node at a given position within a another (parent) node.
 *
 * @param {Node|DocumentFragment} newNode
 * @param {HTMLElement} parentElement
 * @param {Number} position
 *
 * @returns {Node|DocumentFragment}
 */
export function domInsertAt(newNode, parentElement, position = -1) {
    if (newNode && parentElement) {
        // If position is -1 or its a number larger than the number of nodes
        if (position === -1 || parentElement.children.length >= position) {
            appendChild(parentElement, newNode);
        } else {
            insertBefore(parentElement, newNode, parentElement.children.item(position));
        }
    }
    return newNode;
}