let IS_POSITIONED   = /fixed|relative|absolute/i;
let ROOT            = document.documentElement;

/**
 * Returns the closest DOM element ancestor to the given Element on input
 * that is positioned - being it has a css `position` value of `fixed`,
 * `relative` or `absolute`.
 *
 * @param {HTMLElement} ele
 *
 * @return {HTMLElement}
 */
function domPositionedParent(ele) {
    if (!ele) {
        return ROOT
    }

    let ELE_ROOT = ele.ownerDocument && ele.ownerDocument.documentElement ? ele.ownerDocument.documentElement : ROOT;

    if (!ele.parentElement || ele.parentElement === ELE_ROOT) {
        return ELE_ROOT;
    }

    let parentEle = ele.parentElement;

    if (IS_POSITIONED.test(window.getComputedStyle(parentEle).getPropertyValue("position"))) {
        return parentEle;
    }

    return domPositionedParent(parentEle);
}

export default domPositionedParent;