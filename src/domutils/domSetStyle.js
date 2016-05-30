define(function(){
    /**
     * Sets styles on an element
     *
     * @function domSetStyle
     *
     * @param {HTMLElement} el
     * @param {Object} styles
     *
     * @example
     *
     * domSetStyle(document.body, {"background-color", "yellow"});
     */
    return function(el, styles){
        if (!el || typeof styles !== "object"){
            return;
        }
        Object.keys(styles).forEach(function(prop){
            el.style[prop] = styles[prop];
        });
    };
});
