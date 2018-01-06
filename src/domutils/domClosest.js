var body    = document.body;
var matches = body.matches                  ||
              body.matchesSelector          ||
              body.msMatchesSelector        ||
              body.mozMatchesSelector       ||
              body.webkitMatchesSelector    ||
              body.oMatchesSelector;

/**
 * Finds the closest DOM element to another by walking up its ancestors.
 *
 * @function domClosest
 *
 * @param {HTMLElement} ele
 * @param {String} selector
 *
 * @return {HTMLElement|undefined}
 */
export function domClosest(ele, selector){
    var parent = ele;
    var response;

    while (!response && parent && parent.nodeName.toUpperCase() !== "HTML") {
        if (matches.call(parent, selector)) {
            response = parent;

        } else {
            parent = parent.parentElement;
        }
    }

    return response;
}
export default domClosest;
