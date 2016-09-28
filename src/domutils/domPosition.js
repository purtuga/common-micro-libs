import objectExtend from "../jsutils/objectExtend"

const PX        = "px";
const isTop     = /top/i;
const isBottom  = /bottom/i;
const isLeft    = /left/i;
const isRight   = /right/i;


/**
 * Positions an element against another. Elements (both `positionEle` and
 * `anchorEle` should already be visible in dom (ex. call this method right
 * after adding them to DOM).
 *
 * @function domPosition
 *
 * @param {HTMLElement} positionEle
 * @param {HTMLElement} anchorEle
 * @param {Object} [options]
 * @param {String} [options.my]
 *  Which area of the `positionEle` should be used to position it against the
 *  `anchorEle`. Default is `top left`. Possible values:
 *  -   `top left`
 *  -   `top right`
 * @param {String} [options.at]
 */
export default function domPosition(positionEle, anchorEle, options){
    var positionEleStyles   = positionEle.style;
    var anchorEleRect       = anchorEle.getBoundingClientRect();
    var positionEleRect     = positionEle.getBoundingClientRect();
    var scrollTop           = document.body.scrollTop;

    var opt = objectExtend({
        my: "top left",
        at: "bottom left"
    }, options);

    var isMyLeft    = isLeft.test(opt.my);
    var isMyRight   = !isMyLeft;
    var isAtLeft    = isLeft.test(opt.at);
    var isAtRight   = !isAtLeft;

    // Set default coordinates based o above position defaults
    var posLeft = anchorEleRect.left;
    var posTop  = anchorEleRect.bottom + scrollTop;

    //------------------------------------------
    //  calculate LEFT
    //------------------------------------------
    // my === left  &&  at === right
    if (isMyLeft && isAtRight) {
        posLeft = anchorEleRect.right;

    // my === left  &&  at === right
    } else if (isMyRight && isAtRight) {
        posLeft = anchorEleRect.right - positionEleRect.width;

    // my === right  &&  at === left
    } else if (isMyRight && isAtLeft) {
        posLeft = anchorEleRect.left - positionEleRect.width;
    }


    positionEleStyles.left = posLeft + PX;
    positionEleStyles.top  = posTop + PX;
}
