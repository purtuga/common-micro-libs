/**
 * Given an HTML Element and a selector, this method will return
 * a Boolean indicating if Element matches selector.
 *
 * @function domMatches
 *
 * @param {HTMLElement} el
 * @param {String} selector
 *
 * @return {Boolean}
 */
export function domMatches(el, selector) {
    if (!el || !selector) {
        return false;
    }
    return (
        el.matches              ||
        el.matchesSelector      ||
        el.msMatchesSelector    ||
        el.mozMatchesSelector   ||
        el.webkitMatchesSelector||
        el.oMatchesSelector
    ).call(el, selector);
}
export default domMatches;