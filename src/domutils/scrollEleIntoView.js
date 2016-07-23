define(function(){

    /**
     * Given an element that is inside of a Scrolling Element
     * (one that has a fixed height with overflow), this utiltiy
     * will manipulate the Scrolling element's `scrollTop` so that
     * the Element is made visible in the area provided by the
     * Scrolling Element.
     *
     * @param {HTMLElement} ele
     * @param {HTMLElement} scrollingParent
     */
    return function scrollEleIntoView(ele, scrollingParent){
        if (!ele || !scrollingParent || !scrollingParent.contains(ele)) {
            return;
        }

        var parentScrollTop = scrollingParent.scrollTop,
            parentHeight    = scrollingParent.clientHeight,
            eleHeight       = ele.clientHeight,
            parentClientRect= scrollingParent.getBoundingClientRect(),
            eleClientRect   = ele.getBoundingClientRect();

        if (eleClientRect.top < parentClientRect.top) {
            scrollingParent.scrollTop = (parentScrollTop + eleClientRect.top) - parentClientRect.top;

        } else if (eleClientRect.bottom > parentClientRect.bottom) {
            scrollingParent.scrollTop = (parentScrollTop + eleClientRect.top) - parentClientRect.top - parentHeight + eleHeight;
        }
    };
});