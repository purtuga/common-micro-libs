import Compose        from "./Compose"
import dataStore      from "./dataStore"
import domAddClass    from "../domutils/domAddClass"
import domRemoveClass from "../domutils/domRemoveClass"

import "./styles/widget"


var
CSS_CLASS_BASE = "my-widget",
CSS_CLASS_HIDE = CSS_CLASS_BASE + "-hide",

/**
 * Base class for a Widget
 *
 * @class Widget
 * @extends Compose
 *
 */
Widget = /** @lends Widget.prototype */{

    init: function(){
        var me = this;
        me.onDestroy(function(){
            destroy.call(me);
        });
    },

    destroy: function(){
        destroy.call(this);
        Compose.prototype.destroy.call(this);
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
        domRemoveClass(this.getEle(), CSS_CLASS_HIDE);
    },

    /**
     * Hides the widget UI
     */
    hide: function(){
        domAddClass(this.getEle(), CSS_CLASS_HIDE);
    },

    /**
     * Appends the Widget to a given element.
     *
     * @param {HTMLElement|Widget} cntr
     */
    appendTo: function(cntr){
        if (cntr && cntr.appendChild) {
            cntr.appendChild(this.getEle());
        }
        if (cntr && cntr.getEle) {
            cntr.getEle().appendChild(this.getEle());
        }
    },

    /**
     * Removes the Widget from it's parent (removes it from DOM)
     */
    detach: function(){
        var ui = this.getEle();
        if (ui && ui.parentNode) {
            ui.parentNode.removeChild(ui);
        }
    }
}; // end: Widget

/**
 * @private
 */
function destroy() {
    var $ui = this.getEle();
    if ($ui && $ui.parentNode) {
        $ui.parentNode.removeChild($ui);
    }
    this.$ui = null;
}

Widget = Compose.extend(Widget);

export default Widget;



