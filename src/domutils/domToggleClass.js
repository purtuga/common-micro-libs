/**
 * Toggles a CSS class on/off on an element
 *
 * @function domToggleClass
 *
 * @param {HTMLElement} el
 * @param {String} cssClass
 */
export default function domToggleClass(el, cssClass){
    return el.classList.toggle(cssClass);
}
