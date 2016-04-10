define(function(){
    /**
     * Adds class to an element
     *
     * @function domAddClass
     *
     * @param {HTMLElement} el
     * @param {String} cssClass
     */
    return function(el, cssClass){
        return el.classList.add(cssClass);
    };
});