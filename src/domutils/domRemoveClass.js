define(function(){
    /**
     * removes a class from an element
     *
     * @param {HTMLElement} el
     * @param {String} cssClass
     */
    return function(el, cssClass){
        return el.classList.remove(cssClass);
    };
});