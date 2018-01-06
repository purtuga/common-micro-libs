import objectExtend from "../jsutils/objectExtend"

const WINDOW        = window;
const DOCUMENT      = WINDOW.document;
const SCROLL_TOP    = "scrollTop";
const SCROLL_LEFT   = "scrollLeft";
const PAGE_Y_OFFSET = "pageYOffset";
const PAGE_X_OFFSET = "pageXOffset";
const UNDEFINED     = "undefined";
const PX            = "px";

//const isTop     = /top/i;
//const isBottom  = /bottom/i;
const isLeft    = /left/i;
//const isRight   = /right/i;


/**
 * Positions an element against another. Elements (both `positionEle` and
 * `anchorEle` should already be visible in dom (ex. call this method right
 * after adding them to DOM).
 *
 * @function domPosition
 *
 * @param {HTMLElement} positionEle
 *
 * @param {HTMLElement} anchorEle
 *
 * @param {Object} [options]
 * 
 * @param {String} [options.my]
 *  Which area of the `positionEle` should be used to position it against the
 *  `anchorEle`. Default is `top left`. Possible values:
 *  -   `top left`
 *  -   `top right`
 *
 * @param {String} [options.at]
 *  The `anchorEle` position where the `positionEle` should be displayed. Default
 *  is `bottom left` (so right below the `anchorEle`, left aligned).
 *
 * @param {HTMLElement} [options.viewport=window]
 *  The viewport to be used in detecting collision. (NOTE: currently,
 *  only window is supported)
 *
 */
export function domPosition(positionEle, anchorEle, options){
    var positionEleStyles   = positionEle.style;
    var anchorEleRect       = anchorEle.getBoundingClientRect();
    var positionEleRect     = positionEle.getBoundingClientRect();
    var opt                 = objectExtend({
        my:         "top left",
        at:         "bottom left",
        viewport:   WINDOW
    }, options);
    var { scrollTop, scrollLeft } = getViewportScrollInfo(opt.viewport); // FIXME: support for non-window viewport

    // FIXME: support for non window viewport
    // var viewportTop     = 0;
    var viewportBottom  = opt.viewport.innerHeight;
    var viewportRight   = opt.viewport.innerWidth;

    var isMyLeft    = isLeft.test(opt.my);
    var isMyRight   = !isMyLeft;
    var isAtLeft    = isLeft.test(opt.at);
    var isAtRight   = !isAtLeft;

    // Set default coordinates based o above position defaults
    var posLeft = anchorEleRect.left;
    var posTop  = anchorEleRect.bottom + scrollTop;

    //------------------------------------------
    // CALCULATE: TOP
    // Top side of position ele
    //------------------------------------------

    // FIXME: support for "my" === bottom as well as "at" top


    //------------------------------------------
    // CALCULATE: LEFT
    // Left side of the position el
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

    //------------------------------------------------------
    // Adjust positions based on viewport collisions
    //------------------------------------------------------

    //--- LEFT --\\
    // If the Right side of the position element goes beyound
    // the right side of the viewport, flip the horizontal position...
    if ((posLeft + positionEleRect.width) > (viewportRight + scrollLeft)) {
        posLeft -= positionEleRect.width;
    }

    //--- TOP --\\
    // If it the position of the element goes beyond the bottom of
    // the viewport, flip it up...
    if ((posTop + positionEleRect.height) > (viewportBottom + scrollTop)) {
        posTop -= (positionEleRect.height + anchorEleRect.height);
    }

    positionEleStyles.left = posLeft + PX;
    positionEleStyles.top  = posTop + PX;
}

export default domPosition;


/**
 * returns the `scrollTop` and `scrollLeft` for a given element
 *
 * @param {HTMLElement|Window|Document} viewport
 * @returns {Object}
 *
 * @example
 *
 * // return object:
 *
 * {
 *      scrollTop:      222,
 *      scrollLeft:     11
 * }
 *
 */
function getViewportScrollInfo(viewport) {
    let response = {};

    if (viewport === WINDOW || viewport === DOCUMENT){
        if (typeof WINDOW[PAGE_Y_OFFSET] !== UNDEFINED){
            response[SCROLL_TOP]    = WINDOW[PAGE_Y_OFFSET];
            response[SCROLL_LEFT]   = WINDOW[PAGE_X_OFFSET];

        } else if (DOCUMENT.documentElement) {
            response[SCROLL_TOP]    = DOCUMENT.documentElement[SCROLL_TOP];
            response[SCROLL_LEFT]   = DOCUMENT.documentElement[SCROLL_LEFT];

        } else {
            response[SCROLL_TOP]    = DOCUMENT.body[SCROLL_TOP];
            response[SCROLL_LEFT]   = DOCUMENT.body[SCROLL_LEFT];
        }
    } else {
        response[SCROLL_TOP]    = viewport[SCROLL_TOP];
        response[SCROLL_LEFT]   = viewport[SCROLL_LEFT];
    }

    return response;
}
