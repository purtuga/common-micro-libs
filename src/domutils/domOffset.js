/**
 * Get an element's current position (`top`, `left`) relative to document that it
 * is displayed in.
 *
 * @param ele
 * @returns {{top: number, left: number}}
 */
export default function domOffset(ele) {
    // Borrowed from jQuery.

    if ( !ele ) {
        return { top: 0, left: 0 };
    }

    // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
    // Support: IE <=11 only
    // Running getBoundingClientRect on a
    // disconnected node in IE throws an error
    if ( !ele.getClientRects().length ) {
        return { top: 0, left: 0 };
    }

    let eleRect         = ele.getBoundingClientRect();
    let eleOwnerDoc     = ele.ownerDocument;
    let eleOwnerDocEle  = eleOwnerDoc.documentElement;
    let eleOwnerDocWin  = eleOwnerDoc.defaultView;

    return {
        top:    eleRect.top + eleOwnerDocWin.pageYOffset - eleOwnerDocEle.clientTop,
        left:   eleRect.left + eleOwnerDocWin.pageXOffset - eleOwnerDocEle.clientLeft
    };
}