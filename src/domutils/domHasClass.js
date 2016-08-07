/**
 * Check if an element has a given class
 *
 * @function domHasClass
 *
 * @param {HTMLElement} el
 * @param {String} cssClass
 *
 * @return {Boolean}
 */
export default  function(el, cssClass){
    if (el && cssClass) {
        return el.classList.contains(cssClass);
    }
    return false;
}
