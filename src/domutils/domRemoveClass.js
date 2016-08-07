/**
 * removes a class from an element
 *
 * @function domRemoveClass
 *
 * @param {HTMLElement} el
 * @param {String} cssClass
 */
export default function domRemoveClass(el, cssClass){
    return el.classList.remove(cssClass);
}