/**
 * Adds class to an element
 *
 * @function domAddClass
 *
 * @param {HTMLElement} el
 * @param {String} cssClass
 *  Multiple classes can be set using spaces as a delimiter
 */
export default function domAddClass(el, cssClass){
    var classNameList = String(cssClass).split(/\s/).map(className => className.trim());
    if (el && cssClass) {
        return el.classList.add(...classNameList);
    }
}