/**
 * Applies a fixed height to an element based on its parent. This utility can help
 * with cases where we want a scrolling element to fill the height of a parent
 * element.
 *
 * @function fitToParent
 *
 * @param {HTMLElement} ele
 *  The element whose parent will be used in the calculation of the height
 *
 * @param {Number} [offset]
 *  The additional Offset to be used in calculating the height. Could be
 *  a negative number.
 *
 * @param {HTMLElement} [$adjustEle]
 *  The Element that will have the height applied to. Defaults to the
 *  `options.ele` input param value.  Example: set this if wanting to
 *  make an element inside of the `options.ele` to receive the fixed height
 *
 */
export function fitToParent(ele, offset, $adjustEle){
    if ($adjustEle && !$adjustEle.parentElement) {
        return;
    }

    var
    $ui                 = ele,
    $scrollEle          = $adjustEle || $ui,
    $parent             = $ui.parentElement,
    parentComputedStyle = window.getComputedStyle($parent, null);

    if (typeof offset !== "number") { offset = 0; }

    // Add the parent element's padding into the offset
    offset += ["padding-top", "padding-bottom"].reduce(function(pxCount, cssProperty){
        return (pxCount += Number(parentComputedStyle.getPropertyValue(cssProperty).replace(/[a-zA-Z%]/g,"")));
    }, 0);

    $scrollEle.style.height = (
            $parent.clientHeight - (($ui.offsetHeight - $scrollEle.offsetHeight) + offset)
        ) + "px";
}
export default fitToParent;

