/**
 * Checks if a given HTML Element is visible
 *
 * @function domIsVisible
 *
 * @param {HTMLElement} el
 *
 * @return {Boolean}
 */
export function domIsVisible(el){
    return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length );
}
export default domIsVisible;
