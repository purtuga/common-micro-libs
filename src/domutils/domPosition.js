define(function(){
    var PX = "px";

    /**
     * Positions an element against another.
     *
     * @param {HTMLElement} positionEle
     * @param {HTMLElement} anchorEle
     *
     */
    return function(positionEle, anchorEle/*, options*/){
        var positionEleStyles   = positionEle.style,
            anchorElePosition   = anchorEle.getBoundingClientRect();

        positionEleStyles.left = anchorElePosition.left + PX;
        positionEleStyles.top  = anchorElePosition.bottom + PX;
    };

});
