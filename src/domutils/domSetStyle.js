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
        Object.key(styles).forEach(function(prop){
            el.styles[prop] = styles[prop];
        });
    };
});
