define(function(){
    /**
     * Finds Elements within a given HTML Element using `querySelectorAll` and
     * return an Array with those elements.
     *
     * @function domFind
     *
     * @param {HTMLElement} domEle
     * @param {String} selector
     *
     * @returns {Array<HTMLElement>}
     */
    return function(domEle, selector){
        return Array.prototype.slice.call(domEle.querySelectorAll(selector));
    };
});
