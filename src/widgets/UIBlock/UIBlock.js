import Widget           from "../../jsutils/Widget"
import dataStore        from "../../jsutils/dataStore"
import objectExtend     from "../../jsutils/objectExtend"
import fillTemplate     from "../../jsutils/fillTemplate"
import parseHTML        from "../../jsutils/parseHTML"
import domAddClass      from "../../domutils/domAddClass"
import domRemoveClass   from "../../domutils/domRemoveClass"
import UIBlockTemplate  from "text!./UIBlock.html"
import "./UIBlock.less"

const PRIVATE                 = dataStore.create();
const CSS_BASE_CLASS          = "my-uiblock";
const CSS_CLASS_PARENT_CNTR   = CSS_BASE_CLASS + "-cntr";
/**
 * Widget to block the UI from user interactions. Widget will
 * extend the full width and height of element to which it is
 * appended to.
 *
 * @class UIBlock
 * @extend Widget
 *
 * @param {Object} [options]
 * @param {String} [options.message="Please wait..."]
 */
const UIBlock = Widget.extend(/** @lends UIBlock.prototype */{
    init: function(options){
        var inst = {
            opt: objectExtend({}, UIBlock.defaults, options)
        };

        PRIVATE.set(this, inst);

        this.$ui = parseHTML(
            fillTemplate(UIBlockTemplate, inst.opt)
        ).firstChild;

        inst.$msg = this.$ui.querySelector("." + CSS_BASE_CLASS + "-msg");
    },

    show: function(){
        var $parentNode = this.getEle().parentNode;
        if ($parentNode) {
            domAddClass($parentNode, CSS_CLASS_PARENT_CNTR);
        }
        return Widget.prototype.show.apply(this, arguments);
    },

    hide: function(){
        var $parentNode = this.getEle().parentNode;
        if ($parentNode) {
            domRemoveClass($parentNode, CSS_CLASS_PARENT_CNTR);
        }
        return Widget.prototype.hide.apply(this, arguments);
    },

    /**
     * Sets the message to be shown
     * @param {String} msg
     */
    setMessage: function(msg){
        if (msg) {
            PRIVATE.get(this).$msg.textContent = msg;
        }
    }
});

UIBlock.defaults = {
    message: "Please wait..."
};

export default UIBlock;