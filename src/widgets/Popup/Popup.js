import Widget               from "../../jsutils/Widget";
import parseHTML            from "../../jsutils/parseHTML";
import objectExtend         from "../../jsutils/objectExtend";
import dataStore            from "../../jsutils/dataStore";
import domPosition          from "../../domutils/domPosition";
import domAddEventListener  from "../../domutils/domAddEventListener";
import popupTemplate        from "./popup.html";
import "./popup.less";

var
PRIVATE = dataStore.create(),
BODY = document.body,

/**
 * Displays a popup relative to a given element (attached to).
 *
 * @class Popup
 * @extends Widget
 *
 * @param {Object} [options]
 * @param {Widget|HTMLElement} [options.content]
 * @param {HTMLElement} [options.attachTo]
 * @param {Object} [options.position]
 *  Object with any param accepted by `domPosition` utility.
 *  Example:
 *
 *      {
 *          my: "top right",
 *          at: "bottom right"
 *      }
 * @param {Function} [options.onHide]
 *  A function that is called when the dialog is hidden due
 *  to the user clicking outiside of it. If this function
 *  return `true`, then the dialog will not be hidden.
 *  Function is given the DOM event object
 *
 */
Popup = {
    init: function(options){
        var inst = {
            opt:            objectExtend({}, this.getFactory().defaults, options),
            $ele:           null,
            domListeners:   []
        };

        PRIVATE.set(this, inst);

        this.$ui = parseHTML(popupTemplate).firstChild;

        if (inst.opt.content) {
            this.setContent(inst.opt.content);
        }

        if (inst.opt.attachTo) {
            this.attachTo(inst.opt.attachTo);
        }

        this.onDestroy(removeAllDomListeners.bind(this));
    },

    /**
     * Sets the content of the popup
     *
     * @param {Widget|HTMLElement} [content]
     */
    setContent: function(content){
        var $ui = this.getEle();

        $ui.textContent = "";

        if (!content){
            return;
        }

        if (content.appendTo) {
            content.appendTo($ui);

        } else if ("childNodes" in content) {
            $ui.appendChild(content);
        }
        if (this.isVisible()) {
            this.show(); // To re-evaluate position
        }
    },

    /**
     * Attaches the popup to a given element
     *
     * @param {HTMLElement|Widget} ele
     */
    attachTo: function(ele){
        var inst = PRIVATE.get(this);

        if (ele.getEle) {
            ele = ele.getEle();
        }

        inst.$ele = ele;

        if (this.isVisible()) {
            this.show();
        }
    },

    show: function(){
        var inst    = PRIVATE.get(this),
            $ui     = this.getEle();

        if (!inst.$ele) {
            return;
        }

        this.appendTo(BODY);
        domPosition($ui, inst.$ele, inst.opt.position);
        removeAllDomListeners.call(this);

        setTimeout(function(){
            inst.domListeners.push(
                domAddEventListener(BODY, "click", function(ev){
                    if (!$ui.contains(ev.target)) {
                        if (inst.opt.onHide && inst.opt.onHide(ev)) {
                            return;
                        }

                        this.hide();
                    }
                }.bind(this))
            );
        }.bind(this), 200);
    },

    hide: function(){
        this.detach();
        removeAllDomListeners.call(this);
    }
},
/**
 * Removes the DOM listeners
 * @private
 */
removeAllDomListeners = function(){
    var domListeners = PRIVATE.get(this).domListeners;
    if (domListeners.length) {
        var evListener;
        while (evListener = domListeners.shift()) {
            evListener.remove();
        }
    }
};

Popup = Widget.extend(Popup);

Popup.defaults = {
    content:    null,
    attachTo:   null,
    position:   null,
    onHide:     null
};

export default Popup;
