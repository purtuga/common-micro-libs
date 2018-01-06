/**
 * removes a class from an element
 *
 * @function domRemoveClass
 *
 * @param {HTMLElement} el
 * @param {String} cssClass
 */
export function domRemoveClass(el, cssClass){
    return el.classList.remove(cssClass);
}
export default domRemoveClass;