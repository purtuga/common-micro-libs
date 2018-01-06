/**
 * Toggles a CSS class on/off on an element
 *
 * @function domToggleClass
 *
 * @param {HTMLElement} el
 * @param {String} cssClass
 */
export function domToggleClass(el, cssClass){
    if (el) {
        return el.classList.toggle(cssClass);
    }
}
export default domToggleClass;