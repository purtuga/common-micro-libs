import domPositionedParent from "./domPositionedParent"

/**
 * Get an element's position (`top`, `left`) relative to document that it
 * is displayed in. This method take into consideration any scrolling the
 * document may currently have, so that the return value is always consistent
 * as if the document was not scrolled at all.
 *
 * @param {HTMLElement} ele
 *
 * @param {Boolean} [fromOffsetParent=false]
 *  If true, then the `left`/`top` values of `ele` will be calculated against
 *  its positioned parent element - which might not be the viewport.
 *
 * @returns {{top: number, left: number}}
 */
export function domOffset(ele, fromOffsetParent) {
    // some of this was borrowed from jQuery.

    if ( !ele ) {
        return { top: 0, left: 0 };
    }

    // If element is not attached or is the window or document, then exit
    if (!ele.getClientRects || !ele.getClientRects().length ) {
        return { top: 0, left: 0 };
    }

    let eleRect         = ele.getBoundingClientRect();
    let eleOwnerDoc     = ele.ownerDocument;
    let eleOwnerDocEle  = eleOwnerDoc.documentElement;
    let response        = {
        top:    eleRect.top,
        left:   eleRect.left
    };

    if (fromOffsetParent){
        let elePositionedParent = domPositionedParent(ele);

        if (elePositionedParent !== eleOwnerDocEle) {
            let eleParentOffset     = domOffset(elePositionedParent);

            response.top    = response.top - eleParentOffset.top ;      // eleParentOffset.scrollTop - eleParentOffset.clientTop;
            response.left   = response.left - eleParentOffset.left;      // eleParentOffset.scrollLeft - eleParentOffset.clientLeft;

            return response;
        }
    }

    let eleOwnerDocWin  = eleOwnerDoc.defaultView;

    response.top    += eleOwnerDocWin.pageYOffset - eleOwnerDocEle.clientTop;
    response.left   += eleOwnerDocWin.pageXOffset - eleOwnerDocEle.clientLeft;

    return response;
}
export default domOffset;