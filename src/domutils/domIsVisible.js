define(function(){
    /**
     * Checks if a given HTML Element is visible
     *
     * @param {HTMLElement} el
     *
     * @return {Boolean}
     */
    return function(el){
        return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length );
    };
});
