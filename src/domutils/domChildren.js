import domMatches from './domMatches'

/**
 * Returns the children of a given element, but only those of
 * `nodeType` 1. The list of children can also be filter by
 * a given CSS Selector.
 *
 * @function domChildren
 *
 * @param {HTMLElement} ele
 * @param {String} [selector]
 *
 * @return {Array}
 */
export function domChildren(ele, selector){
    var children = Array.prototype.slice.call((ele.childNodes || []), 0).filter(function(childNode){
        return childNode.nodeType === 1;
    });

    if (selector) {
        children = children.filter(function (childNode) {
            return domMatches(childNode, selector);
        });
    }
    return children;
}
export default domChildren;
