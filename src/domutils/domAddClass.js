/**
 * Adds class to an element
 *
 * @function domAddClass
 *
 * @param {HTMLElement} el
 * @param {String} cssClass
 *  Multiple classes can be set using spaces as a delimiter
 */
export function domAddClass(el, cssClass){
    let classNameList = String(cssClass).trim().split(/\s+/).map(className => className.trim());
    if (el && classNameList.length) {
        classNameList.forEach((cssClass) => el.classList.add(cssClass));
    }
}
export default domAddClass;