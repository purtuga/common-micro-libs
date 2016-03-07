define([
    "./Compose"
], function(
    Compose
){

    /**
     * Base class for a Widget
     *
     * @class Widget
     */
    var Widget = /** @lends Widget.prototype */{

        init: function(){
            var me = this;
            me.onDestroy(function(){
                var $ui = me.getEle();
                if ($ui && $ui.parentNode) {
                    $ui.parentNode.removeChild($ui);
                }
                me.$ui = null;
            });
        },

        /**
         * The widget HTML Element
         *
         * @type {HTMLElement}
         */
        $ui: null,

        /**
         * Returns the Widget DOM element.
         * If current object instance has a property name `$ui`, that will be returned
         * by this method. Should be implemented by specfic widget if this pattern
         * is not implemented.
         *
         * @return {DOMElement}
         */
        getEle: function(){
            if (this.$ui) {
                return this.$ui;
            }
        },

        /**
         * Checks if the Widget is visible.  Depends on `getEle` returning the widget's
         * UI element.
         *
         * @return {Boolean}
         */
        isVisible: function(){
            var $ui = this.getEle();

            return !!(
                $ui.offsetWidth     ||
                $ui.offsetHeight    ||
                $ui.getClientRects().length
            );
        },

        /**
         * Checks the widget visibility (`isVisible`) and then updates it to
         * the opposite state.
         */
        toggle: function(){
            var me = this;
            if (me.isVisible()){
                me.hide();
            } else {
                me.show();
            }
        },

        /**
         * Makes widget UI visible
         */
        show: function(){
            this.getEle().style.display = "block";
        },

        /**
         * Hides the widget UI
         */
        hide: function(){
            this.getEle().style.display = "none";
        },

        /**
         * Appends the Widget to a given element.
         *
         * @param {HTMLElement} cntr
         */
        appendTo: function(cntr){
            if (cntr && cntr.appendChild) {
                cntr.appendChild(this.getEle());
            }
        }
    }; // end: Widget

    Widget = Compose.extend(Widget);

    return Widget;
});


