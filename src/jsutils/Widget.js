import Compose          from "./Compose"
import domAddClass      from "../domutils/domAddClass"
import domRemoveClass   from "../domutils/domRemoveClass"
import domChildren      from "../domutils/domChildren"

import "./styles/widget.less"

//============================================================================
const CSS_CLASS_BASE = "my-widget";
const CSS_CLASS_HIDE = CSS_CLASS_BASE + "-hide";

/**
 * Base class for a Widget
 *
 * @class Widget
 * @extends Compose
 *
 */
const Widget = Compose.extend(/** @lends Widget.prototype */{

    init: function(){
        const me = this;
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
     * @return {HTMLElement}
     */
    getEle: function(){
        return this.$ui;
    },

    /**
     * Checks if the Widget is visible.  Depends on `getEle` returning the widget's
     * UI element.
     *
     * @return {Boolean}
     */
    isVisible: function(){
        const $ui = this.getEle();

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
        const me = this;
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
     * @param {Number} [atPosition]
     *  Position where element should be placed inside of the `cntr`.
     *  Default is at the bottom (after last item). Zero based
     */
    appendTo: function(cntr, atPosition){
        if (!cntr) {
            return;
        }

        let $ele        = this.getEle();
        let $cntrEle    = cntr.appendChild ? cntr : cntr.getEle ? cntr.getEle() : null;

        if (!$cntrEle) {
            return;
        }

        if (typeof atPosition === "undefined") {
            $cntrEle.appendChild($ele);
            return;
        }

        let cntrChildren = domChildren($cntrEle);

        if (cntrChildren[atPosition]) {
            $cntrEle.insertBefore($ele, cntrChildren[atPosition]);

        } else {
            $cntrEle.appendChild($ele);
        }
    },

    /**
     * Removes the Widget from it's parent (removes it from DOM)
     */
    detach: function(){
        const ui = this.getEle();
        if (ui && ui.parentNode) {
            ui.parentNode.removeChild(ui);
        }
    }
});

/**
 * @private
 */
function destroy() {
    this.detach();
    this.$ui = null;
}

export default Widget;
export { Widget };
