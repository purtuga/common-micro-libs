define(function(){
    /**
     * Toggles a CSS class on/off on an element
     *
     * @function domToggleClass
     *
     * @param {HTMLElement} ele
     * @param {String} cssClass
     */
    return function(el, cssClass){
        return el.classList.toggle(cssClass);
    };
});