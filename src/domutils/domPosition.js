var PX = "px";

/**
 * Positions an element against another.
 *
 * @function domPosition
 *
 * @param {HTMLElement} positionEle
 * @param {HTMLElement} anchorEle
 *
 */
export default function domPosition(positionEle, anchorEle/*, options*/){
    var positionEleStyles   = positionEle.style,
        anchorElePosition   = anchorEle.getBoundingClientRect();

    positionEleStyles.left = anchorElePosition.left + PX;
    positionEleStyles.top  = (anchorElePosition.bottom + document.body.scrollTop) + PX;
}
