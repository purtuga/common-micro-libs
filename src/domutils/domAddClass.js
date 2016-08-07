/**
 * Adds class to an element
 *
 * @function domAddClass
 *
 * @param {HTMLElement} el
 * @param {String} cssClass
 */
export default function domAddClass(el, cssClass){
    if (el && cssClass) {
        return el.classList.add(cssClass);
    }
}