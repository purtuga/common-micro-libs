define(function(){
    /**
     * Adds class to an element
     *
     * @function domAddClass
     *
     * @param {HTMLElement}
     * @param {String}
     */
    return function(el, cssClass){
        return el.classList.add(cssClass);
    };
});